import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Zap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import { BADGES } from '../data/badges';
import type { Lesson, Badge } from '../types/lesson';

interface CompletionCelebrationProps {
  lesson: Lesson;
  xpAwarded: number;
  isFirstCompletion: boolean;
  mistakesCount: number;
  newlyUnlockedBadges: string[];
  onContinueNext: () => void;
  onReturnDashboard: () => void;
  hasNextLesson: boolean;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  lesson,
  xpAwarded,
  isFirstCompletion,
  mistakesCount,
  newlyUnlockedBadges,
  onContinueNext,
  onReturnDashboard,
  hasNextLesson,
}) => {
  useEffect(() => {
    // Play celebratory victory fanfare
    sound.playFanfare();

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5C1F2A', '#7A2B37', '#3D1119', '#F2B93B', '#8DAA5B'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#5C1F2A', '#9B3A5A'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#7A2B37', '#8DAA5B'],
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  const unlockedBadgeObjs: Badge[] = newlyUnlockedBadges
    .map((id) => BADGES.find((b) => b.id === id))
    .filter((b): b is Badge => Boolean(b));

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 flex flex-col items-center text-center animate-fade-in select-none">
      {/* Celebrating Cat Mascot Character Artwork */}
      <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-[#5C1F2A] shadow-[0_15px_40px_rgba(92,31,42,0.5)] mb-5 bg-[#FFFDF9] animate-bounce-subtle flex items-center justify-center p-2">
        <img
          src="/mascot-penguin-celebrate.png"
          alt="Celebrating Cat Mascot"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF3E3] text-[#4F6B2A] border-2 border-[#8DAA5B]/50 text-xs font-black uppercase tracking-wider mb-2">
        <CheckCircle2 className="w-4 h-4 stroke-[3]" /> LESSON COMPLETED!
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-[#2B1B1A] tracking-tight mb-2">
        {lesson.title}
      </h2>
      <p className="text-xs sm:text-sm font-medium text-[#4D3B38] max-w-md mx-auto mb-6">
        {isFirstCompletion
          ? 'Legendary focus! You leveled up your neural intelligence.'
          : 'Great practice session! Consistent repetition wires the brain.'}
      </p>

      {/* Reward Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-6">
        {/* Total XP Earned */}
        <div className="p-4 rounded-3xl bg-[#FFFDF9] border-2 border-[#F2B93B]/40 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-[#F2B93B]/20 text-[#8A5A00] flex items-center justify-center mx-auto mb-1.5">
            <Zap className="w-5 h-5 fill-[#F2B93B]" />
          </div>
          <span className="text-3xl font-black text-[#8A5A00] font-mono block">
            +{xpAwarded}
          </span>
          <p className="text-[10px] uppercase font-black text-[#8A5A00] tracking-wider">
            XP Earned
          </p>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-3xl bg-[#FFFDF9] border-2 border-[#8DAA5B]/40 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-[#8DAA5B]/20 text-[#4F6B2A] flex items-center justify-center mx-auto mb-1.5">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-black text-[#4F6B2A] font-mono block">
            {mistakesCount === 0 ? '100%' : `${Math.max(60, 100 - mistakesCount * 10)}%`}
          </span>
          <p className="text-[10px] uppercase font-black text-[#4F6B2A] tracking-wider">
            {mistakesCount === 0 ? 'FLAWLESS!' : 'ACCURACY'}
          </p>
        </div>

        {/* Gems Bonus */}
        <div className="p-4 rounded-3xl bg-[#FFFDF9] border-2 border-[#5C1F2A]/40 shadow-lg col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-[#5C1F2A]/20 text-[#5C1F2A] flex items-center justify-center mx-auto mb-1.5 text-lg">
            💎
          </div>
          <span className="text-3xl font-black text-[#5C1F2A] font-mono block">
            +{Math.floor(xpAwarded * 1.5)}
          </span>
          <p className="text-[10px] uppercase font-black text-[#7A2B37] tracking-wider">
            Data Crystals
          </p>
        </div>
      </div>

      {/* Unlocked Badges Celebration */}
      {unlockedBadgeObjs.length > 0 && (
        <div className="w-full mb-6 p-5 rounded-3xl bg-[#F6EFE4] border-2 border-[#E8DCCB]/50 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-xs uppercase font-black tracking-wider text-[#2B1B1A] mb-2">
            <Sparkles className="w-4 h-4 text-[#2B1B1A] animate-spin" /> NEW BADGE UNLOCKED!
          </div>
          <div className="space-y-2">
            {unlockedBadgeObjs.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DCCB]/30 text-left"
              >
                <div>
                  <h4 className="font-black text-sm text-[#2B1B1A]">{badge.title}</h4>
                  <p className="text-xs text-[#2B1B1A]">{badge.description}</p>
                </div>
                <span className="text-xs font-mono font-black text-[#8A5A00] shrink-0">
                  +{badge.xpBonus} XP Bonus
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chunky 3D Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {hasNextLesson ? (
          <button
            onClick={() => {
              sound.playClick();
              onContinueNext();
            }}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] font-black text-sm uppercase tracking-wider border-b-4 border-[#3D1119] active:translate-y-1 active:border-b-0 transition-all shadow-xl shadow-[#5C1F2A]/30 flex items-center justify-center gap-2"
          >
            <span>NEXT LESSON</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              onReturnDashboard();
            }}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#8DAA5B] hover:bg-[#8DAA5B] text-[#2B1B1A] font-black text-sm uppercase tracking-wider border-b-4 border-[#8DAA5B] active:translate-y-1 active:border-b-0 transition-all shadow-xl shadow-[#8DAA5B]/30 flex items-center justify-center gap-2"
          >
            <span>VIEW LESSON PATH</span>
            <CheckCircle2 className="w-5 h-5 stroke-[3]" />
          </button>
        )}

        <button
          onClick={() => {
            sound.playClick();
            onReturnDashboard();
          }}
          className="py-4 px-6 rounded-2xl bg-[#F6EFE4] hover:bg-[#F1E6D6] border-b-4 border-[#FFFDF9] text-[#2B1B1A] font-black text-sm uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};
