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
      badge: 'bg-[#F6EFE4] text-[#2B1B1A] border-[#E8DCCB]',
      glow: 'border-[#E8DCCB] hover:border-[#5C1F2A]',
      iconBox: 'bg-[#F6EFE4] text-[#5C1F2A] border-[#E8DCCB]',
    },
    Rare: {
      badge: 'bg-[#FBE3E0] text-[#5C1F2A] border-[#5C1F2A]/60',
      glow: 'border-[#7A2B37]/80 hover:border-[#5C1F2A] shadow-[#5C1F2A]/40',
      iconBox: 'bg-[#F6EFE4] text-[#5C1F2A] border-[#5C1F2A]/50',
    },
    Epic: {
      badge: 'bg-[#FBE3E0] text-[#2B1B1A] border-[#E8DCCB]/60',
      glow: 'border-[#E8DCCB]/80 hover:border-[#E8DCCB] shadow-[#5C1F2A]/40',
      iconBox: 'bg-[#FBE3E0] text-[#2B1B1A] border-[#E8DCCB]/50',
    },
    Legendary: {
      badge: 'bg-[#FBE9A6] text-[#8A5A00] border-[#F2B93B]/60',
      glow: 'border-[#8A5A00]/80 hover:border-[#F2B93B] shadow-[#F2B93B]/40',
      iconBox: 'bg-[#FBE9A6] text-[#8A5A00] border-[#F2B93B]/50',
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
          ? `bg-[#FFFDF9] ${rarityColor.glow} shadow-lg hover:-translate-y-1 active:translate-y-0 active:border-b-2 cursor-pointer`
          : 'bg-[#F6EFE4] border-[#E8DCCB] opacity-60 hover:opacity-80'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Icon box */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-transform duration-150 ${
            isUnlocked
              ? `${rarityColor.iconBox} group-hover:scale-105 shadow-inner`
              : 'bg-[#F6EFE4] text-[#857670] border-[#F1E6D6]'
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
            <span className="flex items-center gap-1 text-[11px] font-black text-[#4F6B2A]">
              <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h4
        className={`font-black text-base mb-1 ${
          isUnlocked ? 'text-[#2B1B1A]' : 'text-[#857670]'
        }`}
      >
        {badge.title}
      </h4>
      <p className="text-xs text-[#4D3B38] leading-relaxed mb-4 line-clamp-2 font-medium">
        {badge.description}
      </p>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E8DCCB] text-xs">
        <span className="text-[#8A5A00] font-black font-mono flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-[#F2B93B]" /> +{badge.xpBonus} XP
        </span>
        <span className="text-[11px] text-[#857670] font-bold italic">
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
