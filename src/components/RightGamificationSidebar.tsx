import React from 'react';
import { Flame, Zap, Users, Target, Check, ChevronRight, UserPlus, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import { useFriends } from '../hooks/useFriends';

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
  const { friends } = useFriends();

  // Days of week for streak tracker: Mon to Sun
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  // Combine user and friends, then rank by XP
  const allPeers = [
    {
      id: 'current-user',
      name: 'You (Alex)',
      xp: totalXP,
      isUser: true,
      avatar: '🐱',
      streak: streakDays,
      isOnline: true,
    },
    ...friends.map((f) => ({
      id: f.id,
      name: f.name.split(' ')[0] + ' ' + (f.name.split(' ')[1]?.[0] || '') + '.',
      xp: f.xp,
      isUser: false,
      avatar: f.avatar,
      streak: f.streak,
      isOnline: f.isOnline,
    })),
  ].sort((a, b) => b.xp - a.xp);

  return (
    <aside className="w-80 shrink-0 space-y-5 select-none">
      {/* Top Stats Widget Row */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-md">
        {/* Streak Flame */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/60 border border-orange-500/40 text-orange-400 font-black text-sm"
          title={`${streakDays} Day Learning Streak`}
        >
          <Flame className="w-5 h-5 fill-orange-400 animate-pulse-subtle" />
          <span>{streakDays}</span>
        </div>

        {/* Data Crystals / Gems */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-[#1cb0f6] font-black text-sm"
          title="Data Crystals"
        >
          <span className="text-base">💎</span>
          <span className="font-mono">{Math.floor(totalXP * 1.5) + 100}</span>
        </div>

        {/* Total XP */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-400/40 text-amber-300 font-black text-sm"
          title="Total XP"
        >
          <Zap className="w-5 h-5 fill-amber-400" />
          <span className="font-mono">{totalXP}</span>
        </div>
      </div>

      {/* Streak Calendar Card */}
      <div className="p-4 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            Daily Streak
          </h4>
          <span className="text-xs font-bold text-orange-400 font-mono">
            {streakDays} {streakDays === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((day, idx) => {
            const isCompleted = idx <= todayDayIndex;
            const isToday = idx === todayDayIndex;

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400">{day}</span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-transform ${
                    isCompleted
                      ? 'bg-orange-500 border-orange-400 text-slate-950 shadow-md shadow-orange-500/30'
                      : 'bg-[#142344] border-[#1e3460] text-slate-500'
                  } ${isToday ? 'scale-110 ring-2 ring-orange-400/50' : ''}`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : '•'}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 mt-3 text-center font-medium">
          Practice a lesson every day to keep your streak glowing! 🔥
        </p>
      </div>

      {/* Daily Quests Card */}
      <div className="p-5 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#1cb0f6]" />
            Daily Quests
          </h4>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateProgress();
            }}
            className="text-[11px] font-bold text-[#1cb0f6] hover:underline flex items-center"
          >
            VIEW ALL <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Quest 1 */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span>Earn 50 XP</span>
              <span className="text-[#1cb0f6] font-mono">{Math.min(50, totalXP)} / 50</span>
            </div>
            <div className="w-full bg-[#132344] h-3 rounded-full overflow-hidden border border-[#1f3764]">
              <div
                className="bg-gradient-to-r from-[#0284c7] to-[#1cb0f6] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalXP / 50) * 100)}%` }}
              />
            </div>
          </div>

          {/* Quest 2 */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span>Complete 1 Lesson</span>
              <span className="text-emerald-400 font-mono">
                {Math.min(1, completedLessonsCount)} / 1
              </span>
            </div>
            <div className="w-full bg-[#132344] h-3 rounded-full overflow-hidden border border-[#1f3764]">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completedLessonsCount >= 1 ? 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Quest 3 */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span>Score 100% on a Quiz</span>
              <span className="text-amber-400 font-mono">
                {completedLessonsCount > 0 ? '1 / 1' : '0 / 1'}
              </span>
            </div>
            <div className="w-full bg-[#132344] h-3 rounded-full overflow-hidden border border-[#1f3764]">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completedLessonsCount > 0 ? 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Friends Stats & Leaderboard Card (Replaces Cobalt League) */}
      <div className="p-5 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1b3464] border border-[#1cb0f6]/50 flex items-center justify-center text-[#1cb0f6]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white uppercase tracking-wider">
                Friends Stats
              </h4>
              <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Weekly Leaderboard
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateFriends?.();
            }}
            className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-[#1b3464] hover:bg-[#254888] border border-[#1cb0f6]/40 text-[#1cb0f6] flex items-center gap-1 transition-colors"
          >
            <UserPlus className="w-3 h-3" /> Friends
          </button>
        </div>

        <div className="space-y-1.5 mt-3">
          {allPeers.slice(0, 5).map((peer, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={peer.id}
                className={`p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold border transition-all ${
                  peer.isUser
                    ? 'bg-[#1b3464] border-[#1cb0f6] text-white shadow-md'
                    : 'bg-[#132344]/60 border-transparent text-slate-300 hover:border-[#1f3764]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-4 text-center font-mono font-black shrink-0 ${
                      rank === 1
                        ? 'text-amber-400'
                        : rank === 2
                        ? 'text-slate-300'
                        : rank === 3
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </span>
                  <div className="relative shrink-0">
                    <span className="text-base">{peer.avatar}</span>
                    {peer.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0f1d38]" />
                    )}
                  </div>
                  <span className={`truncate ${peer.isUser ? 'text-[#1cb0f6] font-black' : ''}`}>
                    {peer.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-orange-400 font-bold flex items-center">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    {peer.streak}
                  </span>
                  <span className="font-mono text-slate-300 text-[11px] font-bold bg-[#0c162c] px-2 py-0.5 rounded-lg border border-[#1c325c]">
                    {peer.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNavigateFriends?.();
          }}
          className="w-full mt-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 hover:text-white bg-[#132344] hover:bg-[#1a2e58] rounded-xl border border-[#1f3764] transition-colors flex items-center justify-center gap-1"
        >
          <span>View All Friends & Activity</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
