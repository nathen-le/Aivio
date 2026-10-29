import { coercePatch } from './progressMerge.ts';
import type { ProgressPatch } from './progressMerge.ts';

/**
 * Unconfirmed progress patches, kept per account in localStorage so they
 * survive a refresh, a closed tab or a failed sign-out and are re-sent on the
 * next load. Re-sending is safe: every entry carries the write ID that the
 * Firestore transaction uses to skip patches it has already applied.
 *
 * Holds learning progress only, never credentials. Entries are removed once
 * Firestore confirms them. A browser cannot guarantee a write completes after
 * a tab is force-closed; this makes the data recoverable, not the write certain.
 */
export interface OutboxEntry {
  id: string;
  patch: ProgressPatch;
}

const keyFor = (uid: string) => `aivio_progress_outbox_v1:${uid}`;

export function readOutbox(uid: string): OutboxEntry[] {
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const entries: OutboxEntry[] = [];
    for (const e of parsed as Array<{ id?: unknown; patch?: unknown }>) {
      const patch = coercePatch(e?.patch);
      if (typeof e?.id === 'string' && patch) entries.push({ id: e.id, patch });
    }
    return entries;
  } catch {
    return [];
  }
}

function write(uid: string, entries: OutboxEntry[]) {
  try {
    if (entries.length === 0) localStorage.removeItem(keyFor(uid));
    else localStorage.setItem(keyFor(uid), JSON.stringify(entries));
  } catch {
    /* storage full or blocked: the in-memory queue still retries */
  }
}

export function addToOutbox(uid: string, entry: OutboxEntry) {
  const entries = readOutbox(uid).filter((e) => e.id !== entry.id);
  write(uid, [...entries, entry]);
}

export function removeFromOutbox(uid: string, id: string) {
  write(uid, readOutbox(uid).filter((e) => e.id !== id));
}
