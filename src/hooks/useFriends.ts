import { useContext } from 'react';
import { FriendsContext } from '../contexts/friends-context';
import type { FriendsContextValue } from '../contexts/friends-context';

export type { PersonEntry, Relation, ActionOutcome } from '../contexts/friends-context';

/** The signed-in learner's real friends, requests and actions (Firestore-backed). */
export function useFriends(): FriendsContextValue {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error('useFriends must be used inside <FriendsProvider>');
  return ctx;
}
