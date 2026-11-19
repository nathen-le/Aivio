import React, { useState } from 'react';
import { Check, Lock, RotateCcw, BookOpen, Zap, Clock } from 'lucide-react';
import { sound } from '../utils/sound';
import type { LessonIconKey, LessonNodeStatus } from '../types/lesson';

interface LessonNodeProps {
  id: string;
  order: number;
  title: string;
  status: LessonNodeStatus;
  xpReward: number;
  estimatedMinutes: number;
  icon?: LessonIconKey;
  onSelect: (id: string) => void;
  showMascotHint?: boolean;
}

const STATUS_LABEL: Record<LessonNodeStatus, string> = {
  completed: 'Mastered',
  available: 'Start',
  'in-progress': 'Continue',
  locked: 'Locked',
};

export const LessonNode: React.FC<LessonNodeProps> = ({
  id,
  order,
  title,
  status,
  xpReward,
  estimatedMinutes,
  icon,
  onSelect,
  showMascotHint,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [shaking, setShaking] = useState(false);
  const locked = status === 'locked';
  const current = status === 'available' || status === 'in-progress';

  const handleClick = () => {
    if (locked) {
      sound.playIncorrect();
      setShaking(true);
      setShowTooltip(true);
      window.setTimeout(() => setShaking(false), 500);
      return;
    }
    sound.playClick();
    onSelect(id);
  };

  const iconSrc = icon ? `/icons/${icon}-${locked ? 'gray' : 'color'}.png` : null;

  return (
    <div
      className="relative flex flex-col items-center select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Callout beside the active node */}
      {showMascotHint && current && (
        <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#5C1F2A] text-[#FFF8EE] text-xs font-black uppercase tracking-wider shadow-xl whitespace-nowrap">
          START HERE
          <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-[#5C1F2A] rotate-45" />
        </div>
      )}

      <button
        onClick={handleClick}
        className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-150 outline-none hover:scale-105 active:scale-95 ${
          current ? 'ring-4 ring-[#5C1F2A]/25 ring-offset-4 ring-offset-[#FBF6EE]' : ''
        } ${shaking ? 'animate-shake' : ''} ${locked ? 'cursor-not-allowed' : ''}`}
        aria-label={`${title} (${STATUS_LABEL[status]})`}
      >
        {iconSrc ? (
          <img src={iconSrc} alt="" className="w-full h-full object-contain drop-shadow-md" />
        ) : (
          <span className={`w-full h-full rounded-full flex items-center justify-center ${locked ? 'bg-[#F1E6D6] text-[#857670]' : 'bg-[#5C1F2A] text-[#FFF8EE]'}`}>
            {locked ? <Lock className="w-8 h-8" /> : <BookOpen className="w-9 h-9" />}
          </span>
        )}

        {status === 'completed' && (
          <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#8DAA5B] text-[#FFF8EE] border-2 border-[#FFFDF9] flex items-center justify-center shadow">
            <Check className="w-4 h-4 stroke-[3.5]" />
          </span>
        )}
        {locked && (
          <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#FFFDF9] text-[#857670] border-2 border-[#E8DCCB] flex items-center justify-center shadow">
            <Lock className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Title card, so the road never runs through the label */}
      <div className="mt-3 max-w-[220px] text-center rounded-2xl bg-[#FFFDF9]/95 border border-[#E8DCCB] px-3 py-2 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-wider text-[#7A2B37]">Lesson {order}</p>
        <h4 className="text-sm font-extrabold text-[#2B1B1A] line-clamp-2 leading-tight">{title}</h4>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-[11px] font-black text-[#8A5A00] flex items-center gap-0.5">
            <Zap className="w-3 h-3 fill-[#F2B93B]" /> +{xpReward} XP
          </span>
          <span className="text-[11px] text-[#857670] flex items-center gap-0.5 font-bold">
            <Clock className="w-3 h-3" /> {estimatedMinutes}m
          </span>
        </div>
      </div>

      {showTooltip && !(showMascotHint && current) && (
        <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-30 w-56 p-3.5 rounded-2xl bg-[#FFFDF9] border-2 border-[#5C1F2A] shadow-2xl text-left animate-fade-in pointer-events-none">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7A2B37]">Lesson {order}</span>
            <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border border-[#E8DCCB] text-[#4D3B38]">
              {STATUS_LABEL[status]}
            </span>
          </div>
          <p className="text-xs font-black text-[#2B1B1A] mb-2 leading-tight">{title}</p>
          <div className="flex items-center justify-between text-[11px] text-[#4D3B38] border-t border-[#E8DCCB] pt-2">
            <span className="flex items-center gap-1 text-[#8A5A00] font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#F2B93B]" /> +{xpReward} XP
            </span>
            {status === 'completed' ? (
              <span className="text-[#7A2B37] font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Review
              </span>
            ) : locked ? (
              <span className="text-[#857670] italic text-[10px]">Finish lesson {order - 1} first</span>
            ) : (
              <span className="text-[#5C1F2A] font-black flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Click to play
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
