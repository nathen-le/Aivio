import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { UserProgress } from '../types/lesson';
import { applyPatch } from './progressMerge.ts';
import type { ProgressPatch } from './progressMerge.ts';
import {
  PROGRESS_SCHEMA_VERSION,
  RECENT_WRITE_IDS_LIMIT,
  createDefaultProgress,
  sanitizeProgress,
} from './progressStore.ts';

/** Stored progress plus the sync metadata kept beside it. */
export interface StoredProgress {
  progress: UserProgress;
  /** Increments by exactly 1 on every write; the rules enforce this. */
  revision: number;
  /** IDs of the most recent patches applied, oldest first. */
  recentWriteIds: string[];
}

function progressRef(db: Firestore, uid: string) {
  return doc(db, 'users', uid, 'progress', 'state');
}

export function readStored(data: Record<string, unknown> | undefined): StoredProgress {
  const revision =
    typeof data?.revision === 'number' && Number.isInteger(data.revision) && data.revision >= 0
      ? data.revision
      : 0;
  const ids = Array.isArray(data?.recentWriteIds)
    ? (data.recentWriteIds as unknown[]).filter((x): x is string => typeof x === 'string')
    : [];
  return { progress: sanitizeProgress(data), revision, recentWriteIds: ids };
}

export async function fetchStored(db: Firestore, uid: string): Promise<StoredProgress | null> {
  const snap = await getDoc(progressRef(db, uid));
  return snap.exists() ? readStored(snap.data()) : null;
}

const CONTENTION_RETRIES = 5;

/**
 * Two writers racing on the same document: the loser's revision check fails
 * in the rules, which Firestore reports as permission-denied rather than as a
 * retryable conflict. Re-running the transaction re-reads the newer revision
 * and succeeds. A genuine rules denial keeps failing and is rethrown after the
 * last attempt.
 */
async function withContentionRetry<T>(run: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      const retryable = code === 'permission-denied' || code === 'aborted';
      if (!retryable || attempt >= CONTENTION_RETRIES) throw error;
      await new Promise((resolve) => setTimeout(resolve, 40 * 2 ** attempt + Math.random() * 60));
    }
  }
}

function documentFor(next: UserProgress, revision: number, ids: string[]) {
  return {
    ...next,
    revision,
    recentWriteIds: ids.slice(-RECENT_WRITE_IDS_LIMIT),
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    updatedAt: serverTimestamp(),
  };
}

/**
 * Creates the document only if it does not exist. Check and write are one
 * transaction, so a duplicate or concurrent call can never overwrite saved
 * progress: the loser reads what the winner wrote.
 */
export async function createStoredIfMissing(
  db: Firestore,
  uid: string,
  initial: UserProgress,
): Promise<StoredProgress> {
  const ref = progressRef(db, uid);
  return withContentionRetry(() =>
    runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists()) return readStored(snap.data());
      tx.set(ref, documentFor(initial, 1, []));
      return { progress: initial, revision: 1, recentWriteIds: [] };
    }),
  );
}

/**
 * Applies one patch to whatever is stored right now, in a transaction.
 *
 * Idempotent: if `writeId` is already recorded, the patch was applied by an
 * earlier attempt whose acknowledgement was lost, so nothing is written and
 * the current stored state is returned. That is what prevents a retry from
 * awarding XP twice.
 */
export async function commitPatch(
  db: Firestore,
  uid: string,
  writeId: string,
  patch: ProgressPatch,
): Promise<StoredProgress> {
  const ref = progressRef(db, uid);
  return withContentionRetry(() =>
    runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current: StoredProgress = snap.exists()
      ? readStored(snap.data())
      : { progress: createDefaultProgress(), revision: 0, recentWriteIds: [] };

    if (current.recentWriteIds.includes(writeId)) return current;

    const next = applyPatch(current.progress, patch);
    const revision = current.revision + 1;
    const ids = [...current.recentWriteIds, writeId].slice(-RECENT_WRITE_IDS_LIMIT);
    tx.set(ref, documentFor(next, revision, ids));
    return { progress: next, revision, recentWriteIds: ids };
    }),
  );
}
