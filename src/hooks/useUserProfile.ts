import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import {
  ProfileError,
  backfillMissingFields,
  buildDefaultProfile,
  createUserProfileIfMissing,
  fetchUserProfile,
  saveUserProfile,
} from '../lib/userProfile';
import type { EditableProfileFields, UserProfileDoc } from '../lib/userProfile';

export type { UserProfileDoc, EditableProfileFields };

export interface UseUserProfileResult {
  profile: UserProfileDoc | null;
  /** True while the signed-in user's document is being fetched. */
  loading: boolean;
  /** True while a save is in flight. */
  saving: boolean;
  /** Human-readable load or save failure, or null. */
  error: string | null;
  /** Flips true briefly after a successful save. */
  saved: boolean;
  saveProfile: (updates: Partial<EditableProfileFields>) => Promise<boolean>;
  clearStatus: () => void;
}

/**
 * Loads and saves the signed-in learner's Firestore profile.
 *
 * Deliberately has no localStorage cache: profiles are per-account, and a
 * shared browser key would show one learner's details to the next person who
 * signs in on the same device.
 */
export function useUserProfile(): UseUserProfileResult {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [profile, setProfile] = useState<UserProfileDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let doc = await fetchUserProfile(uid);

        // Heals an account whose document is missing (e.g. signup interrupted
        // after the auth user was created but before the profile write).
        if (!doc) {
          await createUserProfileIfMissing(uid, user?.email ?? '', user?.displayName ?? '');
          doc = await fetchUserProfile(uid);
        }

        // Documents written by an earlier schema version are topped up with
        // the fields they lack; existing values are never overwritten.
        if (doc) {
          doc = await backfillMissingFields(doc, user?.email ?? '');
        }

        if (!cancelled) {
          setProfile(doc ?? buildDefaultProfile(uid, user?.email ?? '', user?.displayName ?? ''));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        if (!cancelled) {
          setError('Could not load your profile. Check your connection and reload.');
          setProfile(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, user?.email, user?.displayName]);

  const clearStatus = useCallback(() => {
    setError(null);
    setSaved(false);
  }, []);

  const saveProfile = useCallback(
    async (updates: Partial<EditableProfileFields>): Promise<boolean> => {
      if (!uid || !profile) {
        setError('You need to be signed in to save your profile.');
        return false;
      }

      setSaving(true);
      setError(null);
      setSaved(false);

      try {
        const applied = await saveUserProfile(uid, updates, profile.username);

        // Merge rather than replace, so fields this save did not touch survive.
        setProfile((prev) => (prev ? { ...prev, ...applied } : prev));

        setSaved(true);
        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaved(false), 2500);
        return true;
      } catch (err) {
        if (err instanceof ProfileError) {
          setError(err.message);
        } else {
          console.error('Failed to save profile:', err);
          setError('Could not save your changes. Please try again.');
        }
        return false;
      } finally {
        setSaving(false);
      }
    },
    [uid, profile],
  );

  return { profile, loading, saving, error, saved, saveProfile, clearStatus };
}
