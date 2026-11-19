import React, { useEffect, useRef, useState } from 'react';
import { Users, UserPlus, Search, X, Check, Heart, Send, Clock, Compass, Loader2, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';
import { useFriends } from '../hooks/useFriends';
import type { ActionOutcome, PersonEntry } from '../hooks/useFriends';
import { PersonAvatar, personName } from '../components/PersonAvatar';

interface FriendsPageProps {
  onNavigateLocal?: () => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({ onNavigateLocal }) => {
  const {
    status,
    friends,
    incoming,
    outgoing,
    busyUids,
    sendRequestByUsername,
    acceptRequest,
    declineRequest,
    cancelRequest,
    removeFriend,
    retry,
  } = useFriends();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [addUsername, setAddUsername] = useState('');
  const [adding, setAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMsg, setModalMsg] = useState<ActionOutcome | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const toast = (outcome: ActionOutcome) => {
    if (outcome.ok) sound.playCorrect();
    else sound.playIncorrect();
    setFeedbackMsg({ text: outcome.message, type: outcome.ok ? 'success' : 'error' });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const needle = searchQuery.trim().toLowerCase();
  const filteredFriends = friends.filter(
    (f) =>
      !needle ||
      (f.profile?.displayName ?? '').toLowerCase().includes(needle) ||
      (f.profile?.username ?? '').toLowerCase().includes(needle),
  );

  const handleAddSubmit = async () => {
    if (!addUsername.trim() || adding) return;
    setAdding(true);
    setModalMsg(null);
    const outcome = await sendRequestByUsername(addUsername);
    setAdding(false);
    if (outcome.ok) {
      toast(outcome);
      setAddUsername('');
      setShowAddModal(false);
      setActiveTab('requests');
    } else {
      sound.playIncorrect();
      setModalMsg(outcome);
    }
  };

  const personLine = (p: PersonEntry) =>
    p.profile?.username ? `@${p.profile.username}` : p.profile ? 'No username yet' : '';

  const pendingTotal = incoming.length + outgoing.length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12 animate-fade-in select-none">
      {/* Toast */}
      {feedbackMsg && (
        <div
          role="status"
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] max-w-[calc(100vw-1.5rem)] px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl animate-fade-in flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-[#8DAA5B] text-[#2B1B1A] shadow-[#8DAA5B]/30'
              : 'bg-[#C2414B] text-[#2B1B1A] shadow-[#C2414B]/30'
          }`}
        >
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
          {feedbackMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B1B1A] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5C1F2A] to-[#5C1F2A] flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-[#2B1B1A]" />
            </div>
            Friends & Study Cohort
          </h1>
          <p className="text-sm text-[#857670] font-medium mt-1">
            {status === 'ready'
              ? `${friends.length} ${friends.length === 1 ? 'friend' : 'friends'} • ${incoming.length} waiting for your reply`
              : 'Loading your friends…'}
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setModalMsg(null);
            setShowAddModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] font-black text-xs uppercase tracking-wider border-b-4 border-[#3D1119] active:translate-y-1 active:border-b-0 transition-all shadow-lg shadow-[#5C1F2A]/25 flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          ADD FRIEND
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#FFFDF9] border-2 border-[#E8DCCB] rounded-2xl text-xs font-black mb-6 w-fit max-w-full overflow-x-auto">
        {[
          { id: 'friends' as const, label: `Friends (${friends.length})`, icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'requests' as const, label: `Requests (${pendingTotal})`, icon: <Heart className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[#F1E6D6] text-[#5C1F2A]' : 'text-[#857670] hover:text-[#2B1B1A]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="text-center py-16 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB]" role="status">
          <Loader2 className="w-10 h-10 text-[#5C1F2A] mx-auto mb-3 animate-spin" />
          <p className="text-[#4D3B38] font-bold">Loading your friends…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-16 rounded-3xl bg-[#FFFDF9] border-2 border-[#F2B93B]/40" role="alert">
          <p className="text-[#2B1B1A] font-bold mb-1">We couldn't load your friends.</p>
          <p className="text-xs text-[#857670] mb-4">Check your connection and try again.</p>
          <button
            onClick={() => {
              sound.playClick();
              retry();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#5C1F2A] text-[#FFF8EE] font-black text-xs uppercase tracking-wider border-b-4 border-[#3D1119] inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      )}

      {/* Friends List Tab */}
      {status === 'ready' && activeTab === 'friends' && (
        <div className="animate-fade-in">
          {friends.length > 0 && (
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#857670]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends by name or @username..."
                aria-label="Search friends"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF9] border-2 border-[#E8DCCB] text-[#2B1B1A] text-sm font-bold placeholder:text-[#857670] focus:outline-none focus:border-[#5C1F2A] transition-colors"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.uid}
                className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] hover:border-[#F1E6D6] p-5 transition-all group shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <PersonAvatar profile={friend.profile} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-[#2B1B1A] truncate">{personName(friend.profile)}</h3>
                    <p className="text-[11px] text-[#857670] font-medium truncate">{personLine(friend)}</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!window.confirm(`Remove ${personName(friend.profile)} from your friends?`)) return;
                      sound.playClick();
                      toast(await removeFriend(friend.uid));
                    }}
                    disabled={busyUids.has(friend.uid)}
                    className="p-2 rounded-xl text-[#857670] hover:text-[#B0303C] hover:bg-[#FBE3E0]/40 transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer disabled:opacity-40"
                    title="Remove friend"
                    aria-label={`Remove ${personName(friend.profile)}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {friends.length === 0 && (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB]">
              <Users className="w-12 h-12 text-[#B3A59C] mx-auto mb-3" />
              <p className="text-[#4D3B38] font-bold">You haven't added any friends yet</p>
              <p className="text-xs text-[#857670] mt-1 mb-4">
                Add a classmate by username, or browse everyone who has joined Aivio.
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateLocal?.();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#F6EFE4] hover:bg-[#F1E6D6] text-[#5C1F2A] border-2 border-[#E8DCCB] font-black text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" /> Browse Local
              </button>
            </div>
          )}

          {friends.length > 0 && filteredFriends.length === 0 && (
            <div className="text-center py-12 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB]">
              <p className="text-[#4D3B38] font-bold">No friends matched "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {status === 'ready' && activeTab === 'requests' && (
        <div className="animate-fade-in space-y-8">
          <section>
            <h3 className="text-xs font-black text-[#857670] uppercase tracking-wider mb-3">
              Waiting for your reply ({incoming.length})
            </h3>
            {incoming.length === 0 ? (
              <div className="text-center py-12 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB]">
                <Heart className="w-10 h-10 text-[#B3A59C] mx-auto mb-3" />
                <p className="text-[#4D3B38] font-bold">No incoming friend requests</p>
                <p className="text-xs text-[#857670] mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incoming.map((req) => (
                  <div
                    key={req.uid}
                    className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <PersonAvatar profile={req.profile} />
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-[#2B1B1A] truncate">{personName(req.profile)}</h3>
                        <p className="text-[11px] text-[#857670] font-medium truncate">{personLine(req)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled={busyUids.has(req.uid)}
                        onClick={async () => {
                          toast(await acceptRequest(req.uid));
                        }}
                        className="px-4 py-2 rounded-xl bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] font-black text-[11px] uppercase tracking-wider border-b-2 border-[#3D1119] active:translate-y-0.5 active:border-b-0 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {busyUids.has(req.uid) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />} Accept
                      </button>
                      <button
                        disabled={busyUids.has(req.uid)}
                        onClick={async () => {
                          sound.playClick();
                          toast(await declineRequest(req.uid));
                        }}
                        className="px-4 py-2 rounded-xl bg-[#F6EFE4] hover:bg-[#F1E6D6] text-[#4D3B38] font-black text-[11px] uppercase tracking-wider border-b-2 border-[#FFFDF9] transition-all cursor-pointer disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xs font-black text-[#857670] uppercase tracking-wider mb-3">
              Sent by you ({outgoing.length})
            </h3>
            {outgoing.length === 0 ? (
              <p className="text-xs text-[#857670] font-medium">You have no pending requests.</p>
            ) : (
              <div className="space-y-4">
                {outgoing.map((req) => (
                  <div
                    key={req.uid}
                    className="rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <PersonAvatar profile={req.profile} />
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-[#2B1B1A] truncate">{personName(req.profile)}</h3>
                        <p className="text-[11px] text-[#857670] font-medium truncate">{personLine(req)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#8A5A00] flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FBE9A6]/60 border border-[#F2B93B]/30">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                      <button
                        disabled={busyUids.has(req.uid)}
                        onClick={async () => {
                          sound.playClick();
                          toast(await cancelRequest(req.uid));
                        }}
                        className="px-4 py-2 rounded-xl bg-[#F6EFE4] hover:bg-[#F1E6D6] text-[#4D3B38] font-black text-[11px] uppercase tracking-wider border-b-2 border-[#FFFDF9] transition-all cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div role="dialog" aria-modal="true" aria-label="Add a friend" className="max-w-md w-full bg-[#FFFDF9] border-2 border-[#5C1F2A] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-[#2B1B1A] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#5C1F2A]" />
                Add Study Buddy
              </h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddModal(false);
                }}
                aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-[#F6EFE4] text-[#857670] hover:text-[#2B1B1A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4D3B38] mb-4 font-medium">
              Enter your classmate's exact Aivio username to send them a friend request. They'll need to accept it before you're friends.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleAddSubmit();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857670] text-sm font-bold">@</span>
                <input
                  type="text"
                  value={addUsername}
                  onChange={(e) => setAddUsername(e.target.value)}
                  placeholder="username"
                  aria-label="Username"
                  disabled={adding}
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#F6EFE4] border-2 border-[#F1E6D6] text-[#2B1B1A] text-sm font-bold placeholder:text-[#857670] focus:outline-none focus:border-[#5C1F2A] transition-colors disabled:opacity-60"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!addUsername.trim() || adding}
                className="px-5 py-3 rounded-2xl bg-[#5C1F2A] hover:bg-[#5C1F2A] disabled:bg-[#F6EFE4] disabled:text-[#857670] text-[#FFF8EE] font-black text-xs uppercase tracking-wider border-b-2 border-[#3D1119] active:translate-y-0.5 active:border-b-0 transition-all flex items-center gap-1.5"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send
              </button>
            </form>

            {modalMsg && (
              <p role="alert" className="mt-3 text-xs font-bold text-[#B0303C] bg-[#C2414B]/10 border border-[#C2414B]/40 rounded-xl px-3 py-2.5">
                {modalMsg.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
