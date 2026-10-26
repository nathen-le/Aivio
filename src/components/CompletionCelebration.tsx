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
        colors: ['#1cb0f6', '#38bdf8', '#0284c7', '#f59e0b', '#10b981'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#1cb0f6', '#8b5cf6'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#38bdf8', '#10b981'],
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
      {/* Celebrating Fox Mascot Character Artwork */}
      <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-[#1cb0f6] shadow-[0_15px_40px_rgba(28,176,246,0.5)] mb-5 bg-[#0f1d38] animate-bounce-subtle">
        <img
          src="/mascot-fox-celebrate.jpg"
          alt="Celebrating Fox Mascot"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 border-2 border-emerald-500/50 text-xs font-black uppercase tracking-wider mb-2">
        <CheckCircle2 className="w-4 h-4 stroke-[3]" /> LESSON COMPLETED!
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
        {lesson.title}
      </h2>
      <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-md mx-auto mb-6">
        {isFirstCompletion
          ? 'Legendary focus! You leveled up your neural intelligence.'
          : 'Great practice session! Consistent repetition wires the brain.'}
      </p>

      {/* Reward Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-6">
        {/* Total XP Earned */}
        <div className="p-4 rounded-3xl bg-[#0f1d38] border-2 border-amber-500/40 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1.5">
            <Zap className="w-5 h-5 fill-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-300 font-mono block">
            +{xpAwarded}
          </span>
          <p className="text-[10px] uppercase font-black text-amber-400 tracking-wider">
            XP Earned
          </p>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-3xl bg-[#0f1d38] border-2 border-emerald-500/40 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-black text-emerald-300 font-mono block">
            {mistakesCount === 0 ? '100%' : `${Math.max(60, 100 - mistakesCount * 10)}%`}
          </span>
          <p className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">
            {mistakesCount === 0 ? 'FLAWLESS!' : 'ACCURACY'}
          </p>
        </div>

        {/* Gems Bonus */}
        <div className="p-4 rounded-3xl bg-[#0f1d38] border-2 border-[#1cb0f6]/40 shadow-lg col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-[#1cb0f6] flex items-center justify-center mx-auto mb-1.5 text-lg">
            💎
          </div>
          <span className="text-3xl font-black text-[#1cb0f6] font-mono block">
            +{Math.floor(xpAwarded * 1.5)}
          </span>
          <p className="text-[10px] uppercase font-black text-sky-400 tracking-wider">
            Data Crystals
          </p>
        </div>
      </div>

      {/* Unlocked Badges Celebration */}
      {unlockedBadgeObjs.length > 0 && (
        <div className="w-full mb-6 p-5 rounded-3xl bg-[#142344] border-2 border-purple-500/50 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-xs uppercase font-black tracking-wider text-purple-300 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" /> NEW BADGE UNLOCKED!
          </div>
          <div className="space-y-2">
            {unlockedBadgeObjs.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0f1d38] border-2 border-purple-500/30 text-left"
              >
                <div>
                  <h4 className="font-black text-sm text-white">{badge.title}</h4>
                  <p className="text-xs text-purple-200">{badge.description}</p>
                </div>
                <span className="text-xs font-mono font-black text-amber-300 shrink-0">
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
            className="flex-1 py-4 px-6 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-sm uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2"
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
            className="flex-1 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
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
          className="py-4 px-6 rounded-2xl bg-[#142344] hover:bg-[#1a2e58] border-b-4 border-[#0c182e] text-slate-200 font-black text-sm uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};
