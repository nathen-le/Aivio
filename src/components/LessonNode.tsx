import React, { useState } from 'react';
import {
  Check,
  Lock,
  Play,
  Zap,
  Clock,
  RotateCcw,
  BookOpen,
  Star,
} from 'lucide-react';
import { sound } from '../utils/sound';
import type { LessonNodeStatus } from '../types/lesson';

interface LessonNodeProps {
  id: string;
  order: number;
  title: string;
  status: LessonNodeStatus;
  xpReward: number;
  estimatedMinutes: number;
  onSelect: (id: string) => void;
  showMascotHint?: boolean;
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  id,
  order,
  title,
  status,
  xpReward,
  estimatedMinutes,
  onSelect,
  showMascotHint,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleClick = () => {
    if (status === 'locked') {
      sound.playIncorrect();
      setShaking(true);
      setShowTooltip(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    sound.playClick();
    onSelect(id);
  };

  const getNodeStyles = () => {
    switch (status) {
      case 'completed':
        return {
          btn: 'bg-[#5C1F2A] border-b-[6px] border-[#3D1119] text-[#FFF8EE] shadow-[0_8px_20px_rgba(92,31,42,0.4)] active:translate-y-1 active:border-b-0',
          halo: 'ring-4 ring-[#5C1F2A]/30',
          icon: <Check className="w-9 h-9 stroke-[3.5]" />,
          badgeText: 'Mastered',
          badgeColor: 'text-[#7A2B37] bg-[#FBE3E0]/80 border-[#5C1F2A]/40',
        };
      case 'available':
      case 'in-progress':
        return {
          btn: 'bg-[#5C1F2A] border-b-[6px] border-[#3D1119] text-[#FFF8EE] shadow-[0_10px_25px_rgba(92,31,42,0.6)] hover:brightness-110 active:translate-y-1 active:border-b-0 animate-bounce-subtle',
          halo: 'ring-8 ring-[#5C1F2A]/40',
          icon: <Play className="w-9 h-9 fill-[#FFF8EE] stroke-[2] ml-1" />,
          badgeText: 'START',
          badgeColor: 'text-[#5C1F2A] bg-[#F6EFE4] border-[#5C1F2A]',
        };
      case 'locked':
      default:
        return {
          btn: 'bg-[#F1E6D6] border-b-[6px] border-[#F6EFE4] text-[#857670] cursor-not-allowed',
          halo: 'ring-0',
          icon: <Lock className="w-8 h-8 stroke-[2.5]" />,
          badgeText: 'Locked',
          badgeColor: 'text-[#857670] bg-[#FFFDF9] border-[#E8DCCB]',
        };
    }
  };

  const styles = getNodeStyles();

  return (
    <div
      className="relative flex flex-col items-center select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Floating Mascot Callout if this is the active node */}
      {showMascotHint && status === 'available' && (
        <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#5C1F2A] text-[#FFF8EE] text-xs font-black uppercase tracking-wider shadow-xl shadow-[#5C1F2A]/40 whitespace-nowrap animate-bounce-subtle">
          <span className="drop-shadow-sm">START HERE!</span>
          <span className="w-2 h-2 rounded-full bg-[#FFFDF9]/40 animate-ping" />
          {/* Arrow pointing left, toward the node */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-[#5C1F2A] rotate-45" />
        </div>
      )}

      {/* Chunky 3D Stepping Stone Button */}
      <button
        onClick={handleClick}
        className={`relative z-10 w-22 h-22 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-150 outline-none ${styles.btn} ${styles.halo} ${
          shaking ? 'animate-shake' : ''
        }`}
        aria-label={`${title} (${styles.badgeText})`}
      >
        {styles.icon}

        {/* Stars indicator for completed node */}
        {status === 'completed' && (
          <div className="absolute -bottom-2 flex items-center gap-0.5 bg-[#FFFDF9] px-2 py-0.5 rounded-full border border-[#F2B93B]/60 shadow">
            <Star className="w-3 h-3 fill-[#F2B93B] text-[#8A5A00]" />
            <Star className="w-3 h-3 fill-[#F2B93B] text-[#8A5A00]" />
            <Star className="w-3 h-3 fill-[#F2B93B] text-[#8A5A00]" />
          </div>
        )}
      </button>

      {/* Lesson Title Banner below node */}
      <div className="mt-3.5 max-w-[210px] text-center rounded-2xl bg-[#FFFDF9]/95 border border-[#E8DCCB] px-3 py-1.5 shadow-sm">
        <h4 className="text-xs sm:text-sm font-extrabold text-[#2B1B1A] line-clamp-2 leading-tight">
          {title}
        </h4>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-[11px] font-mono text-[#8A5A00] flex items-center gap-0.5 font-black">
            <Zap className="w-3 h-3 fill-[#F2B93B]" /> +{xpReward} XP
          </span>
          <span className="text-[11px] text-[#857670] flex items-center gap-0.5 font-bold">
            <Clock className="w-3 h-3" /> {estimatedMinutes}m
          </span>
        </div>
      </div>

      {/* Tooltip Dialog — shows to the right to avoid overlapping START HERE above */}
      {showTooltip && !(showMascotHint && status === 'available') && (
        <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-30 w-56 p-3.5 rounded-2xl bg-[#FFFDF9] border-2 border-[#5C1F2A] shadow-2xl backdrop-blur-md text-left animate-fade-in pointer-events-none">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7A2B37]">
              Lesson {order}
            </span>
            <span
              className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border ${styles.badgeColor}`}
            >
              {styles.badgeText}
            </span>
          </div>
          <p className="text-xs font-black text-[#2B1B1A] mb-2 leading-tight">{title}</p>
          <div className="flex items-center justify-between text-[11px] text-[#4D3B38] border-t border-[#E8DCCB] pt-2">
            <span className="flex items-center gap-1 text-[#8A5A00] font-bold font-mono">
              <Zap className="w-3.5 h-3.5 fill-[#F2B93B]" /> +{xpReward} XP
            </span>
            {status === 'completed' ? (
              <span className="text-[#7A2B37] font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Review
              </span>
            ) : status === 'locked' ? (
              <span className="text-[#857670] italic text-[10px]">Complete lesson {order - 1} first</span>
            ) : (
              <span className="text-[#5C1F2A] font-black flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Click to play
              </span>
            )}
          </div>
          {/* Arrow pointing left */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full -mr-[1px] w-2.5 h-2.5 bg-[#FFFDF9] border-l-2 border-b-2 border-[#5C1F2A] rotate-45" />
        </div>
      )}
    </div>
  );
};
