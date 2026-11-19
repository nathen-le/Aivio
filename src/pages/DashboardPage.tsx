import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Flame,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  Trophy,
  ShieldAlert,
  Wrench,
  Network,
  Palette,
  Globe,
  Award,
} from 'lucide-react';
import { ALL_LESSONS } from '../data/lessons';
import { LEARNING_PATHS } from '../data/learningPaths';
import { LessonNode } from '../components/LessonNode';
import { MilestoneChest } from '../components/MilestoneChest';
import { UnitGuidebookModal } from '../components/UnitGuidebookModal';
import { RightGamificationSidebar } from '../components/RightGamificationSidebar';
import { ConnectingRoadmap } from '../components/ConnectingRoadmap';
import { sound } from '../utils/sound';
import type { LessonNodeStatus } from '../types/lesson';

interface DashboardPageProps {
  totalXP: number;
  streakDays: number;
  completedLessonIds: string[];
  getLessonStatus: (id: string) => LessonNodeStatus;
  onSelectLesson: (id: string) => void;
  onNavigateProgress: () => void;
  onNavigateFriends?: () => void;
  activeTab?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  totalXP,
  streakDays,
  completedLessonIds,
  getLessonStatus,
  onSelectLesson,
  onNavigateProgress,
  onNavigateFriends,
  activeTab = 'learn',
}) => {
  const [showGuidebook, setShowGuidebook] = useState<boolean>(false);
  const [claimedChests, setClaimedChests] = useState<string[]>([]);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const roadmapContainerRef = useRef<HTMLDivElement | null>(null);
  const checkpointRefs = useRef<(HTMLElement | null)[]>([]);


  const unit1Lessons = ALL_LESSONS.filter((l) => l.learningPathId === 'ai-fundamentals');
  const completedCount = unit1Lessons.filter((l) => completedLessonIds.includes(l.id)).length;

  // Winding offset x positions for natural stepping stone path
  const offsets = [
    'translate-x-0', // 1: center
    'sm:-translate-x-14 translate-x-0', // 2: left
    'sm:translate-x-14 translate-x-0', // 3: right
    'sm:-translate-x-14 translate-x-0', // 4: left
    'translate-x-0', // 5: center
    'sm:translate-x-14 translate-x-0', // 6: right
    'translate-x-0', // 7: center
  ];

  const handleClaimChest = (chestId: string) => {
    setClaimedChests((prev) => [...prev, chestId]);
  };

  const handleLockedNodeClick = (unitTitle: string, lessonTitle: string) => {
    sound.playIncorrect();
    setLockedToast(`🔒 Locked: Complete previous units to unlock "${lessonTitle}" in ${unitTitle}!`);
    setTimeout(() => setLockedToast(null), 3000);
  };

  // 5 Placeholder Units metadata
  const placeholderUnits = [
    {
      unitNumber: 2,
      pathId: 'ai-tools-productivity',
      title: 'AI Tools & Prompt Crafting',
      tagline: 'Master modern LLM workflows, context framing, and study assistants.',
      icon: <Wrench className="w-6 h-6 text-[#2B1B1A]" />,
      colorTheme: {
        banner: 'from-[#5C1F2A] via-[#5C1F2A] to-[#5C1F2A]',
        border: 'border-[#E8DCCB]',
        badge: 'bg-[#FBE3E0]/80 text-[#2B1B1A] border-[#E8DCCB]/40',
        accent: '#9B3A5A',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-tools-productivity')?.lessons || [],
      requiredPreviousUnit: 'Unit 1: AI Foundations',
    },
    {
      unitNumber: 3,
      pathId: 'ai-ethics-citizenship',
      title: 'AI Ethics & Digital Citizenship',
      tagline: 'Algorithmic bias, deepfakes, copyright, and ethical teenage citizenship.',
      icon: <ShieldAlert className="w-6 h-6 text-[#4F6B2A]" />,
      colorTheme: {
        banner: 'from-[#EEF3E3] via-[#8DAA5B] to-[#EEF3E3]',
        border: 'border-[#8DAA5B]',
        badge: 'bg-[#EEF3E3] text-[#4F6B2A] border-[#8DAA5B]/40',
        accent: '#8DAA5B',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-ethics-citizenship')?.lessons || [],
      requiredPreviousUnit: 'Unit 2: AI Tools',
    },
    {
      unitNumber: 4,
      pathId: 'how-ai-learns',
      title: 'How AI Learns (Neural Networks)',
      tagline: 'Weights, biases, loss functions, backprop, and gradient descent.',
      icon: <Network className="w-6 h-6 text-[#8A5A00]" />,
      colorTheme: {
        banner: 'from-[#b45309] via-[#F2B93B] to-[#c2410c]',
        border: 'border-[#92400e]',
        badge: 'bg-[#FBE9A6]/80 text-[#8A5A00] border-[#F2B93B]/40',
        accent: '#F2B93B',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'how-ai-learns')?.lessons || [],
      requiredPreviousUnit: 'Unit 3: AI Ethics',
    },
    {
      unitNumber: 5,
      pathId: 'ai-creator-lab',
      title: 'AI Creator Lab & Multimodal',
      tagline: 'Diffusion image synthesis, voice cloning, and creative digital media.',
      icon: <Palette className="w-6 h-6 text-[#B0303C]" />,
      colorTheme: {
        banner: 'from-[#5C1F2A] via-[#C2414B] to-[#5C1F2A]',
        border: 'border-[#E8DCCB]',
        badge: 'bg-[#FBE3E0] text-[#B0303C] border-[#C2414B]/40',
        accent: '#C2414B',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-creator-lab')?.lessons || [],
      requiredPreviousUnit: 'Unit 4: Neural Networks',
    },
    {
      unitNumber: 6,
      pathId: 'ai-in-real-world',
      title: 'AI in the Real World & Careers',
      tagline: 'Autonomous vehicles, healthcare, climate tech, and future careers.',
      icon: <Globe className="w-6 h-6 text-[#7A2B37]" />,
      colorTheme: {
        banner: 'from-[#5C1F2A] via-[#5C1F2A] to-[#3D1119]',
        border: 'border-[#E8DCCB]',
        badge: 'bg-[#FBE3E0]/80 text-[#7A2B37] border-[#5C1F2A]/40',
        accent: '#5C1F2A',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-in-real-world')?.lessons || [],
      requiredPreviousUnit: 'Unit 5: Creator Lab',
    },
  ];

  // Leaderboard peers
  // Friends' XP is private learning progress and is not shared with other
  // accounts, so the board only ranks the signed-in learner.
  const allPeers = [{ name: 'You', xp: totalXP, isUser: true, avatar: '🐱', streak: streakDays }];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5 pb-24 lg:pb-12 animate-fade-in select-none">
      {/* Toast Notification */}
      {lockedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-[#F2B93B] text-[#2B1B1A] font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-[#F2B93B]/30 animate-fade-in flex items-center gap-2 max-w-md text-center">
          {lockedToast}
        </div>
      )}

      {/* Top Mobile Quick Stats Bar */}
      <div className="lg:hidden flex items-center justify-between p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DCCB]/70 mb-5 shadow-lg gap-2">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FBE9A6] border border-[#E9873A]/30 text-[#B5581B] font-black text-xs">
          <Flame className="w-4 h-4 fill-[#E9873A] animate-fire-flicker" />
          <span>{streakDays}d</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FBE3E0]/40 border border-[#5C1F2A]/25 text-[#5C1F2A] font-black text-xs">
          <span>💎</span>
          <span className="font-mono">{Math.floor(totalXP * 1.5) + 100}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FBE9A6] border border-[#F2B93B]/25 text-[#8A5A00] font-black text-xs">
          <Zap className="w-4 h-4 fill-[#F2B93B]" />
          <span className="font-mono">{totalXP}</span>
        </div>
      </div>

      {/* When activeTab is 'leaderboard', show the full community leaderboard */}
      {activeTab === 'leaderboard' ? (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#3D1119] via-[#5C1F2A] to-[#3D1119] border-b-[6px] border-[#3D1119] text-[#FFF8EE] mb-8 shadow-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFFDF9]/20 text-[#2B1B1A]">
                  Global Cohort Rankings
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">Leagues & Friends</h1>
              <p className="text-xs sm:text-sm font-bold text-[#7A2B37] mt-1">
                Compete with classmates and friends. Top learners earn bonus XP badges each week!
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#FFFDF9] border-2 border-white flex items-center justify-center text-3xl shadow-lg shrink-0">
              🏆
            </div>
          </div>

          <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-6 shadow-xl">
            <h3 className="text-sm font-black text-[#2B1B1A] uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#8A5A00]" />
                This Week's Leaderboard
              </span>
              <span className="text-xs font-bold text-[#857670]">Resets in 3 days</span>
            </h3>

            <div className="space-y-2">
              {allPeers.map((peer, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                      peer.isUser
                        ? 'bg-[#F1E6D6] border-[#5C1F2A] text-[#2B1B1A] shadow-lg shadow-[#5C1F2A]/50'
                        : 'bg-[#F6EFE4] border-[#F1E6D6] text-[#2B1B1A]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-6 text-center font-mono font-black text-sm ${
                          rank === 1
                            ? 'text-[#8A5A00] text-lg'
                            : rank === 2
                            ? 'text-[#4D3B38] text-base'
                            : rank === 3
                            ? 'text-[#8A5A00] text-base'
                            : 'text-[#857670]'
                        }`}
                      >
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                      </span>
                      <div className="text-2xl">{peer.avatar}</div>
                      <div>
                        <div className="text-sm font-black flex items-center gap-2">
                          <span className={peer.isUser ? 'text-[#5C1F2A]' : 'text-[#2B1B1A]'}>
                            {peer.name}
                          </span>
                          {peer.isUser && (
                            <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-[#5C1F2A] text-[#FFF8EE]">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#B5581B] font-bold flex items-center gap-1 mt-0.5">
                          <Flame className="w-3 h-3 fill-[#E9873A]" />
                          {peer.streak} day streak
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-black text-[#8A5A00] block">
                        {peer.xp} XP
                      </span>
                      <span className="text-[10px] text-[#857670] uppercase font-bold">
                        {rank <= 3 ? 'Promotion Zone' : 'Active'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#857670] font-medium mt-4 text-center">
              Friends' progress is private, so only your own XP is ranked here for now.
            </p>
          </div>
        </div>
      ) : (
        /* Standard Learn Roadmap View with All 6 Units */
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Center Lesson Map Column */}
          <div className="flex-1 w-full max-w-2xl mx-auto space-y-16">
            {/* ================= UNIT 1 (ACTIVE) ================= */}
            <div>
              {/* Unit Header Banner */}
              <div className="rounded-3xl bg-gradient-to-br from-[#3D1119] via-[#F1E6D6] to-[#5C1F2A] p-5 sm:p-6 border-b-[5px] border-[#E8DCCB] shadow-[0_16px_40px_rgba(92,31,42,0.35)] mb-6 sm:mb-8 text-[#2B1B1A] relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -right-2 -bottom-8 w-28 h-28 rounded-full bg-white/8 pointer-events-none" />
                <div className="absolute top-3 right-16 w-3 h-3 rounded-full bg-white/30 pointer-events-none" />
                <div className="absolute top-8 right-28 w-1.5 h-1.5 rounded-full bg-white/20 pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-[#2B1B1A] border border-white/30 backdrop-blur-sm">
                        UNIT 1 OF 6 • ACTIVE
                      </span>
                      {/* Progress dots */}
                      <div className="flex gap-1 items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full border border-white/40 transition-all ${i < completedCount ? 'bg-white' : 'bg-white/20'}`} />
                        ))}
                      </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#2B1B1A] tracking-tight leading-tight drop-shadow-sm">
                      AI Foundations
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-[#2B1B1A]/80 mt-1.5 max-w-md">
                      Demystify neural networks, machine learning, and pattern recognition.
                    </p>
                    <p className="text-[11px] font-black text-[#2B1B1A]/60 mt-1">
                      {completedCount} / 5 lessons complete
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowGuidebook(true);
                    }}
                    className="px-5 py-3 rounded-2xl bg-[#F6EFE4] hover:bg-[#F6EFE4] text-[#2B1B1A] font-black text-xs uppercase tracking-wider border-b-4 border-[#E8DCCB] active:translate-y-1 active:border-b-0 transition-all flex items-center gap-2 shadow-xl shrink-0 border border-white/10"
                  >
                    <BookOpen className="w-4 h-4 text-[#5C1F2A] stroke-[2.5]" />
                    <span>GUIDEBOOK</span>
                  </button>
                </div>
              </div>

              {/* Unit 1 Lesson Path with Curved Connecting Roadmap */}
              <div
                ref={roadmapContainerRef}
                className="relative py-6 flex flex-col items-center w-full max-w-lg mx-auto rounded-3xl bg-gradient-to-b from-[#FFFDF9]/60 to-transparent"
              >
                {/* Ambient glow blobs behind the path */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#5C1F2A]/4 blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-28 h-28 rounded-full bg-[#5C1F2A]/4 blur-3xl pointer-events-none" />
                {/* Connecting Curved Roadmap SVG Track */}
                <ConnectingRoadmap
                  containerRef={roadmapContainerRef}
                  itemRefs={checkpointRefs}
                  completedCount={completedCount}
                />

                <div className="space-y-12 sm:space-y-14 w-full flex flex-col items-center relative z-10">
                  {unit1Lessons.map((lesson, idx) => {
                    const checkpointIdx = idx <= 1 ? idx : idx + 1;
                    return (
                      <React.Fragment key={lesson.id}>
                        <div
                          ref={(el) => void (checkpointRefs.current[checkpointIdx] = el)}
                          className={`transition-transform duration-300 ${offsets[idx % offsets.length]}`}
                        >
                          <LessonNode
                            id={lesson.id}
                            order={lesson.order}
                            title={lesson.title}
                            status={getLessonStatus(lesson.id)}
                            xpReward={lesson.xpReward}
                            estimatedMinutes={lesson.estimatedMinutes}
                            onSelect={onSelectLesson}
                            showMascotHint={completedCount === idx}
                          />
                        </div>

                        {/* Mid-Way Chest */}
                        {idx === 1 && (
                          <div
                            ref={(el) => void (checkpointRefs.current[2] = el)}
                            className="my-2"
                          >
                            <MilestoneChest
                              isUnlocked={completedCount >= 2}
                              isClaimed={claimedChests.includes('chest-1')}
                              gemReward={50}
                              xpReward={25}
                              onClaim={() => handleClaimChest('chest-1')}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* Final Boss Trophy Chest */}
                  <div
                    ref={(el) => void (checkpointRefs.current[6] = el)}
                    className="mt-4"
                  >
                    <MilestoneChest
                      isUnlocked={completedCount === 5}
                      isClaimed={claimedChests.includes('chest-trophy-unit-1')}
                      gemReward={150}
                      xpReward={100}
                      onClaim={() => handleClaimChest('chest-trophy-unit-1')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 5 PLACEHOLDER UNITS ================= */}
            {placeholderUnits.map((unit) => {
              const isExpanded = expandedUnitId === unit.pathId;

              return (
                <div key={unit.unitNumber} className="relative pt-6 border-t-2 border-[#E8DCCB]">
                  {/* Unit Header Card */}
                  <div
                    className={`rounded-3xl bg-gradient-to-r ${unit.colorTheme.banner} p-5 sm:p-6 border-b-[6px] ${unit.colorTheme.border} shadow-2xl text-[#2B1B1A] relative overflow-hidden`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black/20 border-2 border-white/30 flex items-center justify-center shrink-0 shadow-md">
                          {unit.icon}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${unit.colorTheme.badge}`}>
                              UNIT {unit.unitNumber} OF 6
                            </span>
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-black/30 text-[#2B1B1A]/90 border border-white/20 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          </div>
                          <h2 className="text-2xl font-black tracking-tight">{unit.title}</h2>
                          <p className="text-xs text-[#2B1B1A]/90 mt-1 max-w-md font-medium">
                            {unit.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Expand / View Roadmap Toggle Button */}
                      <button
                        onClick={() => {
                          sound.playClick();
                          setExpandedUnitId(isExpanded ? null : unit.pathId);
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-black/30 hover:bg-black/50 border-2 border-white/30 text-[#2B1B1A] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
                      >
                        <span>{isExpanded ? 'Hide Path' : 'Preview Path'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-[#2B1B1A]/80">
                      <span>{unit.lessons.length} Upcoming Lessons</span>
                      <span className="text-[11px] italic opacity-90">
                        Prerequisite: {unit.requiredPreviousUnit}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Preview Pathway */}
                  {isExpanded && (
                    <div className="mt-8 py-6 px-4 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] flex flex-col items-center animate-fade-in relative">
                      <div className="mb-6 text-center max-w-md">
                        <span className="text-[10px] uppercase font-black text-[#857670] tracking-wider block mb-1">
                          CURRICULUM PREVIEW
                        </span>
                        <h4 className="text-base font-black text-[#2B1B1A]">
                          Lessons in Unit {unit.unitNumber}
                        </h4>
                        <p className="text-xs text-[#857670] mt-0.5">
                          Click any node to preview its topic and learning objectives.
                        </p>
                      </div>

                      <div className="space-y-8 w-full flex flex-col items-center">
                        {unit.lessons.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            onClick={() => handleLockedNodeClick(unit.title, lesson.title)}
                            className={`flex items-center gap-4 p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DCCB] hover:border-[#E8DCCB] cursor-pointer transition-all duration-200 group w-full max-w-md shadow-md ${
                              offsets[idx % offsets.length]
                            }`}
                          >
                            {/* Locked Circle Node */}
                            <div className="w-12 h-12 rounded-2xl bg-[#F6EFE4] border-2 border-[#E8DCCB] flex items-center justify-center text-[#857670] group-hover:text-[#8A5A00] group-hover:border-[#F2B93B]/50 transition-colors shrink-0 shadow-md">
                              <Lock className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-black text-[#857670]">
                                  Lesson {lesson.order}
                                </span>
                                <span className="text-[10px] font-bold text-[#8A5A00] font-mono">
                                  +{lesson.xpReward} XP
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-[#2B1B1A] truncate group-hover:text-[#7A2B37] transition-colors">
                                {lesson.title}
                              </h5>
                              <span className="text-[11px] text-[#857670] block mt-0.5">
                                ~{lesson.estimatedMinutes} mins • Locked
                              </span>
                            </div>

                            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-xl bg-[#F6EFE4] text-[#857670] border border-[#F1E6D6] group-hover:border-[#F2B93B]/40 group-hover:text-[#8A5A00] transition-colors shrink-0">
                              Locked
                            </span>
                          </div>
                        ))}

                        {/* Unit Final Trophy Placeholder */}
                        <div className="p-4 rounded-2xl bg-[#F6EFE4] border-2 border-dashed border-[#E8DCCB] text-center w-full max-w-md flex items-center justify-center gap-3 text-[#857670]">
                          <Award className="w-5 h-5 text-[#8A5A00]" />
                          <span className="text-xs font-black uppercase tracking-wider text-[#4D3B38]">
                            Unit {unit.unitNumber} Mastery Badge (+100 XP)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Desktop Gamification Sidebar */}
          <div className="hidden lg:block sticky top-6">
            <RightGamificationSidebar
              streakDays={streakDays}
              totalXP={totalXP}
              completedLessonsCount={completedCount}
              onNavigateProgress={onNavigateProgress}
              onNavigateFriends={onNavigateFriends}
            />
          </div>
        </div>
      )}

      {/* Guidebook Modal */}
      <UnitGuidebookModal
        isOpen={showGuidebook}
        onClose={() => setShowGuidebook(false)}
      />
    </div>
  );
};
