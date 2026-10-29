import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyPatch,
  composePatches,
  diffProgress,
  emptyPatch,
  isEmptyPatch,
} from '../../src/lib/progressMerge.ts';
import { createDefaultProgress, sanitizeProgress } from '../../src/lib/progressStore.ts';
import type { UserProgress } from '../../src/types/lesson.ts';

const base = (over: Partial<UserProgress> = {}): UserProgress => ({
  ...createDefaultProgress(),
  lastActiveDate: '2026-10-01',
  ...over,
});

const attempt = (completedAt: string, xpEarned = 50) => ({ completedAt, mistakesCount: 0, xpEarned });

test('two tabs completing different lessons merge instead of overwriting', () => {
  const stored = base({ totalXP: 100, completedLessonIds: ['l1'] });
  const tabA = { ...emptyPatch(), xpDelta: 50, lessons: ['l2'], attempts: { l2: attempt('2026-10-02T10:00:00Z') } };
  const tabB = { ...emptyPatch(), xpDelta: 60, lessons: ['l3'], attempts: { l3: attempt('2026-10-02T10:00:01Z', 60) } };
  const merged = applyPatch(applyPatch(stored, tabA), tabB);
  assert.equal(merged.totalXP, 210);
  assert.deepEqual(merged.completedLessonIds, ['l1', 'l2', 'l3']);
  assert.deepEqual(Object.keys(merged.lessonAttempts).sort(), ['l2', 'l3']);
});

test('the same lesson completed in two tabs is not duplicated', () => {
  const p = { ...emptyPatch(), lessons: ['l2'], badges: ['first-spark'] };
  const merged = applyPatch(applyPatch(base(), p), p);
  assert.deepEqual(merged.completedLessonIds, ['l2']);
  assert.deepEqual(merged.earnedBadgeIds, ['first-spark']);
});

test('the attempt with the later completedAt wins, regardless of order', () => {
  const early = { ...emptyPatch(), attempts: { l1: attempt('2026-10-02T09:00:00Z', 50) } };
  const late = { ...emptyPatch(), attempts: { l1: attempt('2026-10-02T11:00:00Z', 10) } };
  assert.equal(applyPatch(applyPatch(base(), early), late).lessonAttempts.l1.xpEarned, 10);
  assert.equal(applyPatch(applyPatch(base(), late), early).lessonAttempts.l1.xpEarned, 10);
});

test('streak: later date wins, same date keeps the higher streak', () => {
  const stored = base({ currentStreak: 5, lastActiveDate: '2026-10-03' });
  const older = { ...emptyPatch(), streak: { currentStreak: 9, lastActiveDate: '2026-10-02' } };
  const same = { ...emptyPatch(), streak: { currentStreak: 3, lastActiveDate: '2026-10-03' } };
  const newer = { ...emptyPatch(), streak: { currentStreak: 1, lastActiveDate: '2026-10-04' } };
  assert.equal(applyPatch(stored, older).currentStreak, 5);
  assert.equal(applyPatch(stored, same).currentStreak, 5);
  assert.deepEqual(
    [applyPatch(stored, newer).currentStreak, applyPatch(stored, newer).lastActiveDate],
    [1, '2026-10-04'],
  );
});

test('reset replaces stored progress, then later changes still apply', () => {
  const stored = base({ totalXP: 400, completedLessonIds: ['l1', 'l2'], earnedBadgeIds: ['b'] });
  const reset = { ...emptyPatch(), reset: '2026-10-05' };
  const after = composePatches(reset, { ...emptyPatch(), xpDelta: 50, lessons: ['l1'] });
  const result = applyPatch(stored, after);
  assert.equal(result.totalXP, 50);
  assert.deepEqual(result.completedLessonIds, ['l1']);
  assert.deepEqual(result.earnedBadgeIds, []);
  assert.equal(result.lastActiveDate, '2026-10-05');
});

test('a stale tab patch after a reset does not resurrect old lessons', () => {
  const stored = base({ totalXP: 400, completedLessonIds: ['l1', 'l2'] });
  const afterReset = applyPatch(stored, { ...emptyPatch(), reset: '2026-10-05' });
  const stale = { ...emptyPatch(), xpDelta: 50, lessons: ['l3'] };
  const result = applyPatch(afterReset, stale);
  assert.deepEqual(result.completedLessonIds, ['l3']);
  assert.equal(result.totalXP, 50);
});

test('diffProgress then applyPatch reproduces the new state', () => {
  const before = base({ totalXP: 100, completedLessonIds: ['l1'], lessonAttempts: { l1: attempt('2026-10-01T00:00:00Z') } });
  const after: UserProgress = {
    ...before,
    totalXP: 175,
    currentStreak: 2,
    lastActiveDate: '2026-10-02',
    completedLessonIds: ['l1', 'l2'],
    earnedBadgeIds: ['first-spark'],
    lessonAttempts: { ...before.lessonAttempts, l2: attempt('2026-10-02T00:00:00Z', 75) },
    userName: 'Nate',
  };
  assert.deepEqual(applyPatch(before, diffProgress(before, after)), after);
  assert.ok(isEmptyPatch(diffProgress(after, after)));
});

test('composePatches is equivalent to applying patches one after another', () => {
  let seed = 7;
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const randomPatch = () => ({
    ...emptyPatch(),
    xpDelta: Math.floor(rand() * 100),
    lessons: rand() > 0.5 ? [`l${Math.floor(rand() * 5)}`] : [],
    badges: rand() > 0.7 ? [`b${Math.floor(rand() * 3)}`] : [],
    attempts: rand() > 0.5 ? { [`l${Math.floor(rand() * 5)}`]: attempt(`2026-10-0${1 + Math.floor(rand() * 8)}T00:00:00Z`) } : {},
    streak: rand() > 0.5 ? { currentStreak: Math.floor(rand() * 9), lastActiveDate: `2026-10-0${1 + Math.floor(rand() * 8)}` } : null,
    userName: rand() > 0.8 ? 'X' : null,
  });
  for (let i = 0; i < 300; i++) {
    const a = randomPatch(), b = randomPatch(), c = randomPatch();
    const start = base({ totalXP: 10 });
    const sequential = applyPatch(applyPatch(applyPatch(start, a), b), c);
    const composed = applyPatch(start, composePatches(composePatches(a, b), c));
    assert.deepEqual(composed, sequential);
  }
});

test('sanitizeProgress repairs malformed data field by field', () => {
  const p = sanitizeProgress({ totalXP: 'lots', completedLessonIds: ['a', 'a', 7, 'b'], userName: '  ', lastActiveDate: 'x' });
  assert.equal(p.totalXP, 0);
  assert.deepEqual(p.completedLessonIds, ['a', 'b']);
  assert.equal(p.userName, 'Learner');
  assert.match(p.lastActiveDate, /^\d{4}-\d{2}-\d{2}$/);
});
