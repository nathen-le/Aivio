import { initializeApp, getApp, getApps } from 'firebase/app';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

/**
 * Single Firebase entry point for the app. Import `auth` / `db` from here and
 * never call initializeApp anywhere else, so one app instance is shared across
 * hot reloads and every consumer.
 *
 * These VITE_ values are inlined into the client bundle at build time and are
 * public by design. They identify the project, they do not protect it — access
 * control lives in the Firestore security rules and in the API key's domain
 * restrictions.
 */

const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

function readConfig(): FirebaseOptions {
  const env = import.meta.env as Record<string, string | undefined>;

  const missing = REQUIRED_ENV_VARS.filter((key) => {
    const value = env[key];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missing.length > 0) {
    const where = import.meta.env.DEV
      ? 'Add them to .env.local in the project root (copy .env.example), then restart `npm run dev` — Vite only reads env files at startup.'
      : 'Set them in the Netlify site environment variables and redeploy — Vite inlines them at build time, so an existing build will not pick them up.';

    throw new Error(
      `Firebase is not configured. Missing or empty: ${missing.join(', ')}. ${where}`,
    );
  }

  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
}

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(readConfig());

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
