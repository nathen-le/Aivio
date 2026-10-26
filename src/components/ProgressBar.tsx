import React from 'react';

interface ProgressBarProps {
  progressPercent: number;
  height?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'emerald' | 'amber';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  height = 'md',
  color = 'cyan',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progressPercent)));

  const heightClass = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-4 sm:h-5',
  }[height];

  const colorStyles = {
    cyan: 'bg-[#1cb0f6]',
    purple: 'bg-[#a855f7]',
    emerald: 'bg-[#58cc02]',
    amber: 'bg-[#ffc800]',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-black text-slate-300 mb-1.5">
          <span>PROGRESS</span>
          <span className="font-mono text-[#1cb0f6]">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-[#132344] rounded-full overflow-hidden p-0.5 border-2 border-[#1c325c] ${heightClass} relative`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden ${colorStyles}`}
          style={{ width: `${clamped}%` }}
        >
          {/* Top glossy glare reflection (signature tactile shine) */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
