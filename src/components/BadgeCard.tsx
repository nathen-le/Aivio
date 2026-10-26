import React from 'react';
import {
  Zap,
  GitFork,
  Cpu,
  Network,
  ShieldCheck,
  Award,
  Flame,
  Sparkles,
  TrendingUp,
  Compass,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/sound';
import type { Badge } from '../types/lesson';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  unlockedAt?: string;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isUnlocked,
  unlockedAt,
  onClick,
}) => {
  const getIcon = () => {
    const props = { className: 'w-6 h-6 stroke-[2.5]' };
    switch (badge.iconName) {
      case 'Zap':
        return <Zap {...props} />;
      case 'GitFork':
        return <GitFork {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Network':
        return <Network {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      case 'Compass':
      default:
        return <Compass {...props} />;
    }
  };

  const rarityColor = {
    Common: {
      badge: 'bg-[#142344] text-slate-200 border-[#1c325c]',
      glow: 'border-[#1c325c] hover:border-[#1cb0f6]',
      iconBox: 'bg-[#132344] text-[#1cb0f6] border-[#1c325c]',
    },
    Rare: {
      badge: 'bg-cyan-950 text-[#1cb0f6] border-cyan-700/60',
      glow: 'border-cyan-800/80 hover:border-[#1cb0f6] shadow-cyan-950/40',
      iconBox: 'bg-[#0f2448] text-[#1cb0f6] border-cyan-600/50',
    },
    Epic: {
      badge: 'bg-purple-950 text-purple-300 border-purple-700/60',
      glow: 'border-purple-800/80 hover:border-purple-500 shadow-purple-950/40',
      iconBox: 'bg-purple-950 text-purple-400 border-purple-700/50',
    },
    Legendary: {
      badge: 'bg-amber-950 text-amber-300 border-amber-700/60',
      glow: 'border-amber-800/80 hover:border-amber-500 shadow-amber-950/40',
      iconBox: 'bg-amber-950 text-amber-400 border-amber-700/50',
    },
  }[badge.rarity];

  return (
    <div
      onClick={() => {
        sound.playClick();
        onClick?.();
      }}
      className={`relative group rounded-3xl p-5 transition-all duration-150 border-2 border-b-[5px] select-none ${
        isUnlocked
          ? `bg-[#0f1d38] ${rarityColor.glow} shadow-lg hover:-translate-y-1 active:translate-y-0 active:border-b-2 cursor-pointer`
          : 'bg-[#0b1426] border-[#162544] opacity-60 hover:opacity-80'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Icon box */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-transform duration-150 ${
            isUnlocked
              ? `${rarityColor.iconBox} group-hover:scale-105 shadow-inner`
              : 'bg-[#132344] text-slate-500 border-[#1f3764]'
          }`}
        >
          {isUnlocked ? getIcon() : <Lock className="w-5 h-5 stroke-[2.5]" />}
        </div>

        {/* Rarity & Status badge */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border ${rarityColor.badge}`}
          >
            {badge.rarity}
          </span>
          {isUnlocked && (
            <span className="flex items-center gap-1 text-[11px] font-black text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h4
        className={`font-black text-base mb-1 ${
          isUnlocked ? 'text-white' : 'text-slate-400'
        }`}
      >
        {badge.title}
      </h4>
      <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2 font-medium">
        {badge.description}
      </p>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#1c325c] text-xs">
        <span className="text-amber-400 font-black font-mono flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{badge.xpBonus} XP
        </span>
        <span className="text-[11px] text-slate-400 font-bold italic">
          {isUnlocked
            ? unlockedAt
              ? new Date(unlockedAt).toLocaleDateString()
              : 'Earned'
            : badge.requirement}
        </span>
      </div>
    </div>
  );
};
