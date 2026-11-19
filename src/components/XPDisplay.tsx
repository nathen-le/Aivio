import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

interface XPDisplayProps {
  xp: number;
  bonus?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({
  xp,
  bonus,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3.5 py-1.5 gap-1.5',
    lg: 'text-lg px-5 py-2.5 gap-2 font-black',
  }[size];

  return (
    <div
      className={`inline-flex items-center font-black rounded-2xl bg-[#F6EFE4] border-2 border-[#F2B93B] text-[#8A5A00] shadow-md ${sizeStyles} ${className}`}
    >
      <Zap className="w-4 h-4 text-[#8A5A00] fill-[#F2B93B]" />
      <span className="font-mono tracking-tight">{xp} XP</span>
      {bonus && bonus > 0 && (
        <span className="flex items-center text-[#4F6B2A] text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 mr-0.5" /> +{bonus}
        </span>
      )}
    </div>
  );
};
