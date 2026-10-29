import type { LessonAttempt, UserProgress } from '../types/lesson';

/**
 * Learning progress lives at users/{uid}/progress/state, one document per
 * learner. The field list is mirrored by hasOnly() in firestore.rules; adding
 * a field here without adding it there makes every write fail.
 */
export const PROGRESS_SCHEMA_VERSION = 1;

/** Number of recent write IDs kept in the document for retry de-duplication. */
export const RECENT_WRITE_IDS_LIMIT = 20;

/** Legacy device-wide key written by the pre-account version of the app. */
export const LEGACY_STORAGE_KEY = 'aivio_user_progress_v1';

/**
 * Records which account the legacy data was imported into. It stores only a
 * Firebase UID (not a secret) and lets a second account on the same browser be
 * told apart from the account that already claimed the data.
 */
export const LEGACY_CLAIM_KEY = 'aivio_legacy_progress_claimed_by_v1';

export function createDefaultProgress(userName = 'Learner'): UserProgress {
  return {
    userName: userName.trim() || 'Learner',
    totalXP: 0,
    currentStreak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessonIds: [],
    earnedBadgeIds: [],
    lessonAttempts: {},
    activePathId: 'ai-fundamentals',
  };
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const nonNegInt = (v: unknown, fallback: number, max = 1_000_000): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.floor(v))) : fallback;

function cleanStringList(v: unknown, maxItems: number): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    if (typeof item === 'string' && item.length > 0 && item.length <= 100 && !out.includes(item)) {
      out.push(item);
    }
    if (out.length >= maxItems) break;
  }
  return out;
}

/**
 * Coerces untrusted data (localStorage or a Firestore document) into a valid
 * UserProgress. Missing or malformed fields fall back to defaults field by
 * field, so partially populated data keeps whatever is usable.
 */
export function sanitizeProgress(raw: unknown, fallbackName = 'Learner'): UserProgress {
  const base = createDefaultProgress(fallbackName);
  if (!isRecord(raw)) return base;

  const attempts: Record<string, LessonAttempt> = {};
  if (isRecord(raw.lessonAttempts)) {
    for (const [lessonId, value] of Object.entries(raw.lessonAttempts).slice(0, 200)) {
      if (!isRecord(value) || lessonId.length > 100) continue;
      attempts[lessonId] = {
        completedAt: typeof value.completedAt === 'string' ? value.completedAt.slice(0, 40) : '',
        mistakesCount: nonNegInt(value.mistakesCount, 0, 10_000),
        xpEarned: nonNegInt(value.xpEarned, 0, 10_000),
      };
    }
  }

  return {
    userName:
      typeof raw.userName === 'string' && raw.userName.trim()
        ? raw.userName.trim().slice(0, 60)
        : base.userName,
    totalXP: nonNegInt(raw.totalXP, base.totalXP),
    currentStreak: nonNegInt(raw.currentStreak, base.currentStreak, 100_000),
    lastActiveDate:
      typeof raw.lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.lastActiveDate)
        ? raw.lastActiveDate
        : base.lastActiveDate,
    completedLessonIds: cleanStringList(raw.completedLessonIds, 200),
    earnedBadgeIds: cleanStringList(raw.earnedBadgeIds, 100),
    lessonAttempts: attempts,
    activePathId:
      typeof raw.activePathId === 'string' && raw.activePathId && raw.activePathId.length <= 100
        ? raw.activePathId
        : base.activePathId,
  };
}

/** True when the data holds real learning activity rather than default state. */
export function hasMeaningfulProgress(p: UserProgress): boolean {
  return (
    p.totalXP > 0 ||
    p.completedLessonIds.length > 0 ||
    p.earnedBadgeIds.length > 0 ||
    Object.keys(p.lessonAttempts).length > 0
  );
}

/** Reads and validates the legacy device progress. Never modifies it. */
export function readLegacyProgress(): UserProgress | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const progress = sanitizeProgress(JSON.parse(raw));
    return hasMeaningfulProgress(progress) ? progress : null;
  } catch {
    return null;
  }
}

export function getLegacyClaimant(): string | null {
  try {
    return localStorage.getItem(LEGACY_CLAIM_KEY);
  } catch {
    return null;
  }
}

export function markLegacyClaimed(uid: string): void {
  try {
    localStorage.setItem(LEGACY_CLAIM_KEY, uid);
  } catch {
    /* non-fatal: worst case the prompt can appear once more */
  }
}
