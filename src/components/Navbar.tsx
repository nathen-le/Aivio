import React, { useState } from 'react';
import { Sparkles, Flame, Zap, Award, BookOpen, Home, Menu, X } from 'lucide-react';
import type { LevelInfo } from '../hooks/useProgress';

interface NavbarProps {
  currentView: 'home' | 'dashboard' | 'progress';
  onNavigate: (view: 'home' | 'dashboard' | 'progress') => void;
  totalXP: number;
  streakDays: number;
  levelInfo: LevelInfo;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  totalXP,
  streakDays,
  levelInfo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#E8DCCB]/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5C1F2A] via-[#5C1F2A] to-[#5C1F2A] p-0.5 shadow-lg shadow-[#5C1F2A]/20 group-hover:shadow-[#5C1F2A]/40 transition-shadow">
            <div className="w-full h-full bg-[#FFFDF9] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#7A2B37] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-[#FBE3E0] to-[#5C1F2A] bg-clip-text text-transparent">
                Aivio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#FBE3E0]/80 text-[#7A2B37] border border-[#7A2B37]/60">
                Grades 9–12
              </span>
            </div>
            <p className="text-[11px] text-[#857670] font-medium hidden sm:block">
              Interactive AI Learning
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#FFFDF9]/60 p-1 rounded-xl border border-[#E8DCCB]">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'home'
                ? 'bg-[#F6EFE4] text-[#7A2B37] shadow-sm border border-[#E8DCCB]/60'
                : 'text-[#4D3B38] hover:text-[#2B1B1A] hover:bg-[#F6EFE4]/50'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'dashboard'
                ? 'bg-[#F6EFE4] text-[#7A2B37] shadow-sm border border-[#E8DCCB]/60'
                : 'text-[#4D3B38] hover:text-[#2B1B1A] hover:bg-[#F6EFE4]/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Learn
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'progress'
                ? 'bg-[#F6EFE4] text-[#7A2B37] shadow-sm border border-[#E8DCCB]/60'
                : 'text-[#4D3B38] hover:text-[#2B1B1A] hover:bg-[#F6EFE4]/50'
            }`}
          >
            <Award className="w-4 h-4" />
            Progress & Badges
          </button>
        </div>

        {/* User Quick Stats Pill */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Streak pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBE9A6] border border-[#E9873A]/30 text-[#B5581B] text-xs font-bold"
            title="Current Daily Learning Streak"
          >
            <Flame className="w-4 h-4 text-[#B5581B] fill-[#E9873A]/30 animate-pulse-subtle" />
            <span>{streakDays} {streakDays === 1 ? 'day' : 'days'}</span>
          </div>

          {/* XP pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBE9A6] border border-[#F2B93B]/30 text-[#8A5A00] text-xs font-bold"
            title="Total XP Earned"
          >
            <Zap className="w-4 h-4 text-[#8A5A00] fill-[#F2B93B]/40" />
            <span>{totalXP} XP</span>
          </div>

          {/* Level badge */}
          <button
            onClick={() => onNavigate('progress')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBE3E0]/40 border border-[#E8DCCB]/30 text-[#2B1B1A] text-xs font-bold hover:border-[#E8DCCB]/60 transition-colors"
            title={`Level ${levelInfo.level}: ${levelInfo.title}`}
          >
            <span className="w-2 h-2 rounded-full bg-[#5C1F2A] animate-ping" />
            <span>Lvl {levelInfo.level}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile streak pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FBE9A6] border border-[#E9873A]/30 text-[#B5581B] text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-[#E9873A]/30 text-[#B5581B]" />
            <span>{streakDays}</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#F6EFE4] text-[#4D3B38] hover:text-[#2B1B1A] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#E8DCCB] flex flex-col gap-2 pb-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
              currentView === 'home'
                ? 'bg-[#F6EFE4] text-[#7A2B37]'
                : 'text-[#4D3B38] hover:bg-[#F6EFE4]/40'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
              currentView === 'dashboard'
                ? 'bg-[#F6EFE4] text-[#7A2B37]'
                : 'text-[#4D3B38] hover:bg-[#F6EFE4]/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Learning Dashboard
          </button>
          <button
            onClick={() => {
              onNavigate('progress');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
              currentView === 'progress'
                ? 'bg-[#F6EFE4] text-[#7A2B37]'
                : 'text-[#4D3B38] hover:bg-[#F6EFE4]/40'
            }`}
          >
            <Award className="w-4 h-4" />
            Progress & Achievements
          </button>

          <div className="pt-2 border-t border-[#E8DCCB]/60 flex items-center justify-around text-xs font-semibold text-[#857670]">
            <span className="flex items-center gap-1 text-[#8A5A00]">
              <Zap className="w-3.5 h-3.5 text-[#8A5A00]" /> {totalXP} XP
            </span>
            <span className="flex items-center gap-1 text-[#2B1B1A]">
              Lvl {levelInfo.level}: {levelInfo.title}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};
