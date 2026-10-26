import type { Lesson } from '../../types/lesson';
import { UNIT_1_LESSONS } from './unit-1-meet-ai';

export const ALL_LESSONS: Lesson[] = [
  ...UNIT_1_LESSONS,
];

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonsByPath(pathId: string): Lesson[] {
  return ALL_LESSONS.filter((lesson) => lesson.learningPathId === pathId).sort((a, b) => a.order - b.order);
}

export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const current = getLessonById(currentLessonId);
  if (!current) return undefined;
  const pathLessons = getLessonsByPath(current.learningPathId);
  const currentIndex = pathLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex >= 0 && currentIndex < pathLessons.length - 1) {
    return pathLessons[currentIndex + 1];
  }
  return undefined;
}
