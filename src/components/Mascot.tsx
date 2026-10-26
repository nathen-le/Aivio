import React from 'react';

export type MascotMood = 'idle' | 'happy' | 'celebrate' | 'thinking' | 'encourage' | 'oops';

interface MascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  speechPosition?: 'top' | 'right' | 'left' | 'bottom';
  className?: string;
  onClick?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 'md',
  speechBubble,
  speechPosition = 'top',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-52 h-52',
  };

  const getMascotImage = () => {
    switch (mood) {
      case 'celebrate':
      case 'happy':
        return '/mascot-cat-celebrate.png';
      case 'thinking':
        return '/mascot-cat-thinking.png';
      case 'encourage':
        return '/mascot-cat-winking.png';
      case 'oops':
        return '/mascot-cat-thinking.png';
      case 'idle':
      default:
        return '/mascot-cat-idle.png';
    }
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onClick={onClick}
    >
      {/* Speech bubble */}
      {speechBubble && (
        <div
          className={`absolute z-20 max-w-xs px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-cyan-500/40 text-slate-100 text-xs sm:text-sm font-medium shadow-xl shadow-cyan-950/40 backdrop-blur-md animate-fade-in ${
            speechPosition === 'top'
              ? 'bottom-full mb-3'
              : speechPosition === 'bottom'
              ? 'top-full mt-3'
              : speechPosition === 'left'
              ? 'right-full mr-3 top-1/2 -translate-y-1/2'
              : 'left-full ml-3 top-1/2 -translate-y-1/2'
          }`}
        >
          {speechBubble}
          <div
            className={`absolute w-2.5 h-2.5 bg-slate-900 border-r border-b border-cyan-500/40 rotate-45 ${
              speechPosition === 'top'
                ? 'top-full -mt-1.5 left-1/2 -translate-x-1/2'
                : speechPosition === 'bottom'
                ? 'bottom-full -mb-1.5 left-1/2 -translate-x-1/2'
                : speechPosition === 'left'
                ? 'left-full -ml-1.5 top-1/2 -translate-y-1/2'
                : 'right-full -mr-1.5 top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}

      {/* Blue Cat Mascot Image */}
      <div
        className={`${sizeMap[size]} animate-float transition-transform duration-300 hover:scale-105 cursor-pointer relative group`}
        title="Aivo, your AI learning companion"
      >
        <img
          src={getMascotImage()}
          alt={`Aivo (${mood})`}
          className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(28,176,246,0.35)]"
        />
      </div>
    </div>
  );
};
