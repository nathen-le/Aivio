import React from 'react';
import { Flame, Zap, Users, Target, Check, ChevronRight, UserPlus, Star, Shield } from 'lucide-react';
import { sound } from '../utils/sound';

interface RightGamificationSidebarProps {
  streakDays: number;
  totalXP: number;
  completedLessonsCount: number;
  onNavigateProgress: () => void;
  onNavigateFriends?: () => void;
}

export const RightGamificationSidebar: React.FC<RightGamificationSidebarProps> = ({
  streakDays,
  totalXP,
  completedLessonsCount,
  onNavigateProgress,
  onNavigateFriends,
}) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7;

  // Friends' XP is private progress and is not shared across accounts.
  const allPeers = [
    {
      id: 'current-user',
      name: 'You',
      xp: totalXP,
      isUser: true,
      avatar: '🐱',
      streak: streakDays,
      isOnline: true,
    },
  ];

  // Quest config
  const quests = [
    {
      label: 'Earn 50 XP',
      current: Math.min(50, totalXP),
      target: 50,
      color: 'from-[#3D1119] to-[#5C1F2A]',
      textColor: 'text-[#5C1F2A]',
      glow: 'rgba(92,31,42,0.5)',
    },
    {
      label: 'Complete 1 Lesson',
      current: Math.min(1, completedLessonsCount),
      target: 1,
      color: 'from-[#8DAA5B] to-[#8DAA5B]',
      textColor: 'text-[#4F6B2A]',
      glow: 'rgba(52,211,153,0.45)',
    },
    {
      label: 'Score 100% on a Quiz',
      current: completedLessonsCount > 0 ? 1 : 0,
      target: 1,
      color: 'from-[#F2B93B] to-[#F2B93B]',
      textColor: 'text-[#8A5A00]',
      glow: 'rgba(251,191,36,0.45)',
    },
  ];

  return (
    <aside className="w-[300px] shrink-0 space-y-4 select-none">

      {/* ── Top Stats Row ── */}
      <div className="flex items-stretch gap-2">
        {/* Streak Flame */}
        <div
          className="flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DCCB]/80 text-[#B5581B] relative overflow-hidden"
          title={`${streakDays} Day Streak`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#E9873A]/5 to-transparent pointer-events-none" />
          <Flame className="w-6 h-6 fill-[#E9873A] animate-fire-flicker relative z-10" />
          <span className="font-black text-lg leading-none relative z-10">{streakDays}</span>
          <span className="text-[9px] font-bold text-[#B5581B]/70 uppercase tracking-wider relative z-10">Streak</span>
        </div>

        {/* Gems */}
        <div
          className="flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DCCB]/80 text-[#5C1F2A] relative overflow-hidden"
          title="Data Crystals"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#5C1F2A]/5 to-transparent pointer-events-none" />
          <span className="text-xl relative z-10">💎</span>
          <span className="font-black text-base leading-none font-mono relative z-10">{Math.floor(totalXP * 1.5) + 100}</span>
          <span className="text-[9px] font-bold text-[#7A2B37]/70 uppercase tracking-wider relative z-10">Gems</span>
        </div>

        {/* Total XP */}
        <div
          className="flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DCCB]/80 text-[#8A5A00] relative overflow-hidden"
          title="Total XP"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#F2B93B]/5 to-transparent pointer-events-none" />
          <Zap className="w-6 h-6 fill-[#F2B93B] relative z-10" />
          <span className="font-black text-lg leading-none font-mono relative z-10">{totalXP}</span>
          <span className="text-[9px] font-bold text-[#8A5A00]/70 uppercase tracking-wider relative z-10">XP</span>
        </div>
      </div>

      {/* ── Streak Calendar Card ── */}
      <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB]/80 shadow-lg overflow-hidden relative">
        {/* Glow accent */}
        {streakDays > 0 && (
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#E9873A]/10 blur-2xl pointer-events-none" />
        )}

        <div className="flex items-center justify-between mb-3 relative">
          <h4 className="font-black text-sm text-[#2B1B1A] flex items-center gap-2">
            <Flame className="w-4 h-4 fill-[#E9873A] text-[#B5581B] animate-fire-flicker" />
            Daily Streak
          </h4>
          <div className="flex items-center gap-1.5">
            {streakDays >= 3 && (
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FBE9A6]/70 border border-[#E9873A]/30 text-[9px] font-black text-[#B5581B]">
                <Shield className="w-2.5 h-2.5" /> Streak Shield
              </div>
            )}
            <span className="text-xs font-black text-[#B5581B] font-mono">
              {streakDays}d
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day, idx) => {
            const isCompleted = idx <= todayDayIndex;
            const isToday = idx === todayDayIndex;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-[#857670]">{day}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    isCompleted
                      ? isToday
                        ? 'bg-[#E9873A] border-[#E9873A] text-[#2B1B1A] animate-streak-glow scale-110'
                        : 'bg-[#E9873A]/80 border-[#E9873A]/50 text-[#2B1B1A] shadow-sm'
                      : 'bg-[#FFFDF9] border-[#F1E6D6]/60 text-[#B3A59C]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-[#857670] mt-3 text-center font-medium italic">
          Practice every day to keep your streak alive 🔥
        </p>
      </div>

      {/* ── Daily Quests ── */}
      <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB]/80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-black text-sm text-[#2B1B1A] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#5C1F2A]" />
            Daily Quests
          </h4>
          <button
            onClick={() => { sound.playClick(); onNavigateProgress(); }}
            className="text-[10px] font-bold text-[#5C1F2A] hover:text-[#7A2B37] flex items-center gap-0.5 transition-colors"
          >
            VIEW ALL <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-4">
          {quests.map((quest, i) => {
            const pct = Math.min(100, (quest.current / quest.target) * 100);
            const done = pct >= 100;
            return (
              <div key={i}>
                <div className="flex justify-between items-center text-xs font-bold text-[#2B1B1A] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    {done && <Star className="w-3 h-3 fill-[#F2B93B] text-[#8A5A00]" />}
                    <span className={done ? 'line-through text-[#857670]' : ''}>{quest.label}</span>
                  </span>
                  <span className={`${quest.textColor} font-mono text-[11px]`}>
                    {quest.current} / {quest.target}
                  </span>
                </div>
                <div className="relative w-full bg-[#FFFDF9] h-3 rounded-full overflow-hidden border border-[#E8DCCB]">
                  <div
                    className={`bg-gradient-to-r ${quest.color} h-full rounded-full transition-all duration-700`}
                    style={{
                      width: `${pct}%`,
                      boxShadow: done ? `0 0 10px ${quest.glow}` : undefined,
                    }}
                  />
                  {/* Shimmer overlay when complete */}
                  {done && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All done celebration */}
        {quests.every(q => q.current >= q.target) && (
          <div className="mt-4 p-2.5 rounded-2xl bg-[#FBE9A6] border border-[#F2B93B]/30 text-center animate-fade-in">
            <p className="text-xs font-black text-[#8A5A00]">🎉 All quests done! Come back tomorrow!</p>
          </div>
        )}
      </div>

      {/* ── Friends Leaderboard ── */}
      <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-[#E8DCCB]/80 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F6EFE4] border border-[#5C1F2A]/30 flex items-center justify-center text-[#5C1F2A]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-[#2B1B1A] leading-tight">Friends</h4>
              <span className="text-[9px] text-[#7A2B37] font-bold uppercase tracking-wide">Weekly Board</span>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onNavigateFriends?.(); }}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-xl bg-[#F6EFE4] hover:bg-[#F1E6D6] border border-[#5C1F2A]/25 text-[#5C1F2A] transition-all"
          >
            <UserPlus className="w-3 h-3" /> Add
          </button>
        </div>

        <div className="space-y-1.5">
          {allPeers.slice(0, 5).map((peer, idx) => {
            const rank = idx + 1;
            const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
            return (
              <div
                key={peer.id}
                className={`px-3 py-2.5 rounded-2xl flex items-center justify-between text-xs font-bold border transition-all ${
                  peer.isUser
                    ? 'bg-[#5C1F2A]/10 border-[#5C1F2A]/35 text-[#FFF8EE] shadow-[0_0_12px_rgba(92,31,42,0.1)]'
                    : 'bg-[#FFFDF9]/60 border-transparent text-[#4D3B38] hover:border-[#F1E6D6]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 text-center font-mono font-black shrink-0 text-xs">
                    {medalEmoji || <span className="text-[#B3A59C]">{rank}</span>}
                  </span>
                  <div className="relative shrink-0">
                    <span className="text-base">{peer.avatar}</span>
                    {peer.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#8DAA5B] border border-[#FFFDF9]" />
                    )}
                  </div>
                  <span className={`truncate text-[11px] ${peer.isUser ? 'text-[#5C1F2A] font-black' : ''}`}>
                    {peer.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#B5581B] flex items-center">
                    <Flame className="w-2.5 h-2.5 fill-[#E9873A]" />{peer.streak}
                  </span>
                  <span className="font-mono text-[11px] font-black text-[#8A5A00] tabular-nums">
                    {peer.xp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => { sound.playClick(); onNavigateFriends?.(); }}
          className="w-full mt-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#857670] hover:text-[#2B1B1A] bg-[#FFFDF9] hover:bg-[#F6EFE4] rounded-xl border border-[#E8DCCB]/60 transition-all flex items-center justify-center gap-1"
        >
          View All Activity <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
