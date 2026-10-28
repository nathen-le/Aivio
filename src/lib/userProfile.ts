import {
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { normalizeUsername, validateUsername } from './username';

/**
 * Profile document stored at users/{uid}.
 *
 * Passwords are never written here — Firebase Authentication owns credentials.
 * `email` mirrors the auth token and is not user-editable; the rules reject a
 * document whose email does not match request.auth.token.email.
 *
 * The field list is mirrored by hasOnly() in firestore.rules. Adding a field
 * here without adding it there will cause writes to be rejected.
 */
export interface UserProfileDoc {
  uid: string;
  email: string;
  displayName: string;
  /** Normalized, globally unique, or '' when the learner has not claimed one. */
  username: string;
  bio: string;
  location: string;
  grade: string;
  school: string;
  birthday: string;
  website: string;
  avatarUrl: string;
  dailyGoalXP: number;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  schemaVersion: number;
}

/** The subset a learner may edit. Note the absence of uid and email. */
export type EditableProfileFields = Pick<
  UserProfileDoc,
  | 'displayName'
  | 'username'
  | 'bio'
  | 'location'
  | 'grade'
  | 'school'
  | 'birthday'
  | 'website'
  | 'avatarUrl'
  | 'dailyGoalXP'
>;

export const USER_PROFILE_SCHEMA_VERSION = 2;

export const DEFAULT_AVATAR_URL = '/mascot-cat-avatar.png';

/** A brand-new learner starts empty — no sample or placeholder identity. */
export function buildDefaultProfile(uid: string, email: string, displayName: string): UserProfileDoc {
  return {
    uid,
    email,
    displayName,
    username: '',
    bio: '',
    location: '',
    grade: '',
    school: '',
    birthday: '',
    website: '',
    avatarUrl: DEFAULT_AVATAR_URL,
    dailyGoalXP: 50,
    schemaVersion: USER_PROFILE_SCHEMA_VERSION,
  };
}

/** Error carrying a code the UI can branch on. */
export class ProfileError extends Error {
  code: 'username-taken' | 'username-invalid' | 'permission-denied' | 'unknown';

  constructor(code: ProfileError['code'], message: string) {
    super(message);
    this.name = 'ProfileError';
    this.code = code;
  }
}

function userRef(uid: string) {
  return doc(db, 'users', uid);
}

function usernameRef(username: string) {
  return doc(db, 'usernames', username);
}

/**
 * Creates users/{uid} on first registration. Reads first and skips when the
 * document already exists, so a retried signup never overwrites real data.
 */
export async function createUserProfileIfMissing(
  uid: string,
  email: string,
  displayName: string,
): Promise<void> {
  const ref = userRef(uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return;

  await setDoc(ref, {
    ...buildDefaultProfile(uid, email, displayName),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Loads users/{uid}. Returns null when no document exists yet — the caller
 * decides whether to heal it, rather than this function inventing data.
 */
export async function fetchUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const snapshot = await getDoc(userRef(uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfileDoc;
}

/**
 * Fills in fields a v1 document predates, without touching anything already
 * stored. The rules validate the whole merged document on every write, so a
 * document missing these keys would otherwise reject later partial saves.
 */
export async function backfillMissingFields(
  profile: UserProfileDoc,
  email: string,
): Promise<UserProfileDoc> {
  const defaults = buildDefaultProfile(profile.uid, email, profile.displayName ?? '');
  const missing: Record<string, unknown> = {};

  for (const [key, fallback] of Object.entries(defaults)) {
    if (!(key in profile) || profile[key as keyof UserProfileDoc] === undefined) {
      missing[key] = fallback;
    }
  }

  if (Object.keys(missing).length === 0) return profile;

  await updateDoc(userRef(profile.uid), { ...missing, updatedAt: serverTimestamp() });
  return { ...profile, ...missing } as UserProfileDoc;
}

/**
 * Reserves usernames/{name} for this uid, releasing the previous reservation.
 *
 * Uniqueness is guaranteed by the server, not here: the document ID is the
 * username, and the rules permit create but never update, so a second claimant
 * is rejected even if this check passes and a race follows.
 */
async function reserveUsername(uid: string, next: string, previous: string): Promise<void> {
  await runTransaction(db, async (tx) => {
    const nextSnapshot = await tx.get(usernameRef(next));

    if (nextSnapshot.exists()) {
      const owner = (nextSnapshot.data() as { uid?: string }).uid;
      if (owner !== uid) {
        throw new ProfileError('username-taken', 'That username is already taken.');
      }
      return; // Already ours: nothing to write.
    }

    tx.set(usernameRef(next), { uid, createdAt: serverTimestamp() });
  });

  // Released after the new name is safely held, so a failure here leaves a
  // harmless orphan the same learner can reclaim rather than losing the name.
  if (previous && previous !== next) {
    try {
      await deleteDoc(usernameRef(previous));
    } catch (error) {
      console.warn('Could not release previous username reservation:', error);
    }
  }
}

/**
 * Saves edited fields to users/{uid}, claiming the username first when it
 * changed. Only the fields passed in are written, so unrelated fields and
 * createdAt are left untouched.
 */
export async function saveUserProfile(
  uid: string,
  updates: Partial<EditableProfileFields>,
  currentUsername: string,
): Promise<Partial<EditableProfileFields>> {
  const applied: Partial<EditableProfileFields> = { ...updates };

  if (typeof updates.username === 'string') {
    const normalized = normalizeUsername(updates.username);

    if (normalized !== currentUsername) {
      const invalid = validateUsername(normalized);
      if (invalid) {
        throw new ProfileError('username-invalid', invalid);
      }
      await reserveUsername(uid, normalized, currentUsername);
    }

    applied.username = normalized;
  }

  try {
    await updateDoc(userRef(uid), {
      ...applied,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { code?: string }).code === 'permission-denied'
    ) {
      throw new ProfileError(
        'permission-denied',
        'Those changes were rejected by the server. Reload and try again.',
      );
    }
    throw error;
  }

  return applied;
}
