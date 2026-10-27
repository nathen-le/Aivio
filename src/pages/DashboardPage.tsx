import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
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
import { useFriends } from '../hooks/useFriends';
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

  const { friends } = useFriends();

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
      icon: <Wrench className="w-6 h-6 text-purple-300" />,
      colorTheme: {
        banner: 'from-[#6d28d9] via-[#8b5cf6] to-[#4f46e5]',
        border: 'border-[#5b21b6]',
        badge: 'bg-purple-950/80 text-purple-200 border-purple-500/40',
        accent: '#8b5cf6',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-tools-productivity')?.lessons || [],
      requiredPreviousUnit: 'Unit 1: AI Foundations',
    },
    {
      unitNumber: 3,
      pathId: 'ai-ethics-citizenship',
      title: 'AI Ethics & Digital Citizenship',
      tagline: 'Algorithmic bias, deepfakes, copyright, and ethical teenage citizenship.',
      icon: <ShieldAlert className="w-6 h-6 text-emerald-300" />,
      colorTheme: {
        banner: 'from-[#047857] via-[#10b981] to-[#0f766e]',
        border: 'border-[#065f46]',
        badge: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40',
        accent: '#10b981',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-ethics-citizenship')?.lessons || [],
      requiredPreviousUnit: 'Unit 2: AI Tools',
    },
    {
      unitNumber: 4,
      pathId: 'how-ai-learns',
      title: 'How AI Learns (Neural Networks)',
      tagline: 'Weights, biases, loss functions, backprop, and gradient descent.',
      icon: <Network className="w-6 h-6 text-amber-300" />,
      colorTheme: {
        banner: 'from-[#b45309] via-[#f59e0b] to-[#c2410c]',
        border: 'border-[#92400e]',
        badge: 'bg-amber-950/80 text-amber-200 border-amber-500/40',
        accent: '#f59e0b',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'how-ai-learns')?.lessons || [],
      requiredPreviousUnit: 'Unit 3: AI Ethics',
    },
    {
      unitNumber: 5,
      pathId: 'ai-creator-lab',
      title: 'AI Creator Lab & Multimodal',
      tagline: 'Diffusion image synthesis, voice cloning, and creative digital media.',
      icon: <Palette className="w-6 h-6 text-rose-300" />,
      colorTheme: {
        banner: 'from-[#be123c] via-[#f43f5e] to-[#db2777]',
        border: 'border-[#9f1239]',
        badge: 'bg-rose-950/80 text-rose-200 border-rose-500/40',
        accent: '#f43f5e',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-creator-lab')?.lessons || [],
      requiredPreviousUnit: 'Unit 4: Neural Networks',
    },
    {
      unitNumber: 6,
      pathId: 'ai-in-real-world',
      title: 'AI in the Real World & Careers',
      tagline: 'Autonomous vehicles, healthcare, climate tech, and future careers.',
      icon: <Globe className="w-6 h-6 text-sky-300" />,
      colorTheme: {
        banner: 'from-[#1d4ed8] via-[#3b82f6] to-[#0284c7]',
        border: 'border-[#1e40af]',
        badge: 'bg-blue-950/80 text-blue-200 border-blue-500/40',
        accent: '#3b82f6',
      },
      lessons: LEARNING_PATHS.find((p) => p.id === 'ai-in-real-world')?.lessons || [],
      requiredPreviousUnit: 'Unit 5: Creator Lab',
    },
  ];

  // Leaderboard peers
  const allPeers = [
    { name: 'Alex (You)', xp: totalXP, isUser: true, avatar: '🐱', streak: streakDays },
    ...friends.map((f) => ({ name: f.name, xp: f.xp, isUser: false, avatar: f.avatar, streak: f.streak })),
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5 pb-24 lg:pb-12 animate-fade-in select-none">
      {/* Toast Notification */}
      {lockedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-amber-500/30 animate-fade-in flex items-center gap-2 max-w-md text-center">
          {lockedToast}
        </div>
      )}

      {/* Top Mobile Quick Stats Bar */}
      <div className="lg:hidden flex items-center justify-between p-3 rounded-2xl bg-[#0f1d38] border-2 border-[#1c325c] mb-6 shadow-md">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-950/60 border border-orange-500/40 text-orange-400 font-black text-xs">
          <Flame className="w-4 h-4 fill-orange-400" />
          <span>{streakDays}d streak</span>
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

      {/* When activeTab is 'leaderboard', show the full community leaderboard */}
      {activeTab === 'leaderboard' ? (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0284c7] via-[#1cb0f6] to-[#0284c7] border-b-[6px] border-[#0369a1] text-slate-950 mb-8 shadow-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/20 text-slate-950">
                  Global Cohort Rankings
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">Leagues & Friends</h1>
              <p className="text-xs sm:text-sm font-bold text-sky-950 mt-1">
                Compete with classmates and friends. Top learners earn bonus XP badges each week!
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#0f1d38] border-2 border-white flex items-center justify-center text-3xl shadow-lg shrink-0">
              🏆
            </div>
          </div>

          <div className="rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] p-6 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                This Week's Leaderboard
              </span>
              <span className="text-xs font-bold text-slate-400">Resets in 3 days</span>
            </h3>

            <div className="space-y-2">
              {allPeers.map((peer, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                      peer.isUser
                        ? 'bg-[#1b3464] border-[#1cb0f6] text-white shadow-lg shadow-cyan-950/50'
                        : 'bg-[#132344] border-[#1f3764] text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-6 text-center font-mono font-black text-sm ${
                          rank === 1
                            ? 'text-amber-400 text-lg'
                            : rank === 2
                            ? 'text-slate-300 text-base'
                            : rank === 3
                            ? 'text-amber-600 text-base'
                            : 'text-slate-500'
                        }`}
                      >
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                      </span>
                      <div className="text-2xl">{peer.avatar}</div>
                      <div>
                        <div className="text-sm font-black flex items-center gap-2">
                          <span className={peer.isUser ? 'text-[#1cb0f6]' : 'text-white'}>
                            {peer.name}
                          </span>
                          {peer.isUser && (
                            <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-[#1cb0f6] text-slate-950">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-orange-400 font-bold flex items-center gap-1 mt-0.5">
                          <Flame className="w-3 h-3 fill-orange-400" />
                          {peer.streak} day streak
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-black text-amber-300 block">
                        {peer.xp} XP
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        {rank <= 3 ? 'Promotion Zone' : 'Active'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <div className="rounded-3xl bg-gradient-to-r from-[#0284c7] via-[#1cb0f6] to-[#0284c7] p-5 sm:p-6 border-b-[6px] border-[#0369a1] shadow-[0_12px_30px_rgba(28,176,246,0.3)] mb-6 sm:mb-8 text-slate-950 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 pointer-events-none">
                  <Sparkles className="w-full h-full text-white" />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-950 border border-slate-950/20">
                        UNIT 1 OF 6 • ACTIVE
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {completedCount} / 5 Done
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                      AI Foundations
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-sky-950 mt-1 max-w-md">
                      Demystify neural networks, machine learning algorithms, and pattern recognition.
                    </p>
                  </div>

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

              {/* Unit 1 Lesson Path with Curved Connecting Roadmap */}
              <div
                ref={roadmapContainerRef}
                className="relative py-4 flex flex-col items-center w-full max-w-lg mx-auto"
              >
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
                    ref={(el) => (checkpointRefs.current[6] = el)}
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
                <div key={unit.unitNumber} className="relative pt-6 border-t-2 border-[#1c325c]">
                  {/* Unit Header Card */}
                  <div
                    className={`rounded-3xl bg-gradient-to-r ${unit.colorTheme.banner} p-5 sm:p-6 border-b-[6px] ${unit.colorTheme.border} shadow-2xl text-white relative overflow-hidden`}
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
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-black/30 text-white/90 border border-white/20 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          </div>
                          <h2 className="text-2xl font-black tracking-tight">{unit.title}</h2>
                          <p className="text-xs text-white/90 mt-1 max-w-md font-medium">
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
                        className="px-4 py-2.5 rounded-2xl bg-black/30 hover:bg-black/50 border-2 border-white/30 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
                      >
                        <span>{isExpanded ? 'Hide Path' : 'Preview Path'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/80">
                      <span>{unit.lessons.length} Upcoming Lessons</span>
                      <span className="text-[11px] italic opacity-90">
                        Prerequisite: {unit.requiredPreviousUnit}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Preview Pathway */}
                  {isExpanded && (
                    <div className="mt-8 py-6 px-4 rounded-3xl bg-[#0c162c] border-2 border-[#1c325c] flex flex-col items-center animate-fade-in relative">
                      <div className="mb-6 text-center max-w-md">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1">
                          CURRICULUM PREVIEW
                        </span>
                        <h4 className="text-base font-black text-white">
                          Lessons in Unit {unit.unitNumber}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Click any node to preview its topic and learning objectives.
                        </p>
                      </div>

                      <div className="space-y-8 w-full flex flex-col items-center">
                        {unit.lessons.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            onClick={() => handleLockedNodeClick(unit.title, lesson.title)}
                            className={`flex items-center gap-4 p-4 rounded-2xl bg-[#0f1d38] border-2 border-[#1c325c] hover:border-slate-500 cursor-pointer transition-all duration-200 group w-full max-w-md shadow-md ${
                              offsets[idx % offsets.length]
                            }`}
                          >
                            {/* Locked Circle Node */}
                            <div className="w-12 h-12 rounded-2xl bg-[#142344] border-2 border-[#254684] flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/50 transition-colors shrink-0 shadow-md">
                              <Lock className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-black text-slate-500">
                                  Lesson {lesson.order}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 font-mono">
                                  +{lesson.xpReward} XP
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                                {lesson.title}
                              </h5>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                ~{lesson.estimatedMinutes} mins • Locked
                              </span>
                            </div>

                            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-xl bg-[#132344] text-slate-400 border border-[#1f3764] group-hover:border-amber-500/40 group-hover:text-amber-300 transition-colors shrink-0">
                              Locked
                            </span>
                          </div>
                        ))}

                        {/* Unit Final Trophy Placeholder */}
                        <div className="p-4 rounded-2xl bg-[#132344] border-2 border-dashed border-[#24427c] text-center w-full max-w-md flex items-center justify-center gap-3 text-slate-400">
                          <Award className="w-5 h-5 text-amber-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
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
