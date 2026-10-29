import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { DocumentSnapshot, Firestore } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_AVATAR_URL, createUserProfileIfMissing, fetchUserProfile } from './userProfile';
import type { UserProfileDoc } from './userProfile';

/**
 * publicProfiles/{uid}: the only part of a learner other learners can read.
 * Fields are allowlisted by the Firestore rules (hasOnly); email, bio,
 * location, school, birthday, website and progress are never copied here.
 */
export interface PublicProfile {
  uid: string;
  displayName: string;
  /** Normalized username, or '' when none has been claimed. */
  username: string;
  avatarUrl: string;
}

export const PUBLIC_PROFILE_SCHEMA_VERSION = 1;

/** Mirrors the avatar pattern enforced in firestore.rules. */
const AVATAR_PATTERN = /^\/mascot-[a-z0-9-]{1,40}\.(png|jpg)$/;

const publicRef = (uid: string, database: Firestore = db) => doc(database, 'publicProfiles', uid);

function safeAvatar(url: string | undefined): string {
  return url && AVATAR_PATTERN.test(url) ? url : DEFAULT_AVATAR_URL;
}

export function toPublicFields(profile: Pick<UserProfileDoc, 'displayName' | 'username' | 'avatarUrl'>) {
  return {
    displayName: (profile.displayName || '').trim().slice(0, 60) || 'Learner',
    username: profile.username || '',
    avatarUrl: safeAvatar(profile.avatarUrl),
  };
}

function fromSnapshot(snap: DocumentSnapshot): PublicProfile | null {
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: snap.id,
    displayName: typeof d.displayName === 'string' ? d.displayName : 'Learner',
    username: typeof d.username === 'string' ? d.username : '',
    avatarUrl: safeAvatar(typeof d.avatarUrl === 'string' ? d.avatarUrl : undefined),
  };
}

async function writePublicProfile(uid: string, fields: ReturnType<typeof toPublicFields>) {
  await setDoc(publicRef(uid), {
    uid,
    ...fields,
    schemaVersion: PUBLIC_PROFILE_SCHEMA_VERSION,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Makes sure the signed-in learner's public profile exists and matches their
 * private profile. Writes only when something differs, so a normal session
 * costs two reads and no writes.
 */
export async function ensureOwnPublicProfile(uid: string, email: string, authName: string): Promise<void> {
  let profile = await fetchUserProfile(uid);
  if (!profile) {
    await createUserProfileIfMissing(uid, email, authName);
    profile = await fetchUserProfile(uid);
  }
  if (!profile) return;

  const desired = toPublicFields(profile);
  const existing = fromSnapshot(await getDoc(publicRef(uid)));
  if (
    existing &&
    existing.displayName === desired.displayName &&
    existing.username === desired.username &&
    existing.avatarUrl === desired.avatarUrl
  ) {
    return;
  }

  try {
    await writePublicProfile(uid, desired);
  } catch (error) {
    // A username without a matching reservation is refused by the rules.
    // Publish without it rather than staying undiscoverable.
    if (desired.username && (error as { code?: string }).code === 'permission-denied') {
      await writePublicProfile(uid, { ...desired, username: '' });
      return;
    }
    throw error;
  }
}

/**
 * Pushes edited public fields after a private-profile save. Never lets a
 * failure here fail the profile save itself; the next sign-in re-syncs.
 */
export async function syncPublicProfileFields(
  uid: string,
  changed: Partial<Pick<UserProfileDoc, 'displayName' | 'username' | 'avatarUrl'>>,
): Promise<void> {
  const patch: Record<string, string> = {};
  if (changed.displayName !== undefined) patch.displayName = toPublicFields({ displayName: changed.displayName, username: '', avatarUrl: '' }).displayName;
  if (changed.username !== undefined) patch.username = changed.username;
  if (changed.avatarUrl !== undefined) patch.avatarUrl = safeAvatar(changed.avatarUrl);
  if (Object.keys(patch).length === 0) return;

  try {
    await updateDoc(publicRef(uid), { ...patch, updatedAt: serverTimestamp() });
  } catch (error) {
    console.warn('Public profile sync deferred:', (error as { code?: string }).code ?? error);
  }
}

export async function fetchPublicProfile(uid: string): Promise<PublicProfile | null> {
  return fromSnapshot(await getDoc(publicRef(uid)));
}

export async function findPublicProfileByUsername(username: string): Promise<PublicProfile | null> {
  const snap = await getDocs(
    query(collection(db, 'publicProfiles'), where('username', '==', username), limit(1)),
  );
  return snap.empty ? null : fromSnapshot(snap.docs[0]);
}

export interface ProfilePage {
  profiles: PublicProfile[];
  /** Opaque cursor for the next page, or null when there are no more results. */
  cursor: DocumentSnapshot | null;
}

export const LOCAL_PAGE_SIZE = 20;

/**
 * One page of the directory, ordered by username. Only learners who have
 * claimed a username are listed (an unnamed account has nothing to show and
 * cannot be searched for). `prefix` narrows to usernames starting with it.
 */
export async function listPublicProfiles(
  options: { prefix?: string; after?: DocumentSnapshot | null } = {},
): Promise<ProfilePage> {
  const prefix = options.prefix ?? '';
  const constraints = [
    prefix
      ? where('username', '>=', prefix)
      : where('username', '>', ''),
    ...(prefix ? [where('username', '<=', prefix + '')] : []),
    orderBy('username'),
    ...(options.after ? [startAfter(options.after)] : []),
    limit(LOCAL_PAGE_SIZE),
  ];
  const snap = await getDocs(query(collection(db, 'publicProfiles'), ...constraints));
  const profiles = snap.docs.map(fromSnapshot).filter((p): p is PublicProfile => p !== null);
  return {
    profiles,
    cursor: snap.size === LOCAL_PAGE_SIZE ? snap.docs[snap.docs.length - 1] : null,
  };
}
