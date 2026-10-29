import type { LessonAttempt, UserProgress } from '../types/lesson';
import { createDefaultProgress } from './progressStore.ts';

/**
 * A progress patch records what one session CHANGED, not the state it ended
 * in. Applying a patch to the latest stored progress therefore merges
 * independent updates from several tabs instead of overwriting them.
 *
 * Merge policy (deterministic, applied identically on screen and in the
 * Firestore transaction):
 *  - totalXP            additive: stored + xpDelta (never below 0)
 *  - completed lessons  set union
 *  - earned badges      set union
 *  - lessonAttempts     per lesson, the attempt with the later completedAt wins
 *  - streak             the later lastActiveDate wins; on the same date the higher streak wins
 *  - userName, path     last writer wins
 *  - reset              replaces stored progress with defaults, then the rest of the patch applies
 */
export interface ProgressPatch {
  /** YYYY-MM-DD of the reset, or null when this patch does not reset. */
  reset: string | null;
  xpDelta: number;
  lessons: string[];
  badges: string[];
  attempts: Record<string, LessonAttempt>;
  streak: { currentStreak: number; lastActiveDate: string } | null;
  userName: string | null;
  activePathId: string | null;
}

export const MAX_TOTAL_XP = 1_000_000;

export function emptyPatch(): ProgressPatch {
  return {
    reset: null,
    xpDelta: 0,
    lessons: [],
    badges: [],
    attempts: {},
    streak: null,
    userName: null,
    activePathId: null,
  };
}

export function isEmptyPatch(p: ProgressPatch): boolean {
  return (
    p.reset === null &&
    p.xpDelta === 0 &&
    p.lessons.length === 0 &&
    p.badges.length === 0 &&
    Object.keys(p.attempts).length === 0 &&
    p.streak === null &&
    p.userName === null &&
    p.activePathId === null
  );
}

const union = (a: string[], b: string[]): string[] => [...a, ...b.filter((x) => !a.includes(x))];

const laterAttempt = (a: LessonAttempt | undefined, b: LessonAttempt): LessonAttempt =>
  !a || b.completedAt >= a.completedAt ? b : a;

type Streak = ProgressPatch['streak'];

function pickStreak(a: Streak, b: Streak): Streak {
  if (!a) return b;
  if (!b) return a;
  if (b.lastActiveDate > a.lastActiveDate) return b;
  if (b.lastActiveDate < a.lastActiveDate) return a;
  return b.currentStreak >= a.currentStreak ? b : a;
}

/** The changes needed to turn `before` into `after`. */
export function diffProgress(before: UserProgress, after: UserProgress): ProgressPatch {
  const attempts: Record<string, LessonAttempt> = {};
  for (const [id, attempt] of Object.entries(after.lessonAttempts)) {
    const prev = before.lessonAttempts[id];
    if (!prev || JSON.stringify(prev) !== JSON.stringify(attempt)) attempts[id] = attempt;
  }
  const streakChanged =
    before.currentStreak !== after.currentStreak || before.lastActiveDate !== after.lastActiveDate;

  return {
    reset: null,
    xpDelta: after.totalXP - before.totalXP,
    lessons: after.completedLessonIds.filter((id) => !before.completedLessonIds.includes(id)),
    badges: after.earnedBadgeIds.filter((id) => !before.earnedBadgeIds.includes(id)),
    attempts,
    streak: streakChanged
      ? { currentStreak: after.currentStreak, lastActiveDate: after.lastActiveDate }
      : null,
    userName: before.userName !== after.userName ? after.userName : null,
    activePathId: before.activePathId !== after.activePathId ? after.activePathId : null,
  };
}

/** Patch `b` made after patch `a`, as one patch. */
export function composePatches(a: ProgressPatch, b: ProgressPatch): ProgressPatch {
  const first = b.reset !== null ? emptyPatch() : a;
  const attempts: Record<string, LessonAttempt> = { ...first.attempts };
  for (const [id, attempt] of Object.entries(b.attempts)) {
    attempts[id] = laterAttempt(attempts[id], attempt);
  }
  return {
    reset: b.reset ?? a.reset,
    xpDelta: first.xpDelta + b.xpDelta,
    lessons: union(first.lessons, b.lessons),
    badges: union(first.badges, b.badges),
    attempts,
    streak: pickStreak(first.streak, b.streak),
    userName: b.userName ?? first.userName,
    activePathId: b.activePathId ?? first.activePathId,
  };
}

/** Applies a patch to stored progress. Pure: used on screen and in the transaction. */
export function applyPatch(base: UserProgress, patch: ProgressPatch): UserProgress {
  if (isEmptyPatch(patch)) return base;

  const start: UserProgress =
    patch.reset !== null ? { ...createDefaultProgress(), lastActiveDate: patch.reset } : base;

  const attempts: Record<string, LessonAttempt> = { ...start.lessonAttempts };
  for (const [id, attempt] of Object.entries(patch.attempts)) {
    attempts[id] = laterAttempt(attempts[id], attempt);
  }

  const streak = pickStreak(
    { currentStreak: start.currentStreak, lastActiveDate: start.lastActiveDate },
    patch.streak,
  ) as NonNullable<Streak>;

  return {
    userName: patch.userName ?? start.userName,
    totalXP: Math.min(MAX_TOTAL_XP, Math.max(0, start.totalXP + patch.xpDelta)),
    currentStreak: streak.currentStreak,
    lastActiveDate: streak.lastActiveDate,
    completedLessonIds: union(start.completedLessonIds, patch.lessons),
    earnedBadgeIds: union(start.earnedBadgeIds, patch.badges),
    lessonAttempts: attempts,
    activePathId: patch.activePathId ?? start.activePathId,
  };
}

/** Validates a patch read from storage; returns null if it is not usable. */
export function coercePatch(raw: unknown): ProgressPatch | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const strings = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 200) : [];
  const attempts: Record<string, LessonAttempt> = {};
  if (typeof r.attempts === 'object' && r.attempts !== null) {
    for (const [id, a] of Object.entries(r.attempts as Record<string, unknown>).slice(0, 200)) {
      const x = a as Partial<LessonAttempt> | null;
      if (x && typeof x.completedAt === 'string' && Number.isFinite(x.mistakesCount) && Number.isFinite(x.xpEarned)) {
        attempts[id] = { completedAt: x.completedAt, mistakesCount: x.mistakesCount as number, xpEarned: x.xpEarned as number };
      }
    }
  }
  const st = r.streak as { currentStreak?: unknown; lastActiveDate?: unknown } | null;
  return {
    reset: typeof r.reset === 'string' ? r.reset : null,
    xpDelta: typeof r.xpDelta === 'number' && Number.isFinite(r.xpDelta) ? r.xpDelta : 0,
    lessons: strings(r.lessons),
    badges: strings(r.badges),
    attempts,
    streak:
      st && typeof st.currentStreak === 'number' && typeof st.lastActiveDate === 'string'
        ? { currentStreak: st.currentStreak, lastActiveDate: st.lastActiveDate }
        : null,
    userName: typeof r.userName === 'string' ? r.userName : null,
    activePathId: typeof r.activePathId === 'string' ? r.activePathId : null,
  };
}
