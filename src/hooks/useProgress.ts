import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, LessonNodeStatus } from '../types/lesson';
import { BADGES } from '../data/badges';
import { ALL_LESSONS } from '../data/lessons';

const STORAGE_KEY = 'aivio_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  userName: 'Kenny',
  totalXP: 0,
  currentStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [],
  earnedBadgeIds: [],
  lessonAttempts: {},
  activePathId: 'ai-fundamentals',
};

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

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
        };
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Sync state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  const updateUserName = useCallback((name: string) => {
    setProgress((prev) => ({
      ...prev,
      userName: name.trim() || 'Kenny',
    }));
  }, []);

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
    [progress]
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
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
  }, []);

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
