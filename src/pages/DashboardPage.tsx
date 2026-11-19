import React, { useRef, useState } from 'react';
import { ArrowRight, BookOpen, Lock, Sparkles, Zap } from 'lucide-react';
import { ALL_LESSONS } from '../data/lessons';
import { LessonNode } from '../components/LessonNode';
import { MilestoneChest } from '../components/MilestoneChest';
import { UnitGuidebookModal } from '../components/UnitGuidebookModal';
import { ConnectingRoadmap } from '../components/ConnectingRoadmap';
import { TopBar, type TopTab } from '../components/TopBar';
import { useFriends } from '../hooks/useFriends';
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
  onNavigateTop: (tab: TopTab) => void;
  activeTab?: string;
}

const UNIT_ONE_ID = 'ai-fundamentals';

// Zig-zag offsets so the lesson bubbles wind down the pathway.
const OFFSETS = [
  'translate-x-0',
  'sm:-translate-x-14 translate-x-0',
  'sm:translate-x-14 translate-x-0',
  'sm:-translate-x-14 translate-x-0',
  'translate-x-0',
  'sm:translate-x-14 translate-x-0',
  'translate-x-0',
];

const UPCOMING_UNITS = [
  { number: '02', title: 'AI Tools & Prompt Crafting', blurb: 'Prompting, context and study assistants.' },
  { number: '03', title: 'AI Ethics & Digital Citizenship', blurb: 'Bias, deepfakes and responsible use.' },
  { number: '04', title: 'How AI Learns', blurb: 'Neural networks, weights and gradient descent.' },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  totalXP,
  streakDays,
  completedLessonIds,
  getLessonStatus,
  onSelectLesson,
  onNavigateFriends,
  onNavigateTop,
}) => {
  const [showGuidebook, setShowGuidebook] = useState(false);
  const [claimedChests, setClaimedChests] = useState<string[]>([]);
  const roadmapContainerRef = useRef<HTMLDivElement | null>(null);
  const checkpointRefs = useRef<(HTMLElement | null)[]>([]);
  const { friends } = useFriends();

  const unitLessons = ALL_LESSONS.filter((l) => l.learningPathId === UNIT_ONE_ID);
  const completedCount = unitLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const unitPct = unitLessons.length ? Math.round((completedCount / unitLessons.length) * 100) : 0;

  const nextLesson =
    unitLessons.find((l) => {
      const s = getLessonStatus(l.id);
      return s === 'available' || s === 'in-progress';
    }) ?? unitLessons[0];

  const handleClaimChest = (chestId: string) => setClaimedChests((prev) => [...prev, chestId]);

  return (
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-6 pb-28 lg:pb-12 animate-fade-in select-none">
      <TopBar active="pathway" onSelect={onNavigateTop} streakDays={streakDays} totalXP={totalXP} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-8">
        {/* Main column */}
        <section>
          <p className="text-xs font-black uppercase tracking-widest text-[#857670] mb-2">Your AI pathway</p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#2B1B1A] tracking-tight leading-[1.05]" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
            Small steps. Big AI energy.
          </h1>
          <p className="text-base text-[#4D3B38] mt-3 max-w-xl">
            Build your understanding one lesson at a time. Pick up where you left off.
          </p>

          {/* Current unit card */}
          <div className="mt-8 rounded-3xl bg-[#5C1F2A] text-[#FFF8EE] p-6 sm:p-7 shadow-lg shadow-[#5C1F2A]/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <span className="w-14 h-14 rounded-2xl bg-[#FBE9A6] text-[#5C1F2A] flex items-center justify-center text-xl font-black shrink-0">
                  01
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#F1E6D6]/80">Current unit</p>
                  <h2 className="text-xl sm:text-2xl font-black mt-0.5" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
                    Getting to know AI
                  </h2>
                  <p className="text-sm text-[#F1E6D6]/90 mt-1">
                    {completedCount} of {unitLessons.length} lessons complete
                  </p>
                </div>
              </div>
              <span className="text-3xl font-black" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
                {unitPct}%
              </span>
            </div>

            <div className="mt-5 h-3 w-full rounded-full bg-[#3D1119] overflow-hidden">
              <div className="h-full rounded-full bg-[#F2B93B] transition-all duration-700" style={{ width: `${unitPct}%` }} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectLesson(nextLesson.id);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FFF8EE] text-[#5C1F2A] font-black text-sm hover:bg-[#FBE9A6] transition-colors"
              >
                {completedCount === 0 ? 'Start lesson' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowGuidebook(true);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#FFF8EE]/40 text-[#FFF8EE] font-black text-sm hover:bg-[#3D1119] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Guidebook
              </button>
            </div>
          </div>

          {/* Pathway */}
          <h3 className="text-lg font-black text-[#2B1B1A] mt-10 mb-2" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
            Your lesson path
          </h3>
          <div ref={roadmapContainerRef} className="relative py-6 flex flex-col items-center w-full max-w-lg mx-auto">
            <ConnectingRoadmap containerRef={roadmapContainerRef} itemRefs={checkpointRefs} completedCount={completedCount} />

            <div className="space-y-12 sm:space-y-14 w-full flex flex-col items-center relative z-10">
              {unitLessons.map((lesson, idx) => {
                const checkpointIdx = idx <= 1 ? idx : idx + 1;
                return (
                  <React.Fragment key={lesson.id}>
                    <div
                      ref={(el) => void (checkpointRefs.current[checkpointIdx] = el)}
                      className={`transition-transform duration-300 ${OFFSETS[idx % OFFSETS.length]}`}
                    >
                      <LessonNode
                        id={lesson.id}
                        order={lesson.order}
                        title={lesson.title}
                        status={getLessonStatus(lesson.id)}
                        xpReward={lesson.xpReward}
                        estimatedMinutes={lesson.estimatedMinutes}
                        icon={lesson.icon}
                        onSelect={onSelectLesson}
                        showMascotHint={completedCount === idx}
                      />
                    </div>

                    {idx === 1 && (
                      <div ref={(el) => void (checkpointRefs.current[2] = el)} className="my-2">
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

              <div ref={(el) => void (checkpointRefs.current[6] = el)} className="mt-4">
                <MilestoneChest
                  isUnlocked={unitLessons.length > 0 && completedCount === unitLessons.length}
                  isClaimed={claimedChests.includes('chest-trophy-unit-1')}
                  gemReward={150}
                  xpReward={100}
                  onClaim={() => handleClaimChest('chest-trophy-unit-1')}
                />
              </div>
            </div>
          </div>

          {/* Upcoming units */}
          <h3 className="text-lg font-black text-[#2B1B1A] mt-10 mb-3" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
            Find your next rabbit hole
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {UPCOMING_UNITS.map((u) => (
              <div key={u.number} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8DCCB]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#7A2B37]">Unit {u.number}</span>
                  <Lock className="w-3.5 h-3.5 text-[#857670]" />
                </div>
                <p className="text-sm font-black text-[#2B1B1A] leading-snug">{u.title}</p>
                <p className="text-xs text-[#4D3B38] mt-1">{u.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right rail */}
        <aside className="space-y-5">
          <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB]">
            <div className="flex items-center gap-3">
              <img src="/mascot-penguin-smile.png" alt="" className="w-16 h-16 object-contain" />
              <div>
                <p className="text-sm font-black text-[#2B1B1A]">Your brain called.</p>
                <p className="text-xs text-[#4D3B38]">It wants one more lesson today.</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FBE9A6] border border-[#F2B93B]/50">
            <p className="text-xs font-black uppercase tracking-wider text-[#8A5A00] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Today&apos;s big win
            </p>
            <p className="text-sm font-black text-[#2B1B1A] mt-2">{nextLesson.title}</p>
            <p className="text-xs text-[#4D3B38] mt-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-[#F2B93B] text-[#F2B93B]" /> +{nextLesson.xpReward} XP · {nextLesson.estimatedMinutes} min
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB]">
            <p className="text-sm font-black text-[#2B1B1A]">Better with your people</p>
            {friends.length === 0 ? (
              <p className="text-xs text-[#4D3B38] mt-2">Add a friend to learn side by side.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {friends.slice(0, 4).map((f, i) => (
                  <li key={f.profile?.uid ?? i} className="flex items-center gap-3">
                    <img
                      src={f.profile?.avatarUrl || '/mascot-penguin-happy.png'}
                      alt=""
                      className="w-8 h-8 rounded-full object-contain bg-[#F6EFE4] border border-[#E8DCCB]"
                    />
                    <span className="text-sm font-bold text-[#2B1B1A] truncate">{f.profile?.displayName || 'Friend'}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => {
                sound.playClick();
                onNavigateFriends?.();
              }}
              className="mt-4 w-full py-2.5 rounded-2xl bg-[#5C1F2A] text-[#FFF8EE] font-black text-sm hover:bg-[#3D1119] transition-colors"
            >
              Get friends&apos; progress
            </button>
          </div>
        </aside>
      </div>

      <UnitGuidebookModal isOpen={showGuidebook} onClose={() => setShowGuidebook(false)} />
    </div>
  );
};
