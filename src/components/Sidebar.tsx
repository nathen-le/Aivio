import React from 'react';
import {
  Compass,
  Globe,
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
import { useFriends } from '../hooks/useFriends';

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

  const { incoming } = useFriends();
  const requestBadge = (id: string) => (id === 'friends' ? incoming.length : 0);

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
      id: 'local',
      label: 'LOCAL',
      icon: <Globe className="w-5 h-5 stroke-[2.5]" />,
      action: () => {
        sound.playClick();
        onNavigate('local');
        onSelectTab?.('local');
      },
      isActive: currentView === 'local',
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
      <aside className="hidden lg:flex flex-col justify-between w-60 border-r border-[#E8DCCB]/70 bg-[#FFFDF9] h-screen sticky top-0 p-4 shrink-0 z-40 select-none overflow-hidden">

        {/* Subtle radial glow top-left decoration */}
        <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-[#5C1F2A]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-16 w-40 h-40 rounded-full bg-[#5C1F2A]/4 blur-3xl pointer-events-none" />

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
              <div className="absolute inset-0 rounded-2xl bg-[#5C1F2A]/20 blur-md group-hover:bg-[#5C1F2A]/35 transition-all" />
              <div className="relative w-full h-full rounded-2xl border-2 border-[#5C1F2A]/60 bg-[#FFFDF9] flex items-center justify-center p-1.5 shadow-[0_4px_16px_rgba(92,31,42,0.25)] group-hover:border-[#5C1F2A] transition-colors">
                <img
                  src="/mascot-cat-avatar.png"
                  alt="Aivio Mascot"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform drop-shadow"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#2B1B1A] uppercase">Aivio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5C1F2A] animate-pulse" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#7A2B37]/80 block -mt-0.5">
                AI Learning Platform
              </span>
            </div>
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#E8DCCB] to-transparent mb-5 mx-1" />

          {/* Navigation items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-black text-xs tracking-wider transition-all duration-150 relative overflow-hidden ${
                  item.isActive
                    ? 'bg-[#5C1F2A]/12 border border-[#5C1F2A]/35 text-[#5C1F2A] shadow-[0_2px_12px_rgba(92,31,42,0.12)]'
                    : 'text-[#857670] hover:text-[#2B1B1A] hover:bg-[#FFFDF9]'
                }`}
              >
                {/* Active left accent bar */}
                {item.isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#5C1F2A]" />
                )}
                <div className={`transition-transform ${item.isActive ? 'text-[#5C1F2A] scale-110' : 'text-[#857670]'}`}>
                  {item.icon}
                </div>
                <span className={item.isActive ? 'text-[#5C1F2A]' : ''}>{item.label}</span>
                {requestBadge(item.id) > 0 && (
                  <span
                    className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-[#C2414B] text-[#2B1B1A] text-[10px] font-black flex items-center justify-center"
                    aria-label={`${requestBadge(item.id)} pending friend requests`}
                  >
                    {requestBadge(item.id)}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom: Level + XP bar + Sound */}
        <div className="relative z-10 space-y-3">
          {/* Level XP progress card */}
          <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DCCB]/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* Level badge */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3D1119] to-[#5C1F2A] flex items-center justify-center shadow-[0_3px_10px_rgba(92,31,42,0.4)] border-b-2 border-[#3D1119]">
                  <span className="text-[11px] font-black text-[#2B1B1A] leading-none">{level}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#2B1B1A] uppercase tracking-wide block">Level {level}</span>
                  <span className="text-[9px] text-[#857670] font-bold">{xpInLevel}/{XP_PER_LEVEL} XP</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#8A5A00]">
                <Zap className="w-3.5 h-3.5 fill-[#F2B93B]" />
                <span className="text-xs font-black font-mono text-shimmer">{totalXP}</span>
              </div>
            </div>

            {/* XP bar */}
            <div className="w-full bg-[#FFFDF9] h-2.5 rounded-full overflow-hidden border border-[#E8DCCB]">
              <div
                className="bg-gradient-to-r from-[#3D1119] via-[#5C1F2A] to-[#5C1F2A] h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(92,31,42,0.5)]"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] mt-1 text-[#B3A59C] font-bold">
              <span>Lv {level}</span>
              <span>{100 - xpPct}% to Lv {level + 1}</span>
            </div>
          </div>

          {/* Sound toggle row */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#B5581B] fill-[#E9873A]/80 animate-fire-flicker" />
              <span className="text-[10px] font-black text-[#857670] uppercase tracking-wide">Sound</span>
            </div>
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-[#FFFDF9] border-[#E8DCCB] text-[#B3A59C] hover:border-[#E8DCCB] hover:text-[#857670]'
                  : 'bg-[#FFFDF9] border-[#E8DCCB] text-[#7A2B37] hover:bg-[#F1E6D6] hover:border-[#5C1F2A]/40'
              }`}
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E8DCCB]/60 px-2 py-2 flex items-center justify-around select-none shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-xl transition-all relative ${
              item.isActive
                ? 'text-[#5C1F2A]'
                : 'text-[#857670] hover:text-[#4D3B38]'
            }`}
          >
            {item.isActive && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#5C1F2A]" />
            )}
            <div className={`transition-transform ${item.isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            {requestBadge(item.id) > 0 && (
              <span
                className="absolute top-0 right-1 min-w-4 h-4 px-1 rounded-full bg-[#C2414B] text-[#2B1B1A] text-[9px] font-black flex items-center justify-center"
                aria-label={`${requestBadge(item.id)} pending friend requests`}
              >
                {requestBadge(item.id)}
              </span>
            )}
            <span className={`text-[9px] font-black uppercase mt-0.5 tracking-wider ${item.isActive ? 'text-[#5C1F2A]' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
};
