import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserProgress, LessonNodeStatus } from '../types/lesson';
import { BADGES } from '../data/badges';
import { ALL_LESSONS } from '../data/lessons';
import { db } from '../lib/firebase';
import {
  applyPatch,
  composePatches,
  diffProgress,
  emptyPatch,
  isEmptyPatch,
} from '../lib/progressMerge';
import type { ProgressPatch } from '../lib/progressMerge';
import { addToOutbox, readOutbox, removeFromOutbox } from '../lib/progressOutbox';
import type { OutboxEntry } from '../lib/progressOutbox';
import { registerPendingSaveFlusher } from '../lib/pendingSaves';
import {
  commitPatch,
  createStoredIfMissing,
  fetchStored,
  readStored,
} from '../lib/progressSync';
import type { StoredProgress } from '../lib/progressSync';
import {
  createDefaultProgress,
  getLegacyClaimant,
  markLegacyClaimed,
  readLegacyProgress,
} from '../lib/progressStore';

const SAVE_DEBOUNCE_MS = 300;
const MAX_RETRY_DELAY_MS = 30_000;

export type ProgressStatus =
  /** No account: nothing to load. */
  | 'signed-out'
  /** Waiting on Firestore. Progress must not be shown or saved yet. */
  | 'loading'
  /** Account has no saved progress but this device holds legacy progress; the user must choose. */
  | 'needs-import-decision'
  | 'ready'
  | 'error';

export type SaveStatus = 'idle' | 'saving' | 'error';

/**
 * Everything the sync engine knows. What the learner sees is derived:
 * base (last confirmed Firestore state) + frozen patches (sent, unconfirmed)
 * + pending (not yet sent).
 */
interface Core {
  uid: string | null;
  status: ProgressStatus;
  base: UserProgress;
  revision: number;
  frozen: OutboxEntry[];
  pending: ProgressPatch;
  legacy: UserProgress | null;
}

const blankCore = (uid: string | null, status: ProgressStatus, name = 'Learner'): Core => ({
  uid,
  status,
  base: createDefaultProgress(name),
  revision: 0,
  frozen: [],
  pending: emptyPatch(),
  legacy: null,
});

const displayOf = (core: Core): UserProgress =>
  applyPatch(core.frozen.reduce((acc, e) => applyPatch(acc, e.patch), core.base), core.pending);

const newWriteId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXP: number;
}

export function calculateLevel(totalXP: number): LevelInfo {
  const levels = [
    { level: 1, title: 'AI Novice', minXP: 0, maxXP: 100 },
    { level: 2, title: 'Prompt Explorer', minXP: 100, maxXP: 250 },
    { level: 3, title: 'Neural Navigator', minXP: 250, maxXP: 450 },
    { level: 4, title: 'Model Apprentice', minXP: 450, maxXP: 700 },
    { level: 5, title: 'Algorithm Architect', minXP: 700, maxXP: 1000 },
    { level: 6, title: 'AI Vanguard', minXP: 1000, maxXP: 1500 },
  ];

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    if (totalXP < l.maxXP || i === levels.length - 1) {
      const range = l.maxXP - l.minXP;
      const progressXP = Math.max(0, totalXP - l.minXP);
      const percent = Math.min(100, Math.round((progressXP / range) * 100));
      return {
        level: l.level,
        title: l.title,
        currentXP: progressXP,
        xpForNextLevel: l.maxXP,
        progressPercent: percent,
        totalXP,
      };
    }
  }

  return {
    level: 6,
    title: 'AI Vanguard',
    currentXP: totalXP,
    xpForNextLevel: 2000,
    progressPercent: 100,
    totalXP,
  };
}

export function useProgress(uid: string | null, fallbackName = 'Learner') {
  const coreRef = useRef<Core>(blankCore(null, 'loading', fallbackName));
  const [core, setCore] = useState<Core>(coreRef.current);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [loadAttempt, setLoadAttempt] = useState(0);

  const activeUidRef = useRef<string | null>(uid);
  const flushRef = useRef<Promise<boolean> | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);
  const nameRef = useRef(fallbackName);
  useEffect(() => {
    nameRef.current = fallbackName;
  }, [fallbackName]);

  /** Single path for state changes, so the engine and the screen never disagree. */
  const mutate = useCallback((fn: (c: Core) => Core) => {
    const next = fn(coreRef.current);
    coreRef.current = next;
    setCore(next);
  }, []);

  // A state object from another account (or from before sign-in) is never
  // exposed: it reads as loading until this uid's own load completes.
  const isCurrent = uid !== null && core.uid === uid;
  const status: ProgressStatus = uid === null ? 'signed-out' : isCurrent ? core.status : 'loading';
  const progress = useMemo(
    () => (isCurrent ? displayOf(core) : createDefaultProgress(fallbackName)),
    [isCurrent, core, fallbackName],
  );
  const legacyProgress = isCurrent ? core.legacy : null;

  const becomeReady = useCallback(
    (forUid: string, stored: StoredProgress) => {
      // Unconfirmed patches from an earlier session. Any the server already
      // recorded are dropped here, so they are never applied twice.
      const outbox = readOutbox(forUid);
      const frozen = outbox.filter((e) => !stored.recentWriteIds.includes(e.id));
      outbox.filter((e) => stored.recentWriteIds.includes(e.id)).forEach((e) => removeFromOutbox(forUid, e.id));
      mutate(() => ({
        ...blankCore(forUid, 'ready'),
        base: stored.progress,
        revision: stored.revision,
        frozen,
      }));
    },
    [mutate],
  );

  // ── Load (and create-if-missing) once auth has resolved a uid ──
  useEffect(() => {
    activeUidRef.current = uid;
    retryCountRef.current = 0;
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (!uid) return;

    let cancelled = false;
    (async () => {
      try {
        const stored = await fetchStored(db, uid);
        if (cancelled) return;

        // Existing Firestore progress always wins; legacy device data is left alone.
        if (stored) {
          becomeReady(uid, stored);
          return;
        }

        // No saved progress yet. Offer device progress only if no other
        // account has already claimed it, and only with explicit consent.
        const legacy = readLegacyProgress();
        const claimant = getLegacyClaimant();
        if (legacy && (claimant === null || claimant === uid)) {
          mutate(() => ({ ...blankCore(uid, 'needs-import-decision', nameRef.current), legacy }));
          return;
        }

        const created = await createStoredIfMissing(db, uid, createDefaultProgress(nameRef.current));
        if (!cancelled) becomeReady(uid, created);
      } catch (e) {
        if (cancelled) return;
        console.error('Failed to load progress:', e instanceof Error ? e.message : e);
        mutate(() => blankCore(uid, 'error'));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, loadAttempt, becomeReady, mutate]);

  const retryLoad = useCallback(() => {
    mutate((c) => ({ ...c, status: 'loading' }));
    setLoadAttempt((n) => n + 1);
  }, [mutate]);

  /** User chose to import device progress. Local data is kept either way. */
  const importLegacy = useCallback(async (): Promise<boolean> => {
    if (!uid || !legacyProgress) return false;
    try {
      const stored = await createStoredIfMissing(db, uid, legacyProgress);
      // The write is confirmed; only now is the claim recorded.
      markLegacyClaimed(uid);
      if (activeUidRef.current === uid) becomeReady(uid, stored);
      return true;
    } catch (e) {
      console.error('Failed to import progress:', e instanceof Error ? e.message : e);
      return false;
    }
  }, [uid, legacyProgress, becomeReady]);

  /** User declined the import: start with defaults. Device data is untouched. */
  const startFresh = useCallback(async (): Promise<boolean> => {
    if (!uid) return false;
    try {
      const created = await createStoredIfMissing(db, uid, createDefaultProgress(nameRef.current));
      if (activeUidRef.current === uid) becomeReady(uid, created);
      return true;
    } catch (e) {
      console.error('Failed to create progress:', e instanceof Error ? e.message : e);
      return false;
    }
  }, [uid, becomeReady]);

  // ── Save: patches are applied to the latest stored state in a transaction ──
  const freezePending = useCallback(
    (forUid: string) => {
      const c = coreRef.current;
      if (c.uid !== forUid || isEmptyPatch(c.pending)) return;
      const entry: OutboxEntry = { id: newWriteId(), patch: c.pending };
      addToOutbox(forUid, entry);
      mutate((cur) => ({ ...cur, frozen: [...cur.frozen, entry], pending: emptyPatch() }));
    },
    [mutate],
  );

  /**
   * Sends everything unconfirmed, oldest first, one at a time. Resolves true
   * only after Firestore has confirmed the last write; false if a write failed
   * (the patches stay queued and a retry is scheduled).
   */
  const flush = useCallback(
    (forUid: string): Promise<boolean> => {
      if (flushRef.current) return flushRef.current;
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      const run = (async () => {
        // Lets the assignment of flushRef below happen before any early exit.
        await Promise.resolve();
        try {
          for (;;) {
            if (activeUidRef.current !== forUid || coreRef.current.uid !== forUid) return false;
            if (coreRef.current.status !== 'ready') return false;
            if (coreRef.current.frozen.length === 0) {
              if (isEmptyPatch(coreRef.current.pending)) break;
              freezePending(forUid);
            }
            const entry = coreRef.current.frozen[0];
            setSaveStatus('saving');
            const result = await commitPatch(db, forUid, entry.id, entry.patch);
            if (activeUidRef.current !== forUid) return false;
            removeFromOutbox(forUid, entry.id);
            mutate((c) =>
              c.uid !== forUid
                ? c
                : {
                    ...c,
                    // A newer revision may already have arrived from another tab.
                    ...(result.revision >= c.revision
                      ? { base: result.progress, revision: result.revision }
                      : {}),
                    frozen: c.frozen.filter((e) => e.id !== entry.id),
                  },
            );
            retryCountRef.current = 0;
          }
          setSaveStatus('idle');
          return true;
        } catch (e) {
          console.error('Failed to save progress:', e instanceof Error ? e.message : e);
          if (activeUidRef.current === forUid) {
            setSaveStatus('error');
            const delay = Math.min(MAX_RETRY_DELAY_MS, 2000 * 2 ** retryCountRef.current);
            retryCountRef.current += 1;
            retryTimerRef.current = window.setTimeout(() => {
              retryTimerRef.current = null;
              void flush(forUid);
            }, delay);
          }
          return false;
        } finally {
          flushRef.current = null;
        }
      })();

      flushRef.current = run;
      return run;
    },
    [freezePending, mutate],
  );

  // Debounced send whenever there is anything unconfirmed.
  const hasUnsent = isCurrent && core.status === 'ready' && (core.frozen.length > 0 || !isEmptyPatch(core.pending));
  useEffect(() => {
    if (!uid || !hasUnsent) return;
    const timer = window.setTimeout(() => void flush(uid), SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [uid, hasUnsent, core.pending, flush]);

  // Sign-out hook: lets logout wait until Firestore has confirmed everything.
  useEffect(() => {
    if (!uid) return;
    return registerPendingSaveFlusher(async () => {
      if (coreRef.current.uid !== uid || coreRef.current.status !== 'ready') return true;
      return flush(uid);
    });
  }, [uid, flush]);

  // Live updates: another tab's confirmed changes appear here, and patches the
  // server already recorded (lost acknowledgement) are never shown twice.
  useEffect(() => {
    if (!uid || !isCurrent || core.status !== 'ready') return;
    return onSnapshot(
      doc(db, 'users', uid, 'progress', 'state'),
      (snap) => {
        if (!snap.exists() || snap.metadata.hasPendingWrites) return;
        const remote = readStored(snap.data());
        mutate((c) => {
          if (c.uid !== uid || remote.revision < c.revision) return c;
          const applied = c.frozen.filter((e) => remote.recentWriteIds.includes(e.id));
          applied.forEach((e) => removeFromOutbox(uid, e.id));
          return {
            ...c,
            base: remote.progress,
            revision: remote.revision,
            frozen: c.frozen.filter((e) => !remote.recentWriteIds.includes(e.id)),
          };
        });
      },
      (error) => console.warn('Progress listener stopped:', error.code),
    );
  }, [uid, isCurrent, core.status, mutate]);

  // Leaving or hiding the page: persist unconfirmed patches to the outbox
  // right away and warn before a tab with unsaved changes is closed.
  useEffect(() => {
    if (!uid) return;
    const hasUnconfirmed = () =>
      coreRef.current.uid === uid &&
      (coreRef.current.frozen.length > 0 || !isEmptyPatch(coreRef.current.pending));
    const persistNow = () => {
      if (!hasUnconfirmed()) return;
      freezePending(uid);
      void flush(uid);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') persistNow();
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnconfirmed()) {
        persistNow();
        e.preventDefault();
      }
    };
    window.addEventListener('online', persistNow);
    window.addEventListener('pagehide', persistNow);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('online', persistNow);
      window.removeEventListener('pagehide', persistNow);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [uid, flush, freezePending]);

  const retrySave = useCallback(() => {
    if (uid) void flush(uid);
  }, [uid, flush]);

  /** Records an update as a patch, but only against this account's loaded progress. */
  const setProgress = useCallback(
    (updater: (prev: UserProgress) => UserProgress) => {
      mutate((c) => {
        if (c.uid !== activeUidRef.current || c.status !== 'ready') return c;
        const current = displayOf(c);
        const patch = diffProgress(current, updater(current));
        return isEmptyPatch(patch) ? c : { ...c, pending: composePatches(c.pending, patch) };
      });
    },
    [mutate],
  );

  const updateUserName = useCallback((name: string) => {
    setProgress((prev) => ({
      ...prev,
      userName: name.trim().slice(0, 60) || 'Learner',
    }));
  }, [setProgress]);

  const getLessonStatus = useCallback(
    (lessonId: string): LessonNodeStatus => {
      if (progress.completedLessonIds.includes(lessonId)) {
        return 'completed';
      }

      // Check order in path
      const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
      if (!lesson) return 'locked';

      // First lesson in path is always available
      if (lesson.order === 1) {
        return 'available';
      }

      // Find previous lesson
      const prevLesson = ALL_LESSONS.find(
        (l) => l.learningPathId === lesson.learningPathId && l.order === lesson.order - 1
      );

      if (prevLesson && progress.completedLessonIds.includes(prevLesson.id)) {
        return 'available';
      }

      return 'locked';
    },
    [progress.completedLessonIds]
  );

  const completeLesson = useCallback(
    (
      lessonId: string,
      mistakesCount: number,
      baseXP: number
    ): {
      xpAwarded: number;
      isFirstCompletion: boolean;
      newlyUnlockedBadges: string[];
    } => {
      const today = new Date().toISOString().split('T')[0];
      const isFirst = !progress.completedLessonIds.includes(lessonId);

      // Streak calculation
      let newStreak = progress.currentStreak;
      if (progress.lastActiveDate) {
        const last = new Date(progress.lastActiveDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Calculate XP: full reward on first completion, 10 review XP if replaying
      const xpEarned = isFirst ? baseXP : 10;
      const newTotalXP = progress.totalXP + xpEarned;

      const updatedCompletedIds = isFirst
        ? [...progress.completedLessonIds, lessonId]
        : progress.completedLessonIds;

      // Check badges to unlock
      const newlyUnlockedBadges: string[] = [];
      const currentBadges = new Set(progress.earnedBadgeIds);

      // Criteria checks
      if (updatedCompletedIds.length >= 1 && !currentBadges.has('first-spark')) {
        newlyUnlockedBadges.push('first-spark');
      }
      if (lessonId === 'lesson-2-ai-vs-traditional-programming' && !currentBadges.has('logic-pioneer')) {
        newlyUnlockedBadges.push('logic-pioneer');
      }
      if (lessonId === 'lesson-3-how-machines-learn' && !currentBadges.has('data-dynamo')) {
        newlyUnlockedBadges.push('data-dynamo');
      }
      if (lessonId === 'lesson-4-meet-the-ai-family' && !currentBadges.has('family-reunion')) {
        newlyUnlockedBadges.push('family-reunion');
      }
      if (lessonId === 'lesson-5-what-ai-can-and-cannot-do' && !currentBadges.has('reality-checker')) {
        newlyUnlockedBadges.push('reality-checker');
      }

      // All 5 fundamentals completed
      const allFundCompleted = ALL_LESSONS.every((l) => updatedCompletedIds.includes(l.id));
      if (allFundCompleted && !currentBadges.has('fundamentals-master')) {
        newlyUnlockedBadges.push('fundamentals-master');
      }

      // Streak ignited
      if (newStreak >= 1 && !currentBadges.has('streak-ignited')) {
        newlyUnlockedBadges.push('streak-ignited');
      }

      // Flawless score (0 mistakes)
      if (mistakesCount === 0 && !currentBadges.has('sharp-mind')) {
        newlyUnlockedBadges.push('sharp-mind');
      }

      // 250+ XP
      if (newTotalXP >= 250 && !currentBadges.has('xp-collector')) {
        newlyUnlockedBadges.push('xp-collector');
      }

      // Add badge XP bonuses to total XP
      let badgeBonusXP = 0;
      newlyUnlockedBadges.forEach((badgeId) => {
        const badgeDef = BADGES.find((b) => b.id === badgeId);
        if (badgeDef) {
          badgeBonusXP += badgeDef.xpBonus;
        }
      });

      const finalTotalXP = newTotalXP + badgeBonusXP;

      setProgress((prev) => ({
        ...prev,
        totalXP: finalTotalXP,
        currentStreak: newStreak,
        lastActiveDate: today,
        completedLessonIds: updatedCompletedIds,
        earnedBadgeIds: [...prev.earnedBadgeIds, ...newlyUnlockedBadges],
        lessonAttempts: {
          ...prev.lessonAttempts,
          [lessonId]: {
            completedAt: new Date().toISOString(),
            mistakesCount,
            xpEarned,
          },
        },
      }));

      return {
        xpAwarded: xpEarned + badgeBonusXP,
        isFirstCompletion: isFirst,
        newlyUnlockedBadges,
      };
    },
    [progress, setProgress]
  );

  const unlockBadgeDirectly = useCallback((badgeId: string) => {
    setProgress((prev) => {
      if (prev.earnedBadgeIds.includes(badgeId)) return prev;
      const badgeDef = BADGES.find((b) => b.id === badgeId);
      const bonus = badgeDef ? badgeDef.xpBonus : 0;
      return {
        ...prev,
        totalXP: prev.totalXP + bonus,
        earnedBadgeIds: [...prev.earnedBadgeIds, badgeId],
      };
    });
  }, [setProgress]);

  // Resets this account's saved progress. The legacy device copy is never touched.
  const resetProgress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    mutate((c) =>
      c.uid !== activeUidRef.current || c.status !== 'ready'
        ? c
        : { ...c, pending: composePatches(c.pending, { ...emptyPatch(), reset: today }) },
    );
  }, [mutate]);

  const levelInfo = calculateLevel(progress.totalXP);

  // Path completion helper
  const getPathCompletionPercent = useCallback(
    (pathId: string): number => {
      const pathLessons = ALL_LESSONS.filter((l) => l.learningPathId === pathId);
      if (pathLessons.length === 0) return 0;
      const completed = pathLessons.filter((l) => progress.completedLessonIds.includes(l.id));
      return Math.round((completed.length / pathLessons.length) * 100);
    },
    [progress.completedLessonIds]
  );

  const getNextAvailableLesson = useCallback((): string => {
    for (const lesson of ALL_LESSONS) {
      if (!progress.completedLessonIds.includes(lesson.id)) {
        return lesson.id;
      }
    }
    return ALL_LESSONS[0].id;
  }, [progress.completedLessonIds]);

  return {
    status,
    saveStatus,
    legacyProgress,
    retryLoad,
    retrySave,
    importLegacy,
    startFresh,
    progress,
    levelInfo,
    getLessonStatus,
    completeLesson,
    unlockBadgeDirectly,
    resetProgress,
    updateUserName,
    getPathCompletionPercent,
    getNextAvailableLesson,
  };
}
