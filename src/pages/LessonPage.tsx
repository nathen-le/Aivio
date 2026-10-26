import React, { useState } from 'react';
import type { Lesson } from '../types/lesson';
import { LessonRenderer } from '../components/LessonRenderer';
import { CompletionCelebration } from '../components/CompletionCelebration';
import { getNextLesson } from '../data/lessons';

interface LessonPageProps {
  lesson: Lesson;
  onLessonCompleted: (
    lessonId: string,
    mistakesCount: number,
    baseXP: number
  ) => {
    xpAwarded: number;
    isFirstCompletion: boolean;
    newlyUnlockedBadges: string[];
  };
  onExit: () => void;
  onNavigateLesson: (lessonId: string) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  onLessonCompleted,
  onExit,
  onNavigateLesson,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completionResults, setCompletionResults] = useState<{
    xpAwarded: number;
    isFirstCompletion: boolean;
    newlyUnlockedBadges: string[];
    mistakesCount: number;
  } | null>(null);

  const nextLesson = getNextLesson(lesson.id);

  const handleFinish = (mistakesCount: number) => {
    const results = onLessonCompleted(lesson.id, mistakesCount, lesson.xpReward);
    setCompletionResults({
      ...results,
      mistakesCount,
    });
    setIsCompleted(true);
  };

  if (isCompleted && completionResults) {
    return (
      <CompletionCelebration
        lesson={lesson}
        xpAwarded={completionResults.xpAwarded}
        isFirstCompletion={completionResults.isFirstCompletion}
        mistakesCount={completionResults.mistakesCount}
        newlyUnlockedBadges={completionResults.newlyUnlockedBadges}
        onContinueNext={() => {
          if (nextLesson) {
            setIsCompleted(false);
            setCompletionResults(null);
            onNavigateLesson(nextLesson.id);
          } else {
            onExit();
          }
        }}
        onReturnDashboard={onExit}
        hasNextLesson={Boolean(nextLesson)}
      />
    );
  }

  return (
    <LessonRenderer
      lesson={lesson}
      onLessonFinished={handleFinish}
      onExit={onExit}
    />
  );
};
