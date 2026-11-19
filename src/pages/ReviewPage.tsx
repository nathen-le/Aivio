import React from 'react';
import { CheckCircle2, Lock, Play, Zap } from 'lucide-react';
import { ALL_LESSONS } from '../data/lessons';
import { TopBar, type TopTab } from '../components/TopBar';
import { sound } from '../utils/sound';
import type { LessonNodeStatus } from '../types/lesson';

interface ReviewPageProps {
  totalXP: number;
  streakDays: number;
  completedLessonIds: string[];
  getLessonStatus: (id: string) => LessonNodeStatus;
  onSelectLesson: (id: string) => void;
  onNavigateTop: (tab: TopTab) => void;
}

const UNIT_ONE_ID = 'ai-fundamentals';

export const ReviewPage: React.FC<ReviewPageProps> = ({
  totalXP,
  streakDays,
  completedLessonIds,
  getLessonStatus,
  onSelectLesson,
  onNavigateTop,
}) => {
  const unitLessons = ALL_LESSONS.filter((l) => l.learningPathId === UNIT_ONE_ID);
  const completed = unitLessons.filter((l) => completedLessonIds.includes(l.id));
  // A sprint replays the most recent finished lesson; before any finish, it points at the first lesson.
  const sprintLesson = completed[completed.length - 1] ?? unitLessons[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-6 pb-28 lg:pb-12 animate-fade-in select-none">
      <TopBar active="review" onSelect={onNavigateTop} streakDays={streakDays} totalXP={totalXP} />

      <p className="text-xs font-black uppercase tracking-widest text-[#857670] mb-2">Review games</p>
      <h1 className="text-4xl sm:text-5xl font-black text-[#2B1B1A] tracking-tight leading-[1.05]" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
        Learn it. Play it. Make it stick.
      </h1>
      <p className="text-base text-[#4D3B38] mt-3 max-w-xl">
        Short rounds that bring back what you already learned.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5">
        {/* Hero: pattern sprint */}
        <div className="rounded-3xl bg-[#5C1F2A] text-[#FFF8EE] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-lg shadow-[#5C1F2A]/20">
          <div>
            <span className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#3D1119] text-[#FBE9A6]">
              Quick round
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-4" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
              Pattern sprint
            </h2>
            <p className="text-sm text-[#F1E6D6]/90 mt-2 max-w-md">
              Spot the pattern and pick the right answer fast. Each question is pulled from the lessons you have finished.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                sound.playClick();
                onSelectLesson(sprintLesson.id);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FFF8EE] text-[#5C1F2A] font-black text-sm hover:bg-[#FBE9A6] transition-colors"
            >
              <Play className="w-4 h-4 fill-[#5C1F2A]" />
              Play practice round
            </button>
            <span className="text-sm font-bold text-[#F1E6D6]/90">
              {completed.length} of {unitLessons.length} lessons ready to review
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB] p-6 flex flex-col justify-between">
          <p className="text-sm font-black text-[#2B1B1A]">Your review stats</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-2xl bg-[#FBE9A6] p-4">
              <p className="text-xs font-bold text-[#8A5A00]">Total XP</p>
              <p className="text-2xl font-black text-[#2B1B1A] flex items-center gap-1 mt-1">
                <Zap className="w-5 h-5 fill-[#F2B93B] text-[#F2B93B]" /> {totalXP}
              </p>
            </div>
            <div className="rounded-2xl bg-[#FBE3E0] p-4">
              <p className="text-xs font-bold text-[#7A2B37]">Day streak</p>
              <p className="text-2xl font-black text-[#2B1B1A] mt-1">{streakDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topic shelf */}
      <h3 className="text-xl font-black text-[#2B1B1A] mt-10 mb-4" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
        Your topic shelf
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {unitLessons.map((lesson) => {
          const status = getLessonStatus(lesson.id);
          const locked = status === 'locked';
          const done = completedLessonIds.includes(lesson.id);
          return (
            <button
              key={lesson.id}
              disabled={locked}
              onClick={() => {
                sound.playClick();
                onSelectLesson(lesson.id);
              }}
              className={`text-left p-5 rounded-3xl border transition-colors ${
                locked
                  ? 'bg-[#F6EFE4] border-[#E8DCCB] cursor-not-allowed'
                  : 'bg-[#FFFDF9] border-[#E8DCCB] hover:border-[#5C1F2A]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                {lesson.icon ? (
                  <img
                    src={`/icons/${lesson.icon}-${locked ? 'gray' : 'color'}.png`}
                    alt=""
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="w-10 h-10 rounded-2xl bg-[#FBE3E0] text-[#5C1F2A] flex items-center justify-center font-black">
                    {lesson.order}
                  </span>
                )}
                {locked ? (
                  <Lock className="w-4 h-4 text-[#857670]" />
                ) : done ? (
                  <CheckCircle2 className="w-5 h-5 text-[#4F6B2A]" />
                ) : null}
              </div>
              <p className="text-sm font-black text-[#2B1B1A] leading-snug">{lesson.title}</p>
              <p className="text-xs text-[#857670] mt-1">
                {locked ? 'Finish the lesson before it' : done ? 'Replay to stay sharp' : `${lesson.estimatedMinutes} min`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
