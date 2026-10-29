import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Compass, Search, UserPlus, UserCheck, Clock, Check, X, Loader2, RefreshCw } from 'lucide-react';
import type { DocumentSnapshot } from 'firebase/firestore';
import { sound } from '../utils/sound';
import { useAuth } from '../hooks/useAuth';
import { useFriends } from '../hooks/useFriends';
import type { ActionOutcome } from '../hooks/useFriends';
import { listPublicProfiles } from '../lib/publicProfile';
import type { PublicProfile } from '../lib/publicProfile';
import { normalizeUsername } from '../lib/username';
import { PersonAvatar, personName } from '../components/PersonAvatar';

type LoadState = 'loading' | 'ready' | 'error';

export const LocalPage: React.FC = () => {
  const { user } = useAuth();
  const { relationOf, busyUids, sendRequest, acceptRequest } = useFriends();

  const [search, setSearch] = useState('');
  const [prefix, setPrefix] = useState('');
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [cursor, setCursor] = useState<DocumentSnapshot | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const requestId = useRef(0);
  const toastTimer = useRef<number | null>(null);

  // Debounce the search box into the query prefix.
  useEffect(() => {
    const t = window.setTimeout(() => setPrefix(normalizeUsername(search.replace(/^@/, ''))), 350);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  // First page for the current search. A newer search supersedes an older one.
  useEffect(() => {
    const id = ++requestId.current;
    (async () => {
      setState('loading');
      setMoreFailed(false);
      try {
        const page = await listPublicProfiles({ prefix });
        if (id !== requestId.current) return;
        setProfiles(page.profiles);
        setCursor(page.cursor);
        setState('ready');
      } catch (e) {
        if (id !== requestId.current) return;
        console.error('Local directory failed to load:', (e as { code?: string })?.code ?? e);
        setState('error');
      }
    })();
  }, [prefix, attempt]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    const id = requestId.current;
    setLoadingMore(true);
    setMoreFailed(false);
    try {
      const page = await listPublicProfiles({ prefix, after: cursor });
      if (id !== requestId.current) return;
      setProfiles((prev) => {
        const seen = new Set(prev.map((p) => p.uid));
        return [...prev, ...page.profiles.filter((p) => !seen.has(p.uid))];
      });
      setCursor(page.cursor);
    } catch {
      if (id === requestId.current) setMoreFailed(true);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore, prefix]);

  const toast = (outcome: ActionOutcome) => {
    outcome.ok ? sound.playCorrect() : sound.playIncorrect();
    setFeedback({ text: outcome.message, ok: outcome.ok });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setFeedback(null), 3500);
  };

  const visible = profiles.filter((p) => p.uid !== user?.uid);

  const actionFor = (p: PublicProfile) => {
    const relation = relationOf(p.uid);
    const busy = busyUids.has(p.uid);
    const base = 'w-full py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5';

    if (relation === 'friend') {
      return (
        <div className={`${base} bg-emerald-950/50 text-emerald-300 border-2 border-emerald-500/30`}>
          <UserCheck className="w-3.5 h-3.5" /> Friends
        </div>
      );
    }
    if (relation === 'outgoing') {
      return (
        <div className={`${base} bg-[#142344] text-amber-300 border-2 border-[#1c325c]`}>
          <Clock className="w-3.5 h-3.5" /> Request sent
        </div>
      );
    }
    if (relation === 'incoming') {
      return (
        <button
          disabled={busy}
          onClick={async () => toast(await acceptRequest(p.uid))}
          className={`${base} bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 border-b-2 border-[#1899d6] active:translate-y-0.5 active:border-b-0 cursor-pointer disabled:opacity-50`}
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />} Accept request
        </button>
      );
    }
    return (
      <button
        disabled={busy}
        onClick={async () => {
          sound.playClick();
          toast(await sendRequest(p.uid));
        }}
        className={`${base} bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 border-b-2 border-[#1899d6] active:translate-y-0.5 active:border-b-0 cursor-pointer disabled:opacity-50`}
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />} Add friend
      </button>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12 animate-fade-in select-none">
      {feedback && (
        <div
          role="status"
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] max-w-[calc(100vw-1.5rem)] px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl animate-fade-in flex items-center gap-2 ${
            feedback.ok ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
          }`}
        >
          {feedback.ok ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
          {feedback.text}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1cb0f6] to-[#7c3aed] flex items-center justify-center shadow-lg">
            <Compass className="w-5 h-5 text-white" />
          </div>
          Local
        </h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Meet other learners who have joined Aivio. Only names, usernames and avatars are shown here.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username..."
          aria-label="Search learners by username"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0f1d38] border-2 border-[#1c325c] text-white text-sm font-bold placeholder:text-slate-500 focus:outline-none focus:border-[#1cb0f6] transition-colors"
        />
      </div>

      {state === 'loading' && (
        <div className="text-center py-16 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c]" role="status">
          <Loader2 className="w-10 h-10 text-[#1cb0f6] mx-auto mb-3 animate-spin" />
          <p className="text-slate-300 font-bold">Finding learners…</p>
        </div>
      )}

      {state === 'error' && (
        <div className="text-center py-16 rounded-3xl bg-[#0f1d38] border-2 border-amber-500/40" role="alert">
          <p className="text-slate-200 font-bold mb-1">We couldn't load learners.</p>
          <p className="text-xs text-slate-400 mb-4">Check your connection and try again.</p>
          <button
            onClick={() => {
              sound.playClick();
              setAttempt((n) => n + 1);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#1cb0f6] text-slate-950 font-black text-xs uppercase tracking-wider border-b-4 border-[#1899d6] inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      )}

      {state === 'ready' && visible.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c]">
          <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-bold">
            {prefix ? `No learners found for "${prefix}"` : 'No other learners have joined yet'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {prefix ? 'Check the spelling or try fewer letters.' : 'Check back soon, or invite a classmate to sign up.'}
          </p>
        </div>
      )}

      {state === 'ready' && visible.length > 0 && (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((p) => (
              <li
                key={p.uid}
                className="rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] p-5 flex flex-col items-center text-center shadow-lg"
              >
                <div className="mb-3">
                  <PersonAvatar profile={p} size="lg" />
                </div>
                <h3 className="text-sm font-black text-white max-w-full truncate">{personName(p)}</h3>
                <p className="text-[11px] text-slate-400 font-medium mb-4 max-w-full truncate">@{p.username}</p>
                {actionFor(p)}
              </li>
            ))}
          </ul>

          {cursor && (
            <div className="text-center mt-6">
              {moreFailed && (
                <p role="alert" className="text-xs font-bold text-rose-300 mb-2">
                  Couldn't load more. Try again.
                </p>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  void loadMore();
                }}
                disabled={loadingMore}
                className="px-6 py-3 rounded-2xl bg-[#142344] hover:bg-[#1b3464] text-[#1cb0f6] border-2 border-[#1c325c] font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 disabled:opacity-60"
              >
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />} Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
