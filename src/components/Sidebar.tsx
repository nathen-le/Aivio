import React from 'react';
import {
  Compass,
  Trophy,
  Users,
  User,
  Volume2,
  VolumeX,
  Zap,
  Flame,
} from 'lucide-react';
import { sound } from '../utils/sound';
import type { AppView } from '../App';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  totalXP: number;
}

const XP_PER_LEVEL = 100;

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  activeTab = 'learn',
  onSelectTab,
  totalXP,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playClick();
  };

  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpInLevel = totalXP % XP_PER_LEVEL;
  const xpPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100);

  const navItems = [
    {
      id: 'learn',
      label: 'LEARN',
      icon: <Compass className="w-5 h-5 stroke-[2.5]" />,
      action: () => {
        sound.playClick();
        onNavigate('dashboard');
        onSelectTab?.('learn');
      },
      isActive: currentView === 'dashboard' && activeTab === 'learn',
    },
    {
      id: 'leaderboard',
      label: 'LEAGUES',
      icon: <Trophy className="w-5 h-5 stroke-[2.5]" />,
      action: () => {
        sound.playClick();
        onNavigate('dashboard');
        onSelectTab?.('leaderboard');
      },
      isActive: currentView === 'dashboard' && activeTab === 'leaderboard',
    },
    {
      id: 'friends',
      label: 'FRIENDS',
      icon: <Users className="w-5 h-5 stroke-[2.5]" />,
      action: () => {
        sound.playClick();
        onNavigate('friends');
        onSelectTab?.('friends');
      },
      isActive: currentView === 'friends',
    },
    {
      id: 'profile',
      label: 'PROFILE',
      icon: <User className="w-5 h-5 stroke-[2.5]" />,
      action: () => {
        sound.playClick();
        onNavigate('profile');
        onSelectTab?.('profile');
      },
      isActive: currentView === 'profile',
    },
  ];

  return (
    <>
      {/* ── Desktop Left Persistent Sidebar ── */}
      <aside className="hidden lg:flex flex-col justify-between w-60 border-r border-[#1c325c]/70 bg-[#080f20] h-screen sticky top-0 p-4 shrink-0 z-40 select-none overflow-hidden">

        {/* Subtle radial glow top-left decoration */}
        <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-[#1cb0f6]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-16 w-40 h-40 rounded-full bg-purple-600/4 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Brand Header */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-3 px-2 py-3 w-full text-left group transition-transform active:scale-95 mb-1"
          >
            {/* Logo container with animated ring */}
            <div className="relative w-12 h-12 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-[#1cb0f6]/20 blur-md group-hover:bg-[#1cb0f6]/35 transition-all" />
              <div className="relative w-full h-full rounded-2xl border-2 border-[#1cb0f6]/60 bg-[#0c1e3e] flex items-center justify-center p-1.5 shadow-[0_4px_16px_rgba(28,176,246,0.25)] group-hover:border-[#1cb0f6] transition-colors">
                <img
                  src="/mascot-cat-avatar.png"
                  alt="Aivio Mascot"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform drop-shadow"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white uppercase">Aivio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1cb0f6] animate-pulse" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500/80 block -mt-0.5">
                AI Learning Platform
              </span>
            </div>
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#1c325c] to-transparent mb-5 mx-1" />

          {/* Navigation items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-black text-xs tracking-wider transition-all duration-150 relative overflow-hidden ${
                  item.isActive
                    ? 'bg-[#1cb0f6]/12 border border-[#1cb0f6]/35 text-[#1cb0f6] shadow-[0_2px_12px_rgba(28,176,246,0.12)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1e38]'
                }`}
              >
                {/* Active left accent bar */}
                {item.isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#1cb0f6]" />
                )}
                <div className={`transition-transform ${item.isActive ? 'text-[#1cb0f6] scale-110' : 'text-slate-500'}`}>
                  {item.icon}
                </div>
                <span className={item.isActive ? 'text-[#1cb0f6]' : ''}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom: Level + XP bar + Sound */}
        <div className="relative z-10 space-y-3">
          {/* Level XP progress card */}
          <div className="p-3.5 rounded-2xl bg-[#0c1830] border border-[#1c325c]/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* Level badge */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#1cb0f6] flex items-center justify-center shadow-[0_3px_10px_rgba(28,176,246,0.4)] border-b-2 border-[#0f6da6]">
                  <span className="text-[11px] font-black text-white leading-none">{level}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-white uppercase tracking-wide block">Level {level}</span>
                  <span className="text-[9px] text-slate-500 font-bold">{xpInLevel}/{XP_PER_LEVEL} XP</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-300">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-xs font-black font-mono text-shimmer">{totalXP}</span>
              </div>
            </div>

            {/* XP bar */}
            <div className="w-full bg-[#0a1628] h-2.5 rounded-full overflow-hidden border border-[#142240]">
              <div
                className="bg-gradient-to-r from-[#0284c7] via-[#1cb0f6] to-[#38d4ff] h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(28,176,246,0.5)]"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] mt-1 text-slate-600 font-bold">
              <span>Lv {level}</span>
              <span>{100 - xpPct}% to Lv {level + 1}</span>
            </div>
          </div>

          {/* Sound toggle row */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400/80 animate-fire-flicker" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Sound</span>
            </div>
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-[#0f1a30] border-[#1c2e50] text-slate-600 hover:border-[#1c325c] hover:text-slate-400'
                  : 'bg-[#0f1d38] border-[#1c325c] text-sky-400 hover:bg-[#1b3464] hover:border-[#1cb0f6]/40'
              }`}
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070f1e]/95 backdrop-blur-md border-t border-[#1c325c]/60 px-2 py-2 flex items-center justify-around select-none shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all relative ${
              item.isActive
                ? 'text-[#1cb0f6]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {item.isActive && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#1cb0f6]" />
            )}
            <div className={`transition-transform ${item.isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-black uppercase mt-0.5 tracking-wider ${item.isActive ? 'text-[#1cb0f6]' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
};
