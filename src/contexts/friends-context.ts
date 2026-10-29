import { createContext } from 'react';
import type { PublicProfile } from '../lib/publicProfile';
import type { AcceptResult, SendResult } from '../lib/friends';

export interface PersonEntry {
  uid: string;
  /** Null while loading, or if the account has no public profile any more. */
  profile: PublicProfile | null;
}

export type Relation = 'self' | 'friend' | 'incoming' | 'outgoing' | 'none';

export interface ActionOutcome {
  ok: boolean;
  message: string;
}

export interface FriendsContextValue {
  status: 'loading' | 'ready' | 'error';
  friends: PersonEntry[];
  /** Requests other people sent to me. */
  incoming: PersonEntry[];
  /** Requests I sent that are still pending. */
  outgoing: PersonEntry[];
  relationOf: (uid: string) => Relation;
  /** UIDs with an operation in flight, so buttons can show progress and not double-fire. */
  busyUids: ReadonlySet<string>;
  sendRequest: (uid: string) => Promise<ActionOutcome>;
  sendRequestByUsername: (username: string) => Promise<ActionOutcome>;
  acceptRequest: (uid: string) => Promise<ActionOutcome>;
  declineRequest: (uid: string) => Promise<ActionOutcome>;
  cancelRequest: (uid: string) => Promise<ActionOutcome>;
  removeFriend: (uid: string) => Promise<ActionOutcome>;
  retry: () => void;
}

export const FriendsContext = createContext<FriendsContextValue | null>(null);

export type { AcceptResult, SendResult };
