import { initializeApp, deleteApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

let counter = 0;
const apps: FirebaseApp[] = [];

/** A fresh SDK client ("browser tab") signed in as the given account. */
export async function client(email: string, create = false): Promise<{ db: Firestore; uid: string }> {
  const app = initializeApp({ apiKey: 'fake', projectId: 'demo-aivio', authDomain: 'localhost' }, `t${counter++}`);
  apps.push(app);
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  const db = getFirestore(app);
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const cred = create
    ? await createUserWithEmailAndPassword(auth, email, 'test-password-123')
    : await signInWithEmailAndPassword(auth, email, 'test-password-123');
  return { db, uid: cred.user.uid };
}

export function trackApp(app: FirebaseApp) {
  apps.push(app);
}

export async function closeAll() {
  await Promise.all(apps.map((a) => deleteApp(a)));
}

export const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.dev`;
