import React, { useEffect, useState } from 'react';
import {
  User,
  Camera,
  Mail,
  AtSign,
  MapPin,
  GraduationCap,
  Calendar,
  Save,
  Pencil,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Globe,
  Bell,
  Shield,
  Eye,
  Check,
  Sparkles,
  Users,
  LogOut,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { useUserProfile } from '../hooks/useUserProfile';
import type { UserProfileDoc } from '../lib/userProfile';
import { useAuth } from '../hooks/useAuth';
import { UnsavedProgressError } from '../lib/pendingSaves';
import { normalizeUsername, validateUsername } from '../lib/username';
import type { UserProgress } from '../types/lesson';
import type { LevelInfo } from '../hooks/useProgress';

interface ProfilePageProps {
  progress: UserProgress;
  levelInfo: LevelInfo;
  onUpdateUserName: (name: string) => void;
  onNavigateFriends?: () => void;
}

interface ProfileFormState {
  displayName: string;
  username: string;
  bio: string;
  location: string;
  grade: string;
  school: string;
  birthday: string;
  website: string;
  avatarUrl: string;
  dailyGoalXP: number;
}

/** Mirrors the saved document exactly — no sample values stand in for blanks. */
function toFormState(profile: UserProfileDoc): ProfileFormState {
  return {
    displayName: profile.displayName ?? '',
    username: profile.username ?? '',
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    grade: profile.grade ?? '',
    school: profile.school ?? '',
    birthday: profile.birthday ?? '',
    website: profile.website ?? '',
    avatarUrl: profile.avatarUrl || '/mascot-penguin-happy.png',
    dailyGoalXP: profile.dailyGoalXP ?? 50,
  };
}

const EMPTY_FORM: ProfileFormState = {
  displayName: '',
  username: '',
  bio: '',
  location: '',
  grade: '',
  school: '',
  birthday: '',
  website: '',
  avatarUrl: '/mascot-penguin-happy.png',
  dailyGoalXP: 50,
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  progress,
  levelInfo,
  onUpdateUserName,
  onNavigateFriends,
}) => {
  const { profile, loading, saving, error, saved, saveProfile, clearStatus } = useUserProfile();
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [unsavedOnSignOut, setUnsavedOnSignOut] = useState(false);

  const handleSignOut = async (force = false) => {
    if (signingOut) return;
    sound.playClick();
    setSigningOut(true);
    setUnsavedOnSignOut(false);
    try {
      await logout({ force });
    } catch (err) {
      if (err instanceof UnsavedProgressError) setUnsavedOnSignOut(true);
      else console.error('Sign out failed:', err instanceof Error ? err.message : err);
    } finally {
      setSigningOut(false);
    }
  };
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'privacy' | 'notifications'>('general');

  const [formData, setFormData] = useState<ProfileFormState>(EMPTY_FORM);

  // Mirror the loaded document into the form, but never while the learner is
  // mid-edit, so an incoming update cannot wipe what they are typing.
  useEffect(() => {
    if (profile && !isEditing) {
      setFormData(toFormState(profile));
    }
  }, [profile, isEditing]);

  const catAvatarOptions = [
    { id: 'penguin-happy', src: '/mascot-penguin-happy.png', label: 'Happy Hat' },
    { id: 'penguin-writing', src: '/mascot-penguin-writing.png', label: 'Note Taker' },
    { id: 'penguin-thinking', src: '/mascot-penguin-thinking.png', label: 'Curious Ponder' },
    { id: 'penguin-celebrate', src: '/mascot-penguin-celebrate.png', label: 'Jumping Joy' },
    { id: 'penguin-love', src: '/mascot-penguin-love.png', label: 'Big Heart' },
    { id: 'penguin-idea', src: '/mascot-penguin-idea.png', label: 'Bright Idea' },
  ];

  // Live username feedback. Availability itself is decided by the server:
  // the reservation write fails if someone else holds the name.
  const normalizedUsername = normalizeUsername(formData.username);
  const usernameChanged = normalizedUsername !== (profile?.username ?? '');
  const usernameProblem =
    usernameChanged && normalizedUsername.length > 0
      ? validateUsername(normalizedUsername)
      : null;

  const handleSave = async () => {
    if (saving) return;

    if (usernameProblem) {
      sound.playIncorrect();
      return;
    }

    const ok = await saveProfile({
      displayName: formData.displayName.trim(),
      username: normalizedUsername,
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      grade: formData.grade,
      school: formData.school.trim(),
      birthday: formData.birthday,
      website: formData.website.trim(),
      avatarUrl: formData.avatarUrl,
      dailyGoalXP: formData.dailyGoalXP,
    });

    if (ok) {
      sound.playCorrect();
      // Keeps the locally stored progress greeting in step with the profile.
      onUpdateUserName(formData.displayName.trim());
      setIsEditing(false);
    } else {
      sound.playIncorrect();
    }
  };

  const handleChange = (field: keyof ProfileFormState, value: string | number) => {
    if (error || saved) clearStatus();
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectAvatar = (src: string) => {
    sound.playClick();
    setFormData((prev) => ({ ...prev, avatarUrl: src }));
    setShowAvatarPicker(false);
    // Avatar is a one-tap change, so it is persisted on its own.
    void saveProfile({ avatarUrl: src });
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-24 lg:pb-12 animate-fade-in">
        <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-10 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#5C1F2A] animate-spin" />
          <p className="text-xs font-black uppercase tracking-wider text-[#857670]">
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-24 lg:pb-12 animate-fade-in select-none">
      {/* Save confirmation toast */}
      {saved && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-[#8DAA5B] text-[#2B1B1A] font-black text-sm uppercase tracking-wider shadow-2xl shadow-[#8DAA5B]/30 animate-fade-in flex items-center gap-2">
          <Check className="w-5 h-5 stroke-[3]" /> Profile changes saved successfully!
        </div>
      )}

      {/* Load / save failure */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-2xl bg-[#C2414B]/10 border-2 border-[#C2414B]/40 px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 text-[#B0303C] shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-[#B0303C]">{error}</p>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#F6EFE4] to-[#FFFDF9] border-2 border-[#E8DCCB] shadow-2xl overflow-hidden mb-8">
        {/* Cover / Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-[#3D1119] via-[#5C1F2A] to-[#5C1F2A] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FFFDF9] to-transparent" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 sm:px-8 pb-6 -mt-16 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-[#FFFDF9] bg-[#FFFDF9] p-2 shadow-2xl ring-4 ring-[#5C1F2A]/40 flex items-center justify-center">
                <img
                  src={formData.avatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAvatarPicker(true);
                }}
                className="absolute bottom-1 right-1 p-2 rounded-xl bg-[#5C1F2A] text-[#FFF8EE] shadow-lg hover:bg-[#FBE3E0] transition-all border-2 border-white cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Name + Stats */}
            <div className="flex-1 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[#2B1B1A] tracking-tight">
                  {formData.displayName || 'Your name'}
                </h1>
                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-[#5C1F2A] to-[#5C1F2A] text-[#2B1B1A] border border-[#E8DCCB]/30 shadow-sm w-fit">
                  Level {levelInfo.level} • {levelInfo.title}
                </span>
              </div>
              <p className="text-sm text-[#857670] font-medium">
                {formData.username ? `@${formData.username}` : 'No username yet — add one below'}
              </p>
              {formData.bio && (
                <p className="text-xs text-[#4D3B38] mt-1 max-w-md font-medium">{formData.bio}</p>
              )}
            </div>

            {/* Actions: Edit Profile & View Friends */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (isEditing) {
                    void handleSave();
                  } else {
                    sound.playClick();
                    clearStatus();
                    setIsEditing(true);
                  }
                }}
                disabled={saving}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border-b-4 active:translate-y-1 active:border-b-0 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isEditing
                    ? 'bg-[#8DAA5B] hover:bg-[#8DAA5B] border-[#8DAA5B] text-[#2B1B1A]'
                    : 'bg-[#5C1F2A] hover:bg-[#5C1F2A] border-[#3D1119] text-[#FFF8EE]'
                }`}
              >
                {isEditing ? (
                  <>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'SAVING…' : 'SAVE PROFILE'}
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4" />
                    EDIT PROFILE
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateFriends?.();
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#F6EFE4] hover:bg-[#F1E6D6] border-b-4 border-[#FFFDF9] text-[#5C1F2A] font-black text-xs uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                FRIENDS
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-[#E8DCCB]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBE9A6]/60 border border-[#F2B93B]/40 text-[#8A5A00] font-black text-xs">
              <Zap className="w-4 h-4 fill-[#F2B93B]" />
              <span className="font-mono">{progress.totalXP} XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBE9A6]/60 border border-[#E9873A]/40 text-[#B5581B] font-black text-xs">
              <Flame className="w-4 h-4 fill-[#E9873A]" />
              <span>{progress.currentStreak} day streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBE3E0]/60 border border-[#E8DCCB]/40 text-[#2B1B1A] font-black text-xs">
              <Award className="w-4 h-4" />
              <span>{progress.earnedBadgeIds.length} badges earned</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBE3E0]/60 border border-[#5C1F2A]/40 text-[#7A2B37] font-black text-xs">
              <GraduationCap className="w-4 h-4" />
              <span>{progress.completedLessonIds.length} lessons completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#FFFDF9] border-2 border-[#E8DCCB] rounded-2xl text-xs font-black mb-6 w-fit">
        {[
          { id: 'general' as const, label: 'General Info', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'privacy' as const, label: 'Privacy', icon: <Shield className="w-3.5 h-3.5" /> },
          { id: 'notifications' as const, label: 'Notifications', icon: <Bell className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveSection(tab.id);
            }}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeSection === tab.id
                ? 'bg-[#F1E6D6] text-[#5C1F2A]'
                : 'text-[#857670] hover:text-[#2B1B1A]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeSection === 'general' && (
        <div className="space-y-6 animate-fade-in">
          {/* Personal Information Card */}
          <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-[#2B1B1A] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#5C1F2A]" />
                Personal Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-[#5C1F2A] hover:underline flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" /> Edit Fields
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Name */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isEditing
                        ? 'bg-[#F6EFE4] border-2 border-[#5C1F2A] text-[#2B1B1A] focus:outline-none focus:ring-2 focus:ring-[#5C1F2A]/50'
                        : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                    }`}
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    disabled={!isEditing}
                    placeholder="pick_a_username"
                    maxLength={30}
                    autoComplete="off"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isEditing
                        ? `bg-[#F6EFE4] border-2 text-[#2B1B1A] focus:outline-none focus:ring-2 ${
                            usernameProblem
                              ? 'border-[#C2414B] focus:ring-[#C2414B]/50'
                              : 'border-[#5C1F2A] focus:ring-[#5C1F2A]/50'
                          }`
                        : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                    }`}
                  />
                </div>
                {isEditing && (
                  <p
                    className={`text-[11px] font-bold mt-1.5 ${
                      usernameProblem ? 'text-[#B0303C]' : 'text-[#857670]'
                    }`}
                  >
                    {usernameProblem
                      ? usernameProblem
                      : usernameChanged && normalizedUsername
                        ? `Will be saved as @${normalizedUsername} — checked for duplicates when you save.`
                        : '3–20 characters: letters, numbers and underscores.'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    readOnly
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#857670]"
                  />
                </div>
                <p className="text-[11px] font-bold text-[#857670] mt-1.5">
                  Managed by your sign-in account.
                </p>
              </div>

              {/* School */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  High School / Academy
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleChange('school', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Your school"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isEditing
                        ? 'bg-[#F6EFE4] border-2 border-[#5C1F2A] text-[#2B1B1A] focus:outline-none focus:ring-2 focus:ring-[#5C1F2A]/50'
                        : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                    }`}
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  Grade Level
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all appearance-none ${
                    isEditing
                      ? 'bg-[#F6EFE4] border-2 border-[#5C1F2A] text-[#2B1B1A] focus:outline-none focus:ring-2 focus:ring-[#5C1F2A]/50'
                      : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                  }`}
                >
                  <option value="">Not set</option>
                  <option value="9th Grade (Freshman)">9th Grade (Freshman)</option>
                  <option value="10th Grade (Sophomore)">10th Grade (Sophomore)</option>
                  <option value="11th Grade (Junior)">11th Grade (Junior)</option>
                  <option value="12th Grade (Senior)">12th Grade (Senior)</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, State"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isEditing
                        ? 'bg-[#F6EFE4] border-2 border-[#5C1F2A] text-[#2B1B1A] focus:outline-none focus:ring-2 focus:ring-[#5C1F2A]/50'
                        : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                    }`}
                  />
                </div>
              </div>

              {/* Birthday */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  Birthday
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isEditing
                        ? 'bg-[#F6EFE4] border-2 border-[#5C1F2A] text-[#2B1B1A] focus:outline-none focus:ring-2 focus:ring-[#5C1F2A]/50'
                        : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                    }`}
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                  Website / Portfolio
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://yoursite.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isEditing
                        ? 'bg-[#F6EFE4] border-2 border-[#5C1F2A] text-[#2B1B1A] focus:outline-none focus:ring-2 focus:ring-[#5C1F2A]/50'
                        : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#857670] mb-1.5 block">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all resize-none ${
                  isEditing
                    ? 'bg-[#F6EFE4] border-2 border-[#5C1F2A] text-[#2B1B1A] focus:outline-none focus:ring-2 focus:ring-[#5C1F2A]/50'
                    : 'bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#4D3B38]'
                }`}
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    clearStatus();
                    setIsEditing(false);
                    if (profile) setFormData(toFormState(profile));
                  }}
                  disabled={saving}
                  className="px-6 py-3 rounded-2xl bg-[#F6EFE4] hover:bg-[#F1E6D6] text-[#4D3B38] font-black text-xs uppercase tracking-wider border-b-4 border-[#FFFDF9] active:translate-y-1 active:border-b-0 transition-all disabled:opacity-60"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => void handleSave()}
                  disabled={saving || usernameProblem !== null}
                  className="px-8 py-3 rounded-2xl bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] font-black text-xs uppercase tracking-wider border-b-4 border-[#3D1119] active:translate-y-1 active:border-b-0 transition-all shadow-lg shadow-[#5C1F2A]/25 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'SAVING…' : 'SAVE CHANGES'}
                </button>
              </div>
            )}
          </div>

          {/* Learning Preferences Card */}
          <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-6 shadow-lg">
            <h3 className="text-sm font-black text-[#2B1B1A] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2B1B1A]" />
              Learning Preferences
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Daily XP Goal', value: '50 XP per day', desc: 'Maintain momentum with a daily target' },
                { label: 'Quiz Difficulty', value: 'Normal', desc: 'Balances conceptual checks with reasoning' },
                { label: 'Sound Feedback', value: 'Enabled', desc: 'Web audio chimes for correct and wrong answers' },
                { label: 'Floating Mascot', value: 'Enabled', desc: 'Aivo draggable buddy ready to answer questions' },
              ].map((pref) => (
                <div
                  key={pref.label}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DCCB] hover:border-[#F1E6D6] transition-colors group cursor-pointer"
                >
                  <div>
                    <span className="text-sm font-black text-[#2B1B1A] block">{pref.label}</span>
                    <span className="text-[11px] text-[#857670] font-medium">{pref.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5C1F2A]">{pref.value}</span>
                    <ChevronRight className="w-4 h-4 text-[#857670] group-hover:text-[#5C1F2A] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeSection === 'privacy' && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-6 shadow-lg">
            <h3 className="text-sm font-black text-[#2B1B1A] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#4F6B2A]" />
              Privacy & Visibility
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Profile visibility', desc: 'Who can view your profile and stats', icon: <Eye className="w-4 h-4" />, value: 'Friends only' },
                { label: 'Show streak publicly', desc: 'Display your daily streak badge', icon: <Flame className="w-4 h-4" />, value: 'On' },
                { label: 'Show XP publicly', desc: 'Display total XP on community leaderboards', icon: <Zap className="w-4 h-4" />, value: 'On' },
                { label: 'Allow friend requests', desc: 'Let classmates find you by username', icon: <Users className="w-4 h-4" />, value: 'Everyone' },
              ].map((setting) => (
                <div
                  key={setting.label}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DCCB] hover:border-[#F1E6D6] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#857670]">{setting.icon}</div>
                    <div>
                      <span className="text-sm font-black text-[#2B1B1A] block">{setting.label}</span>
                      <span className="text-[11px] text-[#857670] font-medium">{setting.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5C1F2A]">{setting.value}</span>
                    <ChevronRight className="w-4 h-4 text-[#857670] group-hover:text-[#5C1F2A] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeSection === 'notifications' && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-6 shadow-lg">
            <h3 className="text-sm font-black text-[#2B1B1A] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8A5A00]" />
              Notification Alerts
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Streak saver reminder', desc: 'Alert me at 7 PM if I have not practiced yet', enabled: true },
                { label: 'Friend milestone alerts', desc: 'When friends complete a unit or earn badges', enabled: true },
                { label: 'New unit releases', desc: 'Get notified when Units 2–6 open up', enabled: true },
                { label: 'Weekly progress summary', desc: 'Weekly email digest of concepts mastered', enabled: true },
              ].map((notif) => (
                <div
                  key={notif.label}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DCCB] hover:border-[#F1E6D6] transition-colors"
                >
                  <div>
                    <span className="text-sm font-black text-[#2B1B1A] block">{notif.label}</span>
                    <span className="text-[11px] text-[#857670] font-medium">{notif.desc}</span>
                  </div>
                  <div
                    className={`w-12 h-7 rounded-full flex items-center transition-colors cursor-pointer ${
                      notif.enabled ? 'bg-[#5C1F2A] justify-end' : 'bg-[#F1E6D6] justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md mx-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Account — Firebase session */}
      <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-6 shadow-lg mt-6">
        <h3 className="text-sm font-black text-[#2B1B1A] uppercase tracking-wider mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#5C1F2A]" />
          Account
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DCCB]">
          <div className="min-w-0">
            <span className="text-[11px] text-[#857670] font-medium block uppercase tracking-wider">
              Signed in as
            </span>
            <span className="text-sm font-black text-[#2B1B1A] block truncate">
              {user?.email ?? 'Unknown account'}
            </span>
          </div>

          <button
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="btn-3d shrink-0 bg-[#F6EFE4] hover:bg-[#F1E6D6] border-2 border-[#E8DCCB] hover:border-[#C2414B]/60 border-b-4 text-[#2B1B1A] hover:text-[#B0303C] font-black text-xs uppercase tracking-wider rounded-2xl px-5 py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            {signingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>

        {unsavedOnSignOut && (
          <div
            role="alert"
            className="mt-3 p-3 rounded-2xl bg-[#F2B93B]/10 border border-[#F2B93B]/40 text-xs font-bold text-[#8A5A00] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <span>
              Your latest progress hasn't been saved yet. Check your connection and retry, or sign out
              anyway — it stays on this device and is sent the next time you sign in here.
            </span>
            <span className="flex gap-2 shrink-0">
              <button
                onClick={() => void handleSignOut()}
                className="px-3 py-1.5 rounded-xl bg-[#F2B93B] text-[#2B1B1A] font-black uppercase tracking-wider"
              >
                Retry
              </button>
              <button
                onClick={() => void handleSignOut(true)}
                className="px-3 py-1.5 rounded-xl border border-[#F2B93B]/60 text-[#8A5A00] font-black uppercase tracking-wider"
              >
                Sign out anyway
              </button>
            </span>
          </div>
        )}

        <p className="text-[11px] text-[#857670] font-medium mt-3">
          Your learning progress is saved to your account.
        </p>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-[#FFFDF9] border-2 border-[#5C1F2A] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#2B1B1A] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#5C1F2A]" />
                Choose Mascot Avatar
              </h3>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="p-1.5 rounded-lg text-[#857670] hover:text-[#2B1B1A]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4D3B38] mb-5 font-medium">
              Pick your favorite blue cat mascot pose for your profile:
            </p>

            <div className="grid grid-cols-3 gap-3">
              {catAvatarOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => selectAvatar(opt.src)}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                    formData.avatarUrl === opt.src
                      ? 'bg-[#F1E6D6] border-[#5C1F2A] ring-2 ring-[#5C1F2A]/50'
                      : 'bg-[#F6EFE4] border-[#F1E6D6] hover:border-[#E8DCCB]'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFFDF9] p-1.5 shadow-md flex items-center justify-center">
                    <img src={opt.src} alt={opt.label} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-black text-[#4D3B38] text-center">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
