import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { XPDisplay } from './XPDisplay';
import { ContentCard } from './ContentCard';
import { QuizQuestion } from './QuizQuestion';
import { MatchingActivity } from './MatchingActivity';
import { SortingActivity } from './SortingActivity';
import { VideoPlaceholder } from './VideoPlaceholder';
import { sound } from '../utils/sound';
import type { Lesson, LessonBlock } from '../types/lesson';

interface LessonRendererProps {
  lesson: Lesson;
  onLessonFinished: (mistakesCount: number) => void;
  onExit: () => void;
}

export const LessonRenderer: React.FC<LessonRendererProps> = ({
  lesson,
  onLessonFinished,
  onExit,
}) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const currentBlock: LessonBlock = lesson.blocks[currentBlockIndex];
  const progressPercent = Math.round(
    (currentBlockIndex / lesson.blocks.length) * 100
  );

  const handleBlockAdvance = () => {
    if (currentBlockIndex + 1 < lesson.blocks.length) {
      setCurrentBlockIndex((prev) => prev + 1);
    } else {
      onLessonFinished(mistakesCount);
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (!isCorrect) {
      setMistakesCount((prev) => prev + 1);
    }
  };

  const handleActivityMistakes = (mistakes: number) => {
    setMistakesCount((prev) => prev + mistakes);
  };

  return (
    <div className="w-full min-h-screen bg-[#FBF6EE] flex flex-col justify-between py-5 px-4 sm:px-6 max-w-4xl mx-auto select-none">
      {/* Header: exit link, lesson label, title, progress */}
      <div className="pb-5 border-b border-[#E8DCCB]">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              sound.playClick();
              setShowExitConfirm(true);
            }}
            className="flex items-center gap-2 text-sm font-bold text-[#4D3B38] hover:text-[#5C1F2A] transition-colors"
            aria-label="Exit lesson"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            Exit lesson
          </button>
          <XPDisplay xp={lesson.xpReward} size="sm" />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-widest text-[#7A2B37]">
          {lesson.unitTitle} · Lesson {String(lesson.order).padStart(2, '0')}
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black text-[#2B1B1A] tracking-tight leading-tight" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
          {lesson.title}
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar progressPercent={progressPercent} height="lg" color="cyan" />
          </div>
          <span className="text-sm font-black text-[#2B1B1A] tabular-nums">{progressPercent}%</span>
        </div>
        <p className="mt-1.5 text-[11px] font-bold text-[#857670] uppercase tracking-wider">
          Step {currentBlockIndex + 1} of {lesson.blocks.length} · Lesson progress
        </p>
      </div>

      {/* Main Interactive Block Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col justify-center min-w-0">
        {currentBlock.type === 'content' && (
          <ContentCard block={currentBlock} onContinue={handleBlockAdvance} />
        )}

        {currentBlock.type === 'quiz' && (
          <QuizQuestion
            block={currentBlock}
            onAnswerSubmitted={handleQuizAnswer}
            onContinue={handleBlockAdvance}
          />
        )}

        {currentBlock.type === 'matching' && (
          <MatchingActivity
            block={currentBlock}
            onActivityCompleted={handleActivityMistakes}
            onContinue={handleBlockAdvance}
          />
        )}

        {currentBlock.type === 'sorting' && (
          <SortingActivity
            block={currentBlock}
            onActivityCompleted={handleActivityMistakes}
            onContinue={handleBlockAdvance}
          />
        )}
      </div>

      {/* Right rail: video slot and what this lesson covers */}
      <aside className="space-y-4">
        {lesson.video && <VideoPlaceholder video={lesson.video} />}
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB] p-5">
          <p className="text-sm font-black text-[#2B1B1A]">What you will learn</p>
          <ul className="mt-3 space-y-2">
            {lesson.learningObjectives.map((objective) => (
              <li key={objective} className="flex gap-2 text-xs text-[#4D3B38] leading-relaxed">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#5C1F2A] shrink-0" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-[#FFFDF9] border-2 border-[#F2B93B]/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F2B93B]/20 border-2 border-[#F2B93B] text-[#8A5A00] flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-[#2B1B1A] mb-2">
              Wait, don't leave!
            </h3>
            <p className="text-xs sm:text-sm text-[#4D3B38] mb-6 leading-relaxed font-medium">
              You are making great progress! If you quit now, you will lose your session progress and bonus XP for this lesson.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowExitConfirm(false);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] font-black text-xs uppercase tracking-wider border-b-4 border-[#3D1119] active:translate-y-1 active:border-b-0 transition-all shadow-lg"
              >
                KEEP LEARNING
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onExit();
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#F6EFE4] hover:bg-[#F1E6D6] border-b-4 border-[#FFFDF9] text-[#4D3B38] font-black text-xs uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all"
              >
                QUIT SESSION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
