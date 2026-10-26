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
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  // Visor eye & mouth styling based on mood
  const renderFace = () => {
    switch (mood) {
      case 'celebrate':
      case 'happy':
        return (
          <>
            {/* Happy star / sparkle eyes */}
            <path d="M 36 43 Q 42 36 48 43" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 64 43 Q 70 36 76 43" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Big joyful open smile */}
            <path d="M 43 56 Q 56 70 69 56" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" fill="#38BDF8/20" />
            {/* Blush cheeks */}
            <circle cx="34" cy="53" r="4" fill="#F43F5E" opacity="0.6" />
            <circle cx="78" cy="53" r="4" fill="#F43F5E" opacity="0.6" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Thinking curious eyes */}
            <circle cx="43" cy="42" r="5" fill="#C084FC" />
            <circle cx="71" cy="40" r="6" fill="#C084FC" />
            {/* Curious tilted mouth */}
            <path d="M 46 59 Q 58 55 66 61" stroke="#C084FC" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Little question thought bubble dot */}
            <circle cx="82" cy="24" r="3" fill="#C084FC" opacity="0.8" />
            <circle cx="88" cy="18" r="4.5" fill="#C084FC" opacity="0.9" />
          </>
        );
      case 'encourage':
        return (
          <>
            {/* Wink right eye, friendly open left eye */}
            <circle cx="42" cy="42" r="5.5" fill="#34D399" />
            <path d="M 65 44 Q 72 37 79 44" stroke="#34D399" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Warm encouraging smile */}
            <path d="M 44 57 Q 56 68 68 57" stroke="#34D399" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'oops':
        return (
          <>
            {/* Gentle sympathetic eyes */}
            <circle cx="43" cy="44" r="5" fill="#FBBF24" />
            <circle cx="69" cy="44" r="5" fill="#FBBF24" />
            {/* Gentle wavy mouth */}
            <path d="M 46 60 Q 56 55 66 60" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'idle':
      default:
        return (
          <>
            {/* Standard friendly glowing cyan eyes */}
            <circle cx="43" cy="42" r="5.5" fill="#38BDF8" className="animate-pulse-subtle" />
            <circle cx="69" cy="42" r="5.5" fill="#38BDF8" className="animate-pulse-subtle" />
            {/* Friendly smooth smile */}
            <path d="M 45 56 Q 56 67 67 56" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
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

      {/* Animated Floating Mascot Avatar */}
      <div
        className={`${sizeMap[size]} animate-float transition-transform duration-300 hover:scale-105 cursor-pointer`}
        title="Aivo, your AI learning companion"
      >
        <svg
          viewBox="0 0 112 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
        >
          {/* Subtle Outer Energy Glow */}
          <circle cx="56" cy="56" r="48" fill="url(#aivo-glow-grad)" opacity="0.3" />

          {/* Left Wing / Jet Thruster */}
          <path
            d="M 22 54 C 14 50, 10 66, 20 72 C 24 66, 25 58, 22 54 Z"
            fill="#1E293B"
            stroke="#06B6D4"
            strokeWidth="2"
          />
          {/* Left Wing Thruster Glow */}
          <ellipse cx="16" cy="65" rx="3" ry="5" fill="#38BDF8" opacity="0.8" />

          {/* Right Wing / Jet Thruster */}
          <path
            d="M 90 54 C 98 50, 102 66, 92 72 C 88 66, 87 58, 90 54 Z"
            fill="#1E293B"
            stroke="#06B6D4"
            strokeWidth="2"
          />
          {/* Right Wing Thruster Glow */}
          <ellipse cx="96" cy="65" rx="3" ry="5" fill="#38BDF8" opacity="0.8" />

          {/* Antenna Stem */}
          <line x1="56" y1="14" x2="56" y2="28" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
          {/* Antenna Orb with pulsing spark */}
          <circle cx="56" cy="14" r="7" fill="#8B5CF6" />
          <circle cx="56" cy="14" r="4" fill="#C084FC" />
          <circle cx="56" cy="14" r="10" stroke="#C084FC" strokeWidth="1.5" opacity="0.4" className="animate-ping" />

          {/* Main Body Shell (Chassis) */}
          <rect
            x="20"
            y="26"
            width="72"
            height="62"
            rx="31"
            fill="url(#body-gradient)"
            stroke="#06B6D4"
            strokeWidth="3.5"
          />

          {/* Sleek Dark Digital Visor Screen */}
          <rect
            x="27"
            y="33"
            width="58"
            height="46"
            rx="23"
            fill="#090E17"
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* Visor Glare Reflection */}
          <path
            d="M 33 42 Q 56 36 77 42"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.15"
          />

          {/* Dynamic Mood Visor Eyes & Mouth */}
          {renderFace()}

          {/* Chest Core Indicator Light */}
          <circle cx="56" cy="85" r="3.5" fill="#06B6D4" className="animate-pulse" />
          <circle cx="48" cy="85" r="2" fill="#8B5CF6" opacity="0.6" />
          <circle cx="64" cy="85" r="2" fill="#8B5CF6" opacity="0.6" />

          {/* Gradients */}
          <defs>
            <linearGradient id="body-gradient" x1="20" y1="26" x2="92" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E293B" />
              <stop offset="0.6" stopColor="#0F172A" />
              <stop offset="1" stopColor="#131F33" />
            </linearGradient>
            <radialGradient id="aivo-glow-grad" cx="56" cy="56" r="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#0B0F19" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
