import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  X,
  Check,
  Zap,
  Flame,
  GraduationCap,
  Heart,
  Star,
  Send,
  UserCheck,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { useFriends } from '../hooks/useFriends';

export const FriendsPage: React.FC = () => {
  const {
    friends,
    requests,
    suggestions,
    sentRequests,
    addFriendByUsername,
    acceptRequest,
    declineRequest,
    sendRequest,
    removeFriend,
  } = useFriends();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find'>('friends');
  const [addUsername, setAddUsername] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = () => {
    if (!addUsername.trim()) return;
    const res = addFriendByUsername(addUsername);
    if (res.success) {
      sound.playCorrect();
      setFeedbackMsg({ text: res.message, type: 'success' });
      setAddUsername('');
      setShowAddModal(false);
    } else {
      sound.playIncorrect();
      setFeedbackMsg({ text: res.message, type: 'error' });
    }
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12 animate-fade-in select-none">
      {/* Toast */}
      {feedbackMsg && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl animate-fade-in flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
              : 'bg-rose-500 text-white shadow-rose-500/30'
          }`}
        >
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {feedbackMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1cb0f6] to-[#7c3aed] flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            Friends & Study Cohort
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            {friends.length} friends • {friends.filter((f) => f.isOnline).length} active now
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowAddModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-xs uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          ADD FRIEND
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#0f1d38] border-2 border-[#1c325c] rounded-2xl text-xs font-black mb-6 w-fit">
        {[
          { id: 'friends' as const, label: `Friends (${friends.length})`, icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'requests' as const, label: `Requests (${requests.length})`, icon: <Heart className="w-3.5 h-3.5" /> },
          { id: 'find' as const, label: 'Discover Classmates', icon: <Search className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#1b3464] text-[#1cb0f6]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Friends List Tab */}
      {activeTab === 'friends' && (
        <div className="animate-fade-in">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search friends by name or @username..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0f1d38] border-2 border-[#1c325c] text-white text-sm font-bold placeholder:text-slate-500 focus:outline-none focus:border-[#1cb0f6] transition-colors"
            />
          </div>

          {/* Friends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] hover:border-[#274885] p-5 transition-all group shadow-lg"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#142344] to-[#1b3464] border-2 border-[#274885] flex items-center justify-center text-2xl shadow-md">
                      {friend.avatar}
                    </div>
                    {friend.isOnline && (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0f1d38] animate-pulse"
                        title="Online now"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-black text-white truncate">{friend.name}</h3>
                      <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                        Lv.{friend.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mb-2">
                      @{friend.username} • {friend.lastActive}
                    </p>

                    {/* Mini Stats */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                        <Zap className="w-3 h-3 fill-amber-400" /> {friend.xp} XP
                      </span>
                      <span className="text-[10px] font-black text-orange-400 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-950/60 border border-orange-500/30">
                        <Flame className="w-3 h-3 fill-orange-400" /> {friend.streak}d streak
                      </span>
                      <span className="text-[10px] font-black text-cyan-300 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/30">
                        <GraduationCap className="w-3 h-3" /> {friend.lessonsCompleted} done
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      removeFriend(friend.id);
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Remove friend"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-16 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c]">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-bold">No friends matched "{searchQuery}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by username or add a new classmate!</p>
            </div>
          )}
        </div>
      )}

      {/* Friend Requests Tab */}
      {activeTab === 'requests' && (
        <div className="animate-fade-in space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c]">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-bold">No pending friend requests</p>
              <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] p-5 flex items-center justify-between gap-4 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#142344] to-[#1b3464] border-2 border-[#274885] flex items-center justify-center text-2xl shadow-md">
                    {req.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{req.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      @{req.username} • Level {req.level} • {req.mutualFriends} mutual friends
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sound.playCorrect();
                      acceptRequest(req.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-[11px] uppercase tracking-wider border-b-2 border-[#1899d6] active:translate-y-0.5 active:border-b-0 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Accept
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      declineRequest(req.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#142344] hover:bg-[#1a2e58] text-slate-300 font-black text-[11px] uppercase tracking-wider border-b-2 border-[#0c182e] transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Discover Tab */}
      {activeTab === 'find' && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            Suggested High School Study Partners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((sug) => {
              const isSent = sentRequests.includes(sug.id);
              return (
                <div
                  key={sug.id}
                  className="rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] p-5 flex flex-col items-center text-center shadow-lg"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#142344] to-[#1b3464] border-2 border-[#274885] flex items-center justify-center text-3xl shadow-md mb-3">
                    {sug.avatar}
                  </div>
                  <h3 className="text-sm font-black text-white">{sug.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium mb-1">@{sug.username}</p>
                  <p className="text-[10px] text-slate-500 mb-4">
                    Level {sug.level} • {sug.mutualFriends} mutual friends
                  </p>
                  <button
                    onClick={() => {
                      sound.playCorrect();
                      sendRequest(sug.id);
                    }}
                    disabled={isSent}
                    className={`w-full py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      isSent
                        ? 'bg-[#142344] text-slate-400 border-2 border-[#1c325c] cursor-not-allowed'
                        : 'bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 border-b-2 border-[#1899d6] active:translate-y-0.5 active:border-b-0 cursor-pointer'
                    }`}
                  >
                    {isSent ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" /> Request Sent
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" /> Add Friend
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-[#0f1d38] border-2 border-[#1cb0f6] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1cb0f6]" />
                Add Study Buddy
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddModal(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 font-medium">
              Enter your classmate's username (e.g. <code>maya_ai_queen</code>, <code>chloe_ml</code>) to add them directly to your friends list.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSubmit();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">
                  @
                </span>
                <input
                  type="text"
                  value={addUsername}
                  onChange={(e) => setAddUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#142344] border-2 border-[#1f3764] text-white text-sm font-bold placeholder:text-slate-500 focus:outline-none focus:border-[#1cb0f6] transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!addUsername.trim()}
                className="px-5 py-3 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs uppercase tracking-wider border-b-2 border-[#1899d6] active:translate-y-0.5 active:border-b-0 transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                Add
              </button>
            </form>

            <p className="text-[10px] text-slate-500 mt-3 text-center">
              Your friend will appear on your friends leaderboard and stats instantly!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
