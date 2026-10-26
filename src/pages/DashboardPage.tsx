import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';
import { ALL_LESSONS } from '../data/lessons';
import { LessonNode } from '../components/LessonNode';
import { MilestoneChest } from '../components/MilestoneChest';
import { UnitGuidebookModal } from '../components/UnitGuidebookModal';
import { RightGamificationSidebar } from '../components/RightGamificationSidebar';
import { sound } from '../utils/sound';
import type { LessonNodeStatus } from '../types/lesson';

interface DashboardPageProps {
  totalXP: number;
  streakDays: number;
  completedLessonIds: string[];
  getLessonStatus: (id: string) => LessonNodeStatus;
  onSelectLesson: (id: string) => void;
  onNavigateProgress: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  totalXP,
  streakDays,
  completedLessonIds,
  getLessonStatus,
  onSelectLesson,
  onNavigateProgress,
}) => {
  const [showGuidebook, setShowGuidebook] = useState<boolean>(false);
  const [claimedChests, setClaimedChests] = useState<string[]>([]);

  const unit1Lessons = ALL_LESSONS.filter((l) => l.learningPathId === 'ai-fundamentals');
  const completedCount = unit1Lessons.filter((l) => completedLessonIds.includes(l.id)).length;

  // Winding offset x positions for the Duolingo zigzag effect
  const offsets = [
    'translate-x-0', // 1: center
    'sm:-translate-x-14 translate-x-0', // 2: left
    'sm:translate-x-14 translate-x-0', // 3: right
    'sm:-translate-x-14 translate-x-0', // 4: left
    'translate-x-0', // 5: center
  ];

  const handleClaimChest = (chestId: string) => {
    setClaimedChests((prev) => [...prev, chestId]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 lg:pb-12 animate-fade-in select-none">
      {/* Top Mobile Quick Stats Pill Bar (only on smaller screens, since desktop has right sidebar) */}
      <div className="lg:hidden flex items-center justify-between p-3 rounded-2xl bg-[#0f1d38] border-2 border-[#1c325c] mb-6 shadow-md">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-950/60 border border-orange-500/40 text-orange-400 font-black text-xs">
          <Flame className="w-4 h-4 fill-orange-400" />
          <span>{streakDays}d</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-[#1cb0f6] font-black text-xs">
          <span>💎</span>
          <span className="font-mono">{Math.floor(totalXP * 1.5) + 100}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-400/40 text-amber-300 font-black text-xs">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span className="font-mono">{totalXP} XP</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Center Lesson Map Column */}
        <div className="flex-1 w-full max-w-2xl mx-auto">
          {/* Duolingo Unit Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0284c7] via-[#1cb0f6] to-[#0284c7] p-5 sm:p-6 border-b-[6px] border-[#0369a1] shadow-[0_12px_30px_rgba(28,176,246,0.3)] mb-10 text-slate-950 relative overflow-hidden">
            {/* Ambient Background Graphic */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 pointer-events-none">
              <Sparkles className="w-full h-full text-white" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-950 border border-slate-950/20">
                    SECTION 1 • UNIT 1
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    5 Lessons
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  AI Foundations
                </h1>
                <p className="text-xs sm:text-sm font-bold text-sky-950 mt-1 max-w-md">
                  Demystify neural networks, machine learning algorithms, and pattern recognition.
                </p>
              </div>

              {/* Guidebook 3D Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowGuidebook(true);
                }}
                className="px-5 py-3 rounded-2xl bg-[#0f1d38] hover:bg-[#16274a] text-white font-black text-xs uppercase tracking-wider border-b-4 border-[#091224] active:translate-y-1 active:border-b-0 transition-all flex items-center gap-2 shadow-lg shrink-0"
              >
                <BookOpen className="w-4 h-4 text-[#1cb0f6] stroke-[2.5]" />
                <span>GUIDEBOOK</span>
              </button>
            </div>
          </div>

          {/* Duolingo Winding Lesson Pathway */}
          <div className="relative py-4 flex flex-col items-center">
            {/* Cobblestone Winding SVG Connector Trail */}
            <svg
              className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-48 h-[calc(100%-60px)] pointer-events-none z-0"
              preserveAspectRatio="none"
              viewBox="0 0 100 600"
            >
              <path
                d="M 50 20 Q 15 110 50 190 T 50 370 Q 85 450 50 530 T 50 590"
                fill="none"
                stroke="#172b50"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 50 20 Q 15 110 50 190 T 50 370 Q 85 450 50 530 T 50 590"
                fill="none"
                stroke="#1cb0f6"
                strokeWidth="4"
                strokeDasharray="10 10"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>

            {/* Stepping Stone Nodes and Milestones */}
            <div className="space-y-12 sm:space-y-14 w-full flex flex-col items-center relative z-10">
              {/* Lesson 1 */}
              <div className={`transition-transform duration-300 ${offsets[0]}`}>
                <LessonNode
                  id={unit1Lessons[0].id}
                  order={unit1Lessons[0].order}
                  title={unit1Lessons[0].title}
                  status={getLessonStatus(unit1Lessons[0].id)}
                  xpReward={unit1Lessons[0].xpReward}
                  estimatedMinutes={unit1Lessons[0].estimatedMinutes}
                  onSelect={onSelectLesson}
                  showMascotHint={completedCount === 0}
                />
              </div>

              {/* Lesson 2 */}
              <div className={`transition-transform duration-300 ${offsets[1]}`}>
                <LessonNode
                  id={unit1Lessons[1].id}
                  order={unit1Lessons[1].order}
                  title={unit1Lessons[1].title}
                  status={getLessonStatus(unit1Lessons[1].id)}
                  xpReward={unit1Lessons[1].xpReward}
                  estimatedMinutes={unit1Lessons[1].estimatedMinutes}
                  onSelect={onSelectLesson}
                  showMascotHint={completedCount === 1}
                />
              </div>

              {/* Mid-Way Reward Chest */}
              <div className="my-2">
                <MilestoneChest
                  isUnlocked={completedCount >= 2}
                  isClaimed={claimedChests.includes('chest-1')}
                  gemReward={50}
                  xpReward={25}
                  onClaim={() => handleClaimChest('chest-1')}
                />
              </div>

              {/* Lesson 3 */}
              <div className={`transition-transform duration-300 ${offsets[2]}`}>
                <LessonNode
                  id={unit1Lessons[2].id}
                  order={unit1Lessons[2].order}
                  title={unit1Lessons[2].title}
                  status={getLessonStatus(unit1Lessons[2].id)}
                  xpReward={unit1Lessons[2].xpReward}
                  estimatedMinutes={unit1Lessons[2].estimatedMinutes}
                  onSelect={onSelectLesson}
                  showMascotHint={completedCount === 2}
                />
              </div>

              {/* Lesson 4 */}
              <div className={`transition-transform duration-300 ${offsets[3]}`}>
                <LessonNode
                  id={unit1Lessons[3].id}
                  order={unit1Lessons[3].order}
                  title={unit1Lessons[3].title}
                  status={getLessonStatus(unit1Lessons[3].id)}
                  xpReward={unit1Lessons[3].xpReward}
                  estimatedMinutes={unit1Lessons[3].estimatedMinutes}
                  onSelect={onSelectLesson}
                  showMascotHint={completedCount === 3}
                />
              </div>

              {/* Lesson 5 (Final Boss / Milestone Lesson) */}
              <div className={`transition-transform duration-300 ${offsets[4]}`}>
                <LessonNode
                  id={unit1Lessons[4].id}
                  order={unit1Lessons[4].order}
                  title={unit1Lessons[4].title}
                  status={getLessonStatus(unit1Lessons[4].id)}
                  xpReward={unit1Lessons[4].xpReward}
                  estimatedMinutes={unit1Lessons[4].estimatedMinutes}
                  onSelect={onSelectLesson}
                  showMascotHint={completedCount === 4}
                />
              </div>

              {/* Final Unit Trophy Chest */}
              <div className="mt-4">
                <MilestoneChest
                  isUnlocked={completedCount === 5}
                  isClaimed={claimedChests.includes('chest-trophy')}
                  gemReward={150}
                  xpReward={100}
                  onClaim={() => handleClaimChest('chest-trophy')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Desktop Gamification Sidebar */}
        <div className="hidden lg:block sticky top-6">
          <RightGamificationSidebar
            streakDays={streakDays}
            totalXP={totalXP}
            completedLessonsCount={completedCount}
            onNavigateProgress={onNavigateProgress}
          />
        </div>
      </div>

      {/* Guidebook Modal */}
      <UnitGuidebookModal
        isOpen={showGuidebook}
        onClose={() => setShowGuidebook(false)}
      />
    </div>
  );
};
