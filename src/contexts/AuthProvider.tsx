import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfileIfMissing } from '../lib/userProfile';
import { AuthContext } from './auth-context';
import { flushPendingSaves, UnsavedProgressError } from '../lib/pendingSaves';

/**
 * Owns Firebase auth state for the whole app.
 *
 * Credentials are passed straight to the Firebase SDK and never stored,
 * cached or logged by this app. Only error codes are logged, never the
 * email/password that produced them.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fires once on load with the restored session (or null), then on every
    // sign-in/sign-out. The first call is what clears `loading`.
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state listener failed:', error.message);
        setUser(null);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const trimmedName = displayName.trim();

      if (trimmedName) {
        await updateProfile(credential.user, { displayName: trimmedName });
      }

      // The auth account already exists at this point, so a failed profile
      // write must not surface as "registration failed" — that would send the
      // learner back to a signup form for an account they already hold.
      // useUserProfile heals a missing document on the next profile load.
      try {
        await createUserProfileIfMissing(
          credential.user.uid,
          credential.user.email ?? email,
          trimmedName,
        );
      } catch (error) {
        console.error(
          'Account created, but the profile document could not be written yet:',
          error instanceof Error ? error.message : error,
        );
      }

      // onAuthStateChanged already fired with this user and set state; the
      // updateProfile call above mutates that same instance in place.
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async (options?: { force?: boolean }) => {
    if (!options?.force && !(await flushPendingSaves())) {
      throw new UnsavedProgressError();
    }
    await signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const value = useMemo(
    () => ({ user, loading, register, login, logout, resetPassword }),
    [user, loading, register, login, logout, resetPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
