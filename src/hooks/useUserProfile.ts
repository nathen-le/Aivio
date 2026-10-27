import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  grade: string;
  school: string;
  birthday: string;
  website: string;
  avatarUrl: string;
  dailyGoalXP: number;
  difficulty: 'Beginner' | 'Normal' | 'Advanced';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  visibility: 'Public' | 'Friends only' | 'Private';
  showStreak: boolean;
  showXP: boolean;
  allowFriendRequests: boolean;
  dailyReminders: boolean;
  friendActivityAlerts: boolean;
  weeklyReport: boolean;
}

const STORAGE_KEY = 'aivio_user_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Kenny Vo',
  username: 'kenny_vo',
  email: 'kdvdoodoogaming@gmail.com',
  bio: 'Exploring neural networks & AI literacy one lesson at a time 🚀',
  location: 'Lilburn, GA',
  grade: '12th Grade',
  school: 'Parkview High School',
  birthday: '2008-04-12',
  website: '',
  avatarUrl: '/mascot-cat-avatar.png',
  dailyGoalXP: 50,
  difficulty: 'Normal',
  soundEnabled: true,
  animationsEnabled: true,
  visibility: 'Friends only',
  showStreak: true,
  showXP: true,
  allowFriendRequests: true,
  dailyReminders: true,
  friendActivityAlerts: true,
  weeklyReport: true,
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load profile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return { profile, updateProfile };
}
