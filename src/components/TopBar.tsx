import React from 'react';
import { Flame, Zap, Users, Gamepad2, Compass } from 'lucide-react';
import { sound } from '../utils/sound';

export type TopTab = 'pathway' | 'review' | 'friends';

interface TopBarProps {
  active: TopTab;
  onSelect: (tab: TopTab) => void;
  streakDays: number;
  totalXP: number;
}

const TABS: { id: TopTab; label: string; icon: React.ReactNode }[] = [
  { id: 'pathway', label: 'Pathway', icon: <Compass className="w-4 h-4" /> },
  { id: 'review', label: 'Review games', icon: <Gamepad2 className="w-4 h-4" /> },
  { id: 'friends', label: 'Friends', icon: <Users className="w-4 h-4" /> },
];

export const TopBar: React.FC<TopBarProps> = ({ active, onSelect, streakDays, totalXP }) => (
  <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
    <nav
      aria-label="Sections"
      className="flex items-center gap-1 p-1.5 rounded-full bg-[#FFFDF9] border border-[#E8DCCB] shadow-sm overflow-x-auto max-w-full"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              onSelect(tab.id);
            }}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-[#5C1F2A] text-[#FFF8EE] shadow-sm'
                : 'text-[#4D3B38] hover:bg-[#F6EFE4]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </nav>

    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FBE9A6] border border-[#F2B93B]/60 text-[#8A5A00] text-xs font-black">
        <Flame className="w-4 h-4 fill-[#E9873A] text-[#E9873A]" />
        {streakDays}-day streak
      </span>
      <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFFDF9] border border-[#E8DCCB] text-[#2B1B1A] text-xs font-black">
        <Zap className="w-4 h-4 fill-[#F2B93B] text-[#F2B93B]" />
        {totalXP} XP
      </span>
    </div>
  </header>
);
