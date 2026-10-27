import { useState, useEffect, useCallback } from 'react';

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarImage?: string;
  level: number;
  title: string;
  xp: number;
  streak: number;
  lessonsCompleted: number;
  isOnline: boolean;
  lastActive: string;
}

export interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  mutualFriends: number;
}

const STORAGE_FRIENDS = 'aivio_friends_list_v1';
const STORAGE_REQUESTS = 'aivio_friend_requests_v1';

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: 'Maya Singh',
    username: 'maya_ai_queen',
    avatar: '👩‍💻',
    level: 4,
    title: 'Model Apprentice',
    xp: 520,
    streak: 12,
    lessonsCompleted: 4,
    isOnline: true,
    lastActive: 'Online now',
  },
  {
    id: 'f2',
    name: 'Jordan Kim',
    username: 'jordanK_learns',
    avatar: '⚡',
    level: 3,
    title: 'Neural Navigator',
    xp: 310,
    streak: 5,
    lessonsCompleted: 3,
    isOnline: true,
    lastActive: 'Online now',
  },
  {
    id: 'f3',
    name: 'Liam Torres',
    username: 'liam_tech',
    avatar: '🤖',
    level: 2,
    title: 'Prompt Explorer',
    xp: 180,
    streak: 3,
    lessonsCompleted: 2,
    isOnline: false,
    lastActive: '2h ago',
  },
  {
    id: 'f4',
    name: 'Sophia Reyes',
    username: 'soph_ai',
    avatar: '🚀',
    level: 5,
    title: 'Algorithm Architect',
    xp: 780,
    streak: 21,
    lessonsCompleted: 5,
    isOnline: false,
    lastActive: '1d ago',
  },
  {
    id: 'f5',
    name: 'Ethan Park',
    username: 'eth_park',
    avatar: '🧠',
    level: 1,
    title: 'AI Novice',
    xp: 90,
    streak: 2,
    lessonsCompleted: 1,
    isOnline: false,
    lastActive: '3d ago',
  },
];

export const INITIAL_REQUESTS: FriendRequest[] = [
  { id: 'r1', name: 'Ava Chen', username: 'ava_codes', avatar: '🎨', level: 3, mutualFriends: 2 },
  { id: 'r2', name: 'Noah Patel', username: 'noah_ai', avatar: '🔬', level: 2, mutualFriends: 1 },
];

export const INITIAL_SUGGESTIONS: FriendRequest[] = [
  { id: 's1', name: 'Chloe Wang', username: 'chloe_ml', avatar: '🌟', level: 4, mutualFriends: 3 },
  { id: 's2', name: 'Lucas Miller', username: 'lucas_dev', avatar: '💡', level: 2, mutualFriends: 1 },
  { id: 's3', name: 'Mia Johnson', username: 'mia_j', avatar: '🎯', level: 3, mutualFriends: 2 },
  { id: 's4', name: 'Devon Vance', username: 'devon_neural', avatar: '🔥', level: 3, mutualFriends: 4 },
];

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FRIENDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FRIENDS;
  });

  const [requests, setRequests] = useState<FriendRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REQUESTS;
  });

  const [suggestions] = useState<FriendRequest[]>(INITIAL_SUGGESTIONS);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FRIENDS, JSON.stringify(friends));
    } catch (e) {
      console.error(e);
    }
  }, [friends]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  const addFriendByUsername = useCallback((username: string): { success: boolean; message: string } => {
    const clean = username.trim().replace(/^@/, '').toLowerCase();
    if (!clean) return { success: false, message: 'Please enter a username.' };

    const exists = friends.some((f) => f.username.toLowerCase() === clean);
    if (exists) return { success: false, message: `@${clean} is already on your friends list!` };


    const newFriend: Friend = {
      id: `friend_${Date.now()}`,
      name: clean.charAt(0).toUpperCase() + clean.slice(1).replace(/_/g, ' '),
      username: clean,
      avatar: ['🦊', '🐱', '🐼', '🐯', '🚀', '⭐'][Math.floor(Math.random() * 6)],
      level: Math.floor(Math.random() * 4) + 1,
      title: 'Prompt Explorer',
      xp: Math.floor(Math.random() * 300) + 120,
      streak: Math.floor(Math.random() * 7) + 1,
      lessonsCompleted: Math.floor(Math.random() * 3) + 1,
      isOnline: true,
      lastActive: 'Online now',
    };

    setFriends((prev) => [newFriend, ...prev]);
    return { success: true, message: `Added @${clean} as a friend!` };
  }, [friends]);

  const acceptRequest = useCallback((id: string) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      setFriends((prev) => [
        {
          id: `friend_${req.id}`,
          name: req.name,
          username: req.username,
          avatar: req.avatar,
          level: req.level,
          title: 'Neural Navigator',
          xp: Math.floor(Math.random() * 350) + 180,
          streak: Math.floor(Math.random() * 8) + 1,
          lessonsCompleted: Math.floor(Math.random() * 4) + 1,
          isOnline: true,
          lastActive: 'Online now',
        },
        ...prev,
      ]);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  }, [requests]);

  const declineRequest = useCallback((id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const sendRequest = useCallback((id: string) => {
    setSentRequests((prev) => [...prev, id]);
  }, []);

  const removeFriend = useCallback((id: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return {
    friends,
    requests,
    suggestions,
    sentRequests,
    addFriendByUsername,
    acceptRequest,
    declineRequest,
    sendRequest,
    removeFriend,
  };
}
