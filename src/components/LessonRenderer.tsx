import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { XPDisplay } from './XPDisplay';
import { ContentCard } from './ContentCard';
import { QuizQuestion } from './QuizQuestion';
import { MatchingActivity } from './MatchingActivity';
import { SortingActivity } from './SortingActivity';
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
    <div className="w-full min-h-screen bg-[#0a1224] flex flex-col justify-between py-5 px-4 sm:px-6 max-w-4xl mx-auto select-none">
      {/* Top Header Bar (Duolingo Style) */}
      <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b-2 border-[#1c325c]">
        {/* Exit Button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowExitConfirm(true);
          }}
          className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-[#132344] transition-colors focus:outline-none"
          title="Exit lesson"
          aria-label="Exit lesson"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Thick Duolingo Progress Bar */}
        <div className="flex-1">
          <ProgressBar progressPercent={progressPercent} height="lg" color="cyan" />
        </div>

        {/* Step indicator & XP Pill */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-black text-sky-400 hidden sm:inline">
            {currentBlockIndex + 1} / {lesson.blocks.length}
          </span>
          <XPDisplay xp={lesson.xpReward} size="sm" />
        </div>
      </div>

      {/* Main Interactive Block Area */}
      <div className="flex-1 flex flex-col justify-center py-6 sm:py-8 animate-fade-in">
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

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-[#0f1d38] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              Wait, don't leave!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed font-medium">
              You are making great progress! If you quit now, you will lose your session progress and bonus XP for this lesson.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowExitConfirm(false);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-xs uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all shadow-lg"
              >
                KEEP LEARNING
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onExit();
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#142344] hover:bg-[#1a2e58] border-b-4 border-[#0c182e] text-slate-300 font-black text-xs uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all"
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
