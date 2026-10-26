import React, { useState } from 'react';
import {
  Award,
  Zap,
  Flame,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { BADGES } from '../data/badges';
import { LEARNING_PATHS } from '../data/learningPaths';
import { ALL_LESSONS } from '../data/lessons';
import { BadgeCard } from '../components/BadgeCard';
import { ProgressBar } from '../components/ProgressBar';
import { sound } from '../utils/sound';
import type { LevelInfo } from '../hooks/useProgress';
import type { UserProgress } from '../types/lesson';

interface ProgressPageProps {
  progress: UserProgress;
  levelInfo: LevelInfo;
  onResumeNextLesson: () => void;
  onResetProgress: () => void;
  getPathCompletionPercent: (pathId: string) => number;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progress,
  levelInfo,
  onResumeNextLesson,
  onResetProgress,
  getPathCompletionPercent,
}) => {
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const completedCount = progress.completedLessonIds.length;
  const totalAvailableLessons = ALL_LESSONS.length;
  const overallPercentage = Math.round((completedCount / totalAvailableLessons) * 100);

  const filteredBadges = BADGES.filter((badge) => {
    const isUnlocked = progress.earnedBadgeIds.includes(badge.id);
    if (selectedBadgeFilter === 'unlocked') return isUnlocked;
    if (selectedBadgeFilter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12 animate-fade-in select-none">
      {/* Top Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Mascot Avatar Portrait */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-4 border-[#1cb0f6] bg-slate-900 shrink-0 shadow-lg">
              <img
                src="/mascot-fox-avatar.jpg"
                alt="Aivo Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] uppercase font-black tracking-wider text-[#1cb0f6]">
                  STUDENT PASSPORT
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                  Level {levelInfo.level}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {progress.userName}'s AI Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-bold">
                {levelInfo.title} • {completedCount} of {totalAvailableLessons} Lessons Mastered ({overallPercentage}%)
              </p>
            </div>
          </div>

          {/* Resume Next Lesson Button */}
          <button
            onClick={() => {
              sound.playClick();
              onResumeNextLesson();
            }}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-sm uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>RESUME LESSON</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <div className="p-4 rounded-2xl bg-[#142344] border-2 border-[#1f3764]">
            <span className="text-xs uppercase font-black text-amber-400 flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 fill-amber-400" /> Total XP
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
              {progress.totalXP}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">All-time points</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#142344] border-2 border-[#1f3764]">
            <span className="text-xs uppercase font-black text-orange-400 flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 fill-orange-400" /> Daily Streak
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
              {progress.currentStreak} {progress.currentStreak === 1 ? 'day' : 'days'}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">Daily habit</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#142344] border-2 border-[#1f3764]">
            <span className="text-xs uppercase font-black text-cyan-400 flex items-center gap-1.5 mb-1">
              <span>💎</span> Crystals
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
              {Math.floor(progress.totalXP * 1.5) + 100}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">In-game gems</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#142344] border-2 border-[#1f3764]">
            <span className="text-xs uppercase font-black text-purple-400 flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4" /> Badges
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
              {progress.earnedBadgeIds.length} / {BADGES.length}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">Achievements</span>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="mt-6 pt-5 border-t-2 border-[#1c325c]">
          <div className="flex justify-between items-center text-xs font-black text-slate-200 mb-1.5">
            <span>
              Level {levelInfo.level}: {levelInfo.title}
            </span>
            <span className="text-sky-300 font-mono">
              {levelInfo.currentXP} / {levelInfo.xpForNextLevel} XP ({levelInfo.progressPercent}%)
            </span>
          </div>
          <ProgressBar progressPercent={levelInfo.progressPercent} height="md" color="purple" />
        </div>
      </div>

      {/* Curriculum Path Completion Progress */}
      <div className="mb-10">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1cb0f6]" />
          Curriculum Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_PATHS.map((path) => {
            const isAvailable = path.status === 'available';
            const percent = isAvailable ? getPathCompletionPercent(path.id) : 0;

            return (
              <div
                key={path.id}
                className="p-5 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border ${path.colorTheme.badge}`}
                    >
                      {path.difficulty}
                    </span>
                    <span className="text-xs font-mono font-black text-[#1cb0f6]">
                      {percent}%
                    </span>
                  </div>
                  <h3 className="font-black text-base text-white mb-1">{path.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 font-medium">
                    {path.shortDescription}
                  </p>
                </div>
                <div>
                  <ProgressBar
                    progressPercent={percent}
                    height="sm"
                    color={percent === 100 ? 'emerald' : 'cyan'}
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold mt-2">
                    <span>
                      {isAvailable
                        ? `${completedCount} of ${path.totalLessons} completed`
                        : 'Coming soon'}
                    </span>
                    {percent === 100 && (
                      <span className="text-emerald-400 font-black flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Showcase */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Badges & Milestones
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Unlock credentials and XP bonuses by completing lessons and maintaining accuracy.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#0f1d38] border-2 border-[#1c325c] rounded-2xl text-xs font-black">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedBadgeFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                selectedBadgeFilter === 'all'
                  ? 'bg-[#1b3464] text-[#1cb0f6]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({BADGES.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedBadgeFilter('unlocked');
              }}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                selectedBadgeFilter === 'unlocked'
                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Earned ({progress.earnedBadgeIds.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedBadgeFilter('locked');
              }}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                selectedBadgeFilter === 'locked'
                  ? 'bg-[#1b3464] text-slate-200'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Locked ({BADGES.length - progress.earnedBadgeIds.length})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = progress.earnedBadgeIds.includes(badge.id);
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={isUnlocked}
              />
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Progress with confirmation */}
      <div className="pt-8 border-t-2 border-[#1c325c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider">
            Reset Demo Progress
          </h4>
          <p className="text-xs text-slate-400 font-medium">
            Clear all saved lesson completions, badges, and XP stored in your local browser.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowResetModal(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-[#0f1d38] hover:bg-rose-950/60 border-2 border-slate-700 hover:border-rose-500 text-slate-300 hover:text-rose-200 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo Data
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-[#0f1d38] border-2 border-rose-500 rounded-3xl p-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-950 border-2 border-rose-500 text-rose-400 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black text-white text-center mb-2">
              Reset all demo progress?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 text-center mb-6 leading-relaxed font-medium">
              This will permanently clear your earned XP, streak, completed lessons, and unlocked badges in your local browser.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowResetModal(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#142344] hover:bg-[#1a2e58] border-b-4 border-[#0c182e] text-slate-200 font-black text-xs uppercase tracking-wider active:translate-y-1 active:border-b-0"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onResetProgress();
                  setShowResetModal(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-rose-800 active:translate-y-1 active:border-b-0 shadow-lg shadow-rose-950/50"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
