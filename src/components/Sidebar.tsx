import React from 'react';
import {
  Compass,
  Trophy,
  Users,
  User,
  Volume2,
  VolumeX,
  Sparkles,
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

  const navItems = [
    {
      id: 'learn',
      label: 'LEARN',
      icon: <Compass className="w-6 h-6 stroke-[2.5]" />,
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
      icon: <Trophy className="w-6 h-6 stroke-[2.5]" />,
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
      icon: <Users className="w-6 h-6 stroke-[2.5]" />,
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
      icon: <User className="w-6 h-6 stroke-[2.5]" />,
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
      {/* Desktop Left Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r-2 border-[#1c325c] bg-[#0c162c] h-screen sticky top-0 p-4 shrink-0 z-40 select-none">
        <div>
          {/* Brand Header */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-3 px-3 py-4 w-full text-left group transition-transform active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#1cb0f6] bg-[#0f1d38] shadow-[0_4px_12px_rgba(28,176,246,0.4)] shrink-0 flex items-center justify-center">
              <img
                src="/mascot-cat-avatar.png"
                alt="Aivio Mascot"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white uppercase font-sans">
                  Aivio
                </span>
                <span className="w-2 h-2 rounded-full bg-[#1cb0f6] animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block -mt-0.5">
                AI Learning Platform
              </span>
            </div>
          </button>

          {/* Navigation Chunky 3D Buttons */}
          <nav className="mt-6 space-y-2.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all duration-150 border-2 ${
                  item.isActive
                    ? 'bg-[#1b3464] border-[#1cb0f6] text-[#1cb0f6] shadow-[0_4px_0_#122345] translate-y-[-2px]'
                    : 'bg-transparent border-transparent text-slate-300 hover:bg-[#132344] hover:text-white hover:border-[#1c325c]'
                }`}
              >
                <div
                  className={`transition-transform ${
                    item.isActive ? 'text-[#1cb0f6] scale-110' : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Sidebar Info & Sound Toggle */}
        <div className="pt-4 border-t-2 border-[#1c325c] space-y-3">
          <div className="p-3 rounded-2xl bg-[#132344] border-2 border-[#1f3764] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-amber-300 font-mono">
                {totalXP} XP
              </span>
            </div>
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-xl bg-[#1b3464] hover:bg-[#254684] text-sky-300 border border-[#274885] transition-colors"
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-bold tracking-wider">
            HIGH SCHOOL AI LITERACY
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c162c] border-t-2 border-[#1c325c] px-3 py-2 flex items-center justify-around select-none shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              item.isActive
                ? 'text-[#1cb0f6] scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
};
