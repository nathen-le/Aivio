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
          btn: 'bg-[#1cb0f6] border-b-[6px] border-[#1899d6] text-white shadow-[0_8px_20px_rgba(28,176,246,0.4)] active:translate-y-1 active:border-b-0',
          halo: 'ring-4 ring-[#1cb0f6]/30',
          icon: <Check className="w-9 h-9 stroke-[3.5]" />,
          badgeText: 'Mastered',
          badgeColor: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/40',
        };
      case 'available':
      case 'in-progress':
        return {
          btn: 'bg-[#1cb0f6] border-b-[6px] border-[#1899d6] text-slate-950 shadow-[0_10px_25px_rgba(28,176,246,0.6)] hover:brightness-110 active:translate-y-1 active:border-b-0 animate-bounce-subtle',
          halo: 'ring-8 ring-[#1cb0f6]/40',
          icon: <Play className="w-9 h-9 fill-slate-950 stroke-[2] ml-1" />,
          badgeText: 'START',
          badgeColor: 'text-[#1cb0f6] bg-[#0c1e3d] border-[#1cb0f6]',
        };
      case 'locked':
      default:
        return {
          btn: 'bg-[#1c2c4c] border-b-[6px] border-[#121c32] text-slate-500 cursor-not-allowed',
          halo: 'ring-0',
          icon: <Lock className="w-8 h-8 stroke-[2.5]" />,
          badgeText: 'Locked',
          badgeColor: 'text-slate-400 bg-slate-900 border-slate-700',
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
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0f1d38] border-2 border-[#1cb0f6] text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-cyan-950/50 whitespace-nowrap animate-float">
          <span>START HERE!</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#0f1d38] border-r-2 border-b-2 border-[#1cb0f6] rotate-45" />
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
          <div className="absolute -bottom-2 flex items-center gap-0.5 bg-slate-950 px-2 py-0.5 rounded-full border border-amber-400/60 shadow">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
        )}
      </button>

      {/* Lesson Title Banner below node */}
      <div className="mt-3.5 max-w-[210px] text-center">
        <h4 className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 leading-tight">
          {title}
        </h4>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-[11px] font-mono text-amber-300 flex items-center gap-0.5 font-black">
            <Zap className="w-3 h-3 fill-amber-400" /> +{xpReward} XP
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-0.5 font-bold">
            <Clock className="w-3 h-3" /> {estimatedMinutes}m
          </span>
        </div>
      </div>

      {/* Tooltip Dialog */}
      {showTooltip && (
        <div className="absolute bottom-full mb-3 z-30 w-64 p-3.5 rounded-2xl bg-[#0f1d38] border-2 border-[#1cb0f6] shadow-2xl backdrop-blur-md text-left animate-fade-in pointer-events-none">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
              Lesson {order}
            </span>
            <span
              className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border ${styles.badgeColor}`}
            >
              {styles.badgeText}
            </span>
          </div>
          <p className="text-xs font-black text-white mb-2 leading-tight">{title}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-[#1c325c] pt-2">
            <span className="flex items-center gap-1 text-amber-300 font-bold font-mono">
              <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{xpReward} XP
            </span>
            {status === 'completed' ? (
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Practice review
              </span>
            ) : status === 'locked' ? (
              <span className="text-slate-400 italic">Complete Lesson {order - 1} first</span>
            ) : (
              <span className="text-[#1cb0f6] font-black flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Click to play
              </span>
            )}
          </div>
          <div className="absolute top-full -mt-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#0f1d38] border-r-2 border-b-2 border-[#1cb0f6] rotate-45" />
        </div>
      )}
    </div>
  );
};
