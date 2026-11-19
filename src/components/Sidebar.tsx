import React from 'react';
import {
  LayoutGrid,
  BookOpen,
  Sparkles,
  FolderKanban,
  Users,
  Volume2,
  VolumeX,
  Settings,
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
  streakDays?: number;
}

interface NavItem {
  id: string;
  label: string;
  view: AppView;
  icon: React.ReactNode;
  tab: string;
}

// Labels follow the Figma nav. Each entry opens the screen that already holds that feature.
const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', view: 'dashboard', icon: <LayoutGrid className="w-[18px] h-[18px]" />, tab: 'learn' },
  { id: 'learning', label: 'My learning', view: 'progress', icon: <BookOpen className="w-[18px] h-[18px]" />, tab: 'progress' },
  { id: 'playground', label: 'AI playground', view: 'local', icon: <Sparkles className="w-[18px] h-[18px]" />, tab: 'local' },
  { id: 'projects', label: 'My projects', view: 'profile', icon: <FolderKanban className="w-[18px] h-[18px]" />, tab: 'profile' },
  { id: 'community', label: 'Community', view: 'friends', icon: <Users className="w-[18px] h-[18px]" />, tab: 'friends' },
];

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onSelectTab,
  streakDays = 0,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted);
  const { incoming } = useFriends();

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playClick();
  };

  const isActive = (item: NavItem) => {
    if (item.view === 'dashboard') return currentView === 'dashboard' || currentView === 'home' || currentView === 'review';
    return currentView === item.view;
  };

  // Days of the current week that the streak covers, counted back from today.
  const todayIdx = (new Date().getDay() + 6) % 7;
  const doneDays = new Set<number>();
  for (let i = 0; i < Math.min(streakDays, 7); i++) doneDays.add((todayIdx - i + 7) % 7);

  const go = (item: NavItem) => {
    sound.playClick();
    onNavigate(item.view);
    onSelectTab?.(item.tab);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 h-screen sticky top-0 bg-[#FFFDF9] border-r border-[#E8DCCB] p-5 select-none">
        <div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-3 px-2 py-2 mb-8 text-left"
            aria-label="Aivio home"
          >
            <img src="/mascot-penguin-happy.png" alt="" className="w-11 h-11 object-contain" />
            <span className="text-2xl font-black tracking-tight text-[#2B1B1A]" style={{ fontFamily: 'Fredoka, Nunito, sans-serif' }}>
              Aivio
            </span>
          </button>

          <p className="px-2 mb-2 text-[11px] font-black uppercase tracking-widest text-[#857670]">Menu</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => go(item)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
                    active ? 'bg-[#F1E6D6] text-[#5C1F2A]' : 'text-[#4D3B38] hover:bg-[#F6EFE4]'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'community' && incoming.length > 0 && (
                    <span
                      className="min-w-5 h-5 px-1.5 rounded-full bg-[#C2414B] text-[#FFF8EE] text-[10px] font-black flex items-center justify-center"
                      aria-label={`${incoming.length} pending friend requests`}
                    >
                      {incoming.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-[#FBE3E0] border border-[#E8DCCB]">
            <p className="text-sm font-black text-[#2B1B1A]">A little, every day</p>
            <p className="text-xs text-[#4D3B38] mt-0.5">
              {streakDays > 0 ? `${streakDays} day${streakDays === 1 ? '' : 's'} in a row` : 'Start a streak today'}
            </p>
            <div className="flex items-center justify-between mt-3">
              {WEEK.map((d, i) => {
                const done = doneDays.has(i);
                return (
                  <span
                    key={`${d}-${i}`}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${
                      done ? 'bg-[#5C1F2A] text-[#FFF8EE]' : 'bg-[#FFFDF9] text-[#857670] border border-[#E8DCCB]'
                    }`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="flex items-center gap-2 text-sm font-bold text-[#4D3B38]">
              <Settings className="w-[18px] h-[18px]" />
              Settings
            </span>
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl border border-[#E8DCCB] bg-[#FFFDF9] text-[#4D3B38] hover:bg-[#F6EFE4]"
              title={isMuted ? 'Turn sound on' : 'Turn sound off'}
              aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9] border-t border-[#E8DCCB] px-2 py-2 flex items-center justify-around select-none">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.id}
              onClick={() => go(item)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-bold ${
                active ? 'text-[#5C1F2A]' : 'text-[#857670]'
              }`}
            >
              {item.icon}
              <span className="truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
