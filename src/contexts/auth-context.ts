import { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface AuthContextValue {
  /** The signed-in Firebase user, or null when signed out. */
  user: User | null;
  /** True until the first onAuthStateChanged callback resolves. */
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  /**
   * Waits for unsaved progress to be confirmed before signing out. Rejects with
   * UnsavedProgressError if it cannot be saved; pass { force: true } to sign out
   * anyway (unsent changes stay in this browser's outbox for the next sign-in).
   */
  logout: (options?: { force?: boolean }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
