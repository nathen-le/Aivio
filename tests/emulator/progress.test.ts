import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { commitPatch, createStoredIfMissing, fetchStored } from '../../src/lib/progressSync.ts';
import { emptyPatch } from '../../src/lib/progressMerge.ts';
import { createDefaultProgress } from '../../src/lib/progressStore.ts';
import { client, closeAll, uniqueEmail } from './helpers.ts';

after(closeAll);

const attempt = (t: string, xp = 50) => ({ completedAt: t, mistakesCount: 0, xpEarned: xp });

test('two tabs writing at the same time both land (no overwrite)', async () => {
  const email = uniqueEmail('overlap');
  const tabA = await client(email, true);
  const tabB = await client(email);
  await createStoredIfMissing(tabA.db, tabA.uid, createDefaultProgress('Nate'));

  const patchA = { ...emptyPatch(), xpDelta: 50, lessons: ['lesson-a'], attempts: { 'lesson-a': attempt('2026-10-02T10:00:00Z') } };
  const patchB = { ...emptyPatch(), xpDelta: 70, lessons: ['lesson-b'], attempts: { 'lesson-b': attempt('2026-10-02T10:00:01Z', 70) } };
  await Promise.all([
    commitPatch(tabA.db, tabA.uid, 'write-a', patchA),
    commitPatch(tabB.db, tabB.uid, 'write-b', patchB),
  ]);

  const stored = await fetchStored(tabA.db, tabA.uid);
  assert.ok(stored);
  assert.equal(stored.progress.totalXP, 120);
  assert.deepEqual([...stored.progress.completedLessonIds].sort(), ['lesson-a', 'lesson-b']);
  assert.equal(stored.revision, 3); // 1 create + 2 writes
  assert.deepEqual([...stored.recentWriteIds].sort(), ['write-a', 'write-b']);
});

test('retrying the same write id never awards XP twice', async () => {
  const email = uniqueEmail('retry');
  const tab = await client(email, true);
  await createStoredIfMissing(tab.db, tab.uid, createDefaultProgress());
  const patch = { ...emptyPatch(), xpDelta: 50, badges: ['first-spark'] };

  const first = await commitPatch(tab.db, tab.uid, 'same-id', patch);
  const again = await commitPatch(tab.db, tab.uid, 'same-id', patch);
  const third = await commitPatch(tab.db, tab.uid, 'same-id', patch);

  assert.equal(first.progress.totalXP, 50);
  assert.equal(again.progress.totalXP, 50);
  assert.equal(third.revision, first.revision, 'a deduplicated retry must not write');
});

test('a stale tab merges its change instead of replacing newer progress', async () => {
  const email = uniqueEmail('stale');
  const tabA = await client(email, true);
  const tabB = await client(email);
  await createStoredIfMissing(tabA.db, tabA.uid, createDefaultProgress());
  await commitPatch(tabA.db, tabA.uid, 'a1', { ...emptyPatch(), xpDelta: 100, lessons: ['l1', 'l2'] });
  // Tab B never saw that write; its patch still lands on top of it.
  const result = await commitPatch(tabB.db, tabB.uid, 'b1', { ...emptyPatch(), xpDelta: 25, lessons: ['l3'] });
  assert.equal(result.progress.totalXP, 125);
  assert.deepEqual(result.progress.completedLessonIds, ['l1', 'l2', 'l3']);
});

test('createStoredIfMissing never overwrites existing progress', async () => {
  const tab = await client(uniqueEmail('create'), true);
  await createStoredIfMissing(tab.db, tab.uid, createDefaultProgress());
  await commitPatch(tab.db, tab.uid, 'w1', { ...emptyPatch(), xpDelta: 80 });
  const again = await createStoredIfMissing(tab.db, tab.uid, createDefaultProgress());
  assert.equal(again.progress.totalXP, 80);
});

test('rules: a direct write that skips or repeats a revision is rejected', async () => {
  const tab = await client(uniqueEmail('rev'), true);
  await createStoredIfMissing(tab.db, tab.uid, createDefaultProgress());
  const ref = doc(tab.db, 'users', tab.uid, 'progress', 'state');
  const current = (await getDoc(ref)).data()!;
  const full = (revision: number) => ({
    userName: current.userName, totalXP: 9, currentStreak: 1, lastActiveDate: current.lastActiveDate,
    completedLessonIds: [], earnedBadgeIds: [], lessonAttempts: {}, activePathId: current.activePathId,
    schemaVersion: 1, revision, recentWriteIds: [], updatedAt: serverTimestamp(),
  });
  await assert.rejects(setDoc(ref, full(current.revision))); // same revision (stale copy)
  await assert.rejects(setDoc(ref, full(current.revision + 5))); // skipped ahead
  await setDoc(ref, full(current.revision + 1)); // exactly +1 is accepted
});

test('rules: one account cannot read or write another account\'s progress', async () => {
  const owner = await client(uniqueEmail('owner'), true);
  const other = await client(uniqueEmail('other'), true);
  await createStoredIfMissing(owner.db, owner.uid, createDefaultProgress());
  const ref = doc(other.db, 'users', owner.uid, 'progress', 'state');
  await assert.rejects(getDoc(ref));
  await assert.rejects(commitPatch(other.db, owner.uid, 'evil', { ...emptyPatch(), xpDelta: 999999 }));
  await assert.rejects(updateDoc(ref, { totalXP: 1 }));
  await assert.rejects(deleteDoc(doc(owner.db, 'users', owner.uid, 'progress', 'state')));
});

test('revision advances by exactly one per applied write', async () => {
  const tab = await client(uniqueEmail('revision'), true);
  await createStoredIfMissing(tab.db, tab.uid, createDefaultProgress());
  const r = await commitPatch(tab.db, tab.uid, 'x', { ...emptyPatch(), xpDelta: 5 });
  assert.equal(r.revision, 2);
  const r2 = await commitPatch(tab.db, tab.uid, 'y', { ...emptyPatch(), xpDelta: 5 });
  assert.equal(r2.revision, 3);
});
