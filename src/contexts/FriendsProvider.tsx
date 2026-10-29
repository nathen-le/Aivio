import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  acceptFriendRequest,
  removeFriendRequest,
  removeFriendship,
  sendFriendRequest,
} from '../lib/friends';
import {
  ensureOwnPublicProfile,
  fetchPublicProfile,
  findPublicProfileByUsername,
} from '../lib/publicProfile';
import type { PublicProfile } from '../lib/publicProfile';
import { normalizeUsername, validateUsername } from '../lib/username';
import { FriendsContext } from './friends-context';
import type { ActionOutcome, PersonEntry, Relation } from './friends-context';

const ok = (message: string): ActionOutcome => ({ ok: true, message });
const fail = (message: string): ActionOutcome => ({ ok: false, message });
const GENERIC_FAILURE = 'Something went wrong. Check your connection and try again.';

/**
 * Owns this learner's social graph for the whole signed-in session: three
 * listeners (friendships, incoming requests, outgoing requests) and a cache of
 * the public profiles they point to. Mounted per account (keyed by uid), so
 * switching accounts can never show the previous account's friends.
 */
export function FriendsProvider({ uid, children }: { uid: string; children: ReactNode }) {
  const [friendUids, setFriendUids] = useState<string[] | null>(null);
  const [incomingUids, setIncomingUids] = useState<string[] | null>(null);
  const [outgoingUids, setOutgoingUids] = useState<string[] | null>(null);
  const [listenerFailed, setListenerFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [profiles, setProfiles] = useState<Record<string, PublicProfile | null>>({});
  const [busyUids, setBusyUids] = useState<ReadonlySet<string>>(new Set());

  const requestedProfiles = useRef(new Set<string>());
  const publishedRef = useRef<Promise<void> | null>(null);

  // Publish/refresh my own public profile once per session.
  useEffect(() => {
    const user = auth.currentUser;
    publishedRef.current = ensureOwnPublicProfile(uid, user?.email ?? '', user?.displayName ?? '').catch(
      (e) => {
        console.error('Could not publish public profile:', e instanceof Error ? e.message : e);
        throw e;
      },
    );
    publishedRef.current.catch(() => undefined);
  }, [uid]);

  // Live social graph. Every query filters by my own UID, as the rules require.
  useEffect(() => {
    let cancelled = false;
    const onError = (e: { code?: string }) => {
      if (cancelled) return;
      console.error('Friends listener failed:', e.code);
      setListenerFailed(true);
    };
    const unsubs = [
      onSnapshot(
        query(collection(db, 'friendships'), where('members', 'array-contains', uid)),
        (snap) =>
          setFriendUids(
            snap.docs.map((d) => (d.data().members as string[]).find((m) => m !== uid) ?? '').filter(Boolean),
          ),
        onError,
      ),
      onSnapshot(
        query(collection(db, 'friendRequests'), where('toUid', '==', uid)),
        (snap) => setIncomingUids(snap.docs.map((d) => d.data().fromUid as string)),
        onError,
      ),
      onSnapshot(
        query(collection(db, 'friendRequests'), where('fromUid', '==', uid)),
        (snap) => setOutgoingUids(snap.docs.map((d) => d.data().toUid as string)),
        onError,
      ),
    ];
    return () => {
      cancelled = true;
      unsubs.forEach((u) => u());
    };
  }, [uid, attempt]);

  // Fetch each person's public profile once and cache it for the session.
  useEffect(() => {
    const wanted = [...(friendUids ?? []), ...(incomingUids ?? []), ...(outgoingUids ?? [])];
    for (const other of wanted) {
      if (requestedProfiles.current.has(other)) continue;
      requestedProfiles.current.add(other);
      fetchPublicProfile(other)
        .then((profile) => setProfiles((prev) => ({ ...prev, [other]: profile })))
        .catch(() => requestedProfiles.current.delete(other));
    }
  }, [friendUids, incomingUids, outgoingUids]);

  const toEntries = useCallback(
    (uids: string[] | null): PersonEntry[] =>
      (uids ?? []).map((other) => ({ uid: other, profile: profiles[other] ?? null })),
    [profiles],
  );

  const friends = useMemo(() => toEntries(friendUids), [toEntries, friendUids]);
  const incoming = useMemo(() => toEntries(incomingUids), [toEntries, incomingUids]);
  const outgoing = useMemo(() => toEntries(outgoingUids), [toEntries, outgoingUids]);

  const relationOf = useCallback(
    (other: string): Relation => {
      if (other === uid) return 'self';
      if (friendUids?.includes(other)) return 'friend';
      if (incomingUids?.includes(other)) return 'incoming';
      if (outgoingUids?.includes(other)) return 'outgoing';
      return 'none';
    },
    [uid, friendUids, incomingUids, outgoingUids],
  );

  const status: 'loading' | 'ready' | 'error' = listenerFailed
    ? 'error'
    : friendUids && incomingUids && outgoingUids
      ? 'ready'
      : 'loading';

  const retry = useCallback(() => {
    setListenerFailed(false);
    setFriendUids(null);
    setIncomingUids(null);
    setOutgoingUids(null);
    setAttempt((n) => n + 1);
  }, []);

  /** Runs an action with per-person busy tracking and uniform error handling. */
  const run = useCallback(
    async (other: string, action: () => Promise<ActionOutcome>): Promise<ActionOutcome> => {
      let alreadyBusy = false;
      setBusyUids((prev) => {
        alreadyBusy = prev.has(other);
        return alreadyBusy ? prev : new Set(prev).add(other);
      });
      if (alreadyBusy) return fail('Still working on that. One moment.');
      try {
        return await action();
      } catch (e) {
        console.error('Friend action failed:', (e as { code?: string })?.code ?? e);
        return fail(GENERIC_FAILURE);
      } finally {
        setBusyUids((prev) => {
          const next = new Set(prev);
          next.delete(other);
          return next;
        });
      }
    },
    [],
  );

  const sendRequest = useCallback(
    (other: string) =>
      run(other, async () => {
        try {
          await publishedRef.current;
        } catch {
          return fail("Your public profile couldn't be set up yet. Reload and try again.");
        }
        const result = await sendFriendRequest(db, uid, other);
        switch (result) {
          case 'sent': return ok('Friend request sent!');
          case 'accepted': return ok("You're now friends!");
          case 'already-friends': return fail("You're already friends.");
          case 'already-sent': return fail('You already sent this person a request.');
          case 'self': return fail("You can't add yourself.");
        }
      }),
    [run, uid],
  );

  const sendRequestByUsername = useCallback(
    async (raw: string): Promise<ActionOutcome> => {
      const username = normalizeUsername(raw.replace(/^@/, ''));
      if (!username) return fail('Please enter a username.');
      if (validateUsername(username) && !/^[a-z0-9_]{3,20}$/.test(username)) {
        return fail('Usernames use letters, numbers and underscores (3–20 characters).');
      }
      let target: PublicProfile | null;
      try {
        target = await findPublicProfileByUsername(username);
      } catch {
        return fail(GENERIC_FAILURE);
      }
      if (!target) return fail(`No learner found with the username @${username}.`);
      return sendRequest(target.uid);
    },
    [sendRequest],
  );

  const acceptRequest = useCallback(
    (other: string) =>
      run(other, async () => {
        const result = await acceptFriendRequest(db, uid, other);
        if (result === 'accepted') return ok("You're now friends!");
        if (result === 'already-friends') return ok("You're already friends.");
        return fail('That request is no longer available. It may have been cancelled.');
      }),
    [run, uid],
  );

  const declineRequest = useCallback(
    (other: string) =>
      run(other, async () => {
        await removeFriendRequest(db, uid, other);
        return ok('Request declined.');
      }),
    [run, uid],
  );

  const cancelRequest = useCallback(
    (other: string) =>
      run(other, async () => {
        await removeFriendRequest(db, uid, other);
        return ok('Request cancelled.');
      }),
    [run, uid],
  );

  const removeFriend = useCallback(
    (other: string) =>
      run(other, async () => {
        await removeFriendship(db, uid, other);
        return ok('Friend removed.');
      }),
    [run, uid],
  );

  const value = useMemo(
    () => ({
      status, friends, incoming, outgoing, relationOf, busyUids,
      sendRequest, sendRequestByUsername, acceptRequest, declineRequest, cancelRequest, removeFriend, retry,
    }),
    [status, friends, incoming, outgoing, relationOf, busyUids,
      sendRequest, sendRequestByUsername, acceptRequest, declineRequest, cancelRequest, removeFriend, retry],
  );

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}
