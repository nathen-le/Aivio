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
      color: 'from-[#0284c7] to-[#1cb0f6]',
      textColor: 'text-[#1cb0f6]',
      glow: 'rgba(28,176,246,0.5)',
    },
    {
      label: 'Complete 1 Lesson',
      current: Math.min(1, completedLessonsCount),
      target: 1,
      color: 'from-emerald-600 to-teal-400',
      textColor: 'text-emerald-400',
      glow: 'rgba(52,211,153,0.45)',
    },
    {
      label: 'Score 100% on a Quiz',
      current: completedLessonsCount > 0 ? 1 : 0,
      target: 1,
      color: 'from-amber-500 to-yellow-400',
      textColor: 'text-amber-400',
      glow: 'rgba(251,191,36,0.45)',
    },
  ];

  return (
    <aside className="w-[300px] shrink-0 space-y-4 select-none">

      {/* ── Top Stats Row ── */}
      <div className="flex items-stretch gap-2">
        {/* Streak Flame */}
        <div
          className="flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-2xl bg-[#0f1d38] border border-[#1c325c]/80 text-orange-400 relative overflow-hidden"
          title={`${streakDays} Day Streak`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
          <Flame className="w-6 h-6 fill-orange-400 animate-fire-flicker relative z-10" />
          <span className="font-black text-lg leading-none relative z-10">{streakDays}</span>
          <span className="text-[9px] font-bold text-orange-400/70 uppercase tracking-wider relative z-10">Streak</span>
        </div>

        {/* Gems */}
        <div
          className="flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-2xl bg-[#0f1d38] border border-[#1c325c]/80 text-[#1cb0f6] relative overflow-hidden"
          title="Data Crystals"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
          <span className="text-xl relative z-10">💎</span>
          <span className="font-black text-base leading-none font-mono relative z-10">{Math.floor(totalXP * 1.5) + 100}</span>
          <span className="text-[9px] font-bold text-sky-400/70 uppercase tracking-wider relative z-10">Gems</span>
        </div>

        {/* Total XP */}
        <div
          className="flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-2xl bg-[#0f1d38] border border-[#1c325c]/80 text-amber-300 relative overflow-hidden"
          title="Total XP"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
          <Zap className="w-6 h-6 fill-amber-400 relative z-10" />
          <span className="font-black text-lg leading-none font-mono relative z-10">{totalXP}</span>
          <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-wider relative z-10">XP</span>
        </div>
      </div>

      {/* ── Streak Calendar Card ── */}
      <div className="p-4 rounded-3xl bg-[#0f1d38] border border-[#1c325c]/80 shadow-lg overflow-hidden relative">
        {/* Glow accent */}
        {streakDays > 0 && (
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
        )}

        <div className="flex items-center justify-between mb-3 relative">
          <h4 className="font-black text-sm text-white flex items-center gap-2">
            <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-fire-flicker" />
            Daily Streak
          </h4>
          <div className="flex items-center gap-1.5">
            {streakDays >= 3 && (
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-950/70 border border-orange-500/30 text-[9px] font-black text-orange-300">
                <Shield className="w-2.5 h-2.5" /> Streak Shield
              </div>
            )}
            <span className="text-xs font-black text-orange-400 font-mono">
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
                <span className="text-[9px] font-bold text-slate-500">{day}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    isCompleted
                      ? isToday
                        ? 'bg-orange-500 border-orange-400 text-white animate-streak-glow scale-110'
                        : 'bg-orange-500/80 border-orange-600/50 text-white shadow-sm'
                      : 'bg-[#0c1830] border-[#1c3060]/60 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-slate-500 mt-3 text-center font-medium italic">
          Practice every day to keep your streak alive 🔥
        </p>
      </div>

      {/* ── Daily Quests ── */}
      <div className="p-4 rounded-3xl bg-[#0f1d38] border border-[#1c325c]/80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-black text-sm text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-[#1cb0f6]" />
            Daily Quests
          </h4>
          <button
            onClick={() => { sound.playClick(); onNavigateProgress(); }}
            className="text-[10px] font-bold text-[#1cb0f6] hover:text-sky-300 flex items-center gap-0.5 transition-colors"
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
                <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    {done && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                    <span className={done ? 'line-through text-slate-500' : ''}>{quest.label}</span>
                  </span>
                  <span className={`${quest.textColor} font-mono text-[11px]`}>
                    {quest.current} / {quest.target}
                  </span>
                </div>
                <div className="relative w-full bg-[#0a1628] h-3 rounded-full overflow-hidden border border-[#142240]">
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
          <div className="mt-4 p-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center animate-fade-in">
            <p className="text-xs font-black text-amber-300">🎉 All quests done! Come back tomorrow!</p>
          </div>
        )}
      </div>

      {/* ── Friends Leaderboard ── */}
      <div className="p-4 rounded-3xl bg-[#0f1d38] border border-[#1c325c]/80 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#142344] border border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white leading-tight">Friends</h4>
              <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wide">Weekly Board</span>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onNavigateFriends?.(); }}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-xl bg-[#142344] hover:bg-[#1b3464] border border-[#1cb0f6]/25 text-[#1cb0f6] transition-all"
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
                    ? 'bg-[#1cb0f6]/10 border-[#1cb0f6]/35 text-white shadow-[0_0_12px_rgba(28,176,246,0.1)]'
                    : 'bg-[#0c1830]/60 border-transparent text-slate-300 hover:border-[#1c3060]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 text-center font-mono font-black shrink-0 text-xs">
                    {medalEmoji || <span className="text-slate-600">{rank}</span>}
                  </span>
                  <div className="relative shrink-0">
                    <span className="text-base">{peer.avatar}</span>
                    {peer.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0f1d38]" />
                    )}
                  </div>
                  <span className={`truncate text-[11px] ${peer.isUser ? 'text-[#1cb0f6] font-black' : ''}`}>
                    {peer.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-orange-400 flex items-center">
                    <Flame className="w-2.5 h-2.5 fill-orange-400" />{peer.streak}
                  </span>
                  <span className="font-mono text-[11px] font-black text-amber-300 tabular-nums">
                    {peer.xp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => { sound.playClick(); onNavigateFriends?.(); }}
          className="w-full mt-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-white bg-[#0c1830] hover:bg-[#142344] rounded-xl border border-[#1c325c]/60 transition-all flex items-center justify-center gap-1"
        >
          View All Activity <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
