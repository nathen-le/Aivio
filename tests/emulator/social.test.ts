import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import {
  collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { client, closeAll, trackApp, uniqueEmail } from './helpers.ts';

after(closeAll);

interface User { db: Firestore; uid: string; name: string }
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
let anonCount = 0;
function unauthenticatedDb(): Firestore {
  const app = initializeApp({ projectId: 'demo-aivio', apiKey: 'fake' }, `anon${anonCount++}`);
  trackApp(app);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  return db;
}
const rnd = () => Math.random().toString(36).slice(2, 8);

async function makeUser(label: string, publish = true): Promise<User> {
  const c = await client(uniqueEmail(label), true);
  const name = `${label}_${rnd()}`;
  const u = { ...c, name };
  if (publish) await publishProfile(u, name);
  return u;
}

async function publishProfile(u: User, username: string, extra: Record<string, unknown> = {}) {
  await setDoc(doc(u.db, 'usernames', username), { uid: u.uid, createdAt: serverTimestamp() });
  await setDoc(doc(u.db, 'publicProfiles', u.uid), {
    uid: u.uid, displayName: `Name ${username}`, username, avatarUrl: '/mascot-cat-avatar.png',
    schemaVersion: 1, updatedAt: serverTimestamp(), ...extra,
  });
}

const pair = (a: string, b: string) => (a < b ? `${a}_${b}` : `${b}_${a}`);
const reqId = pair;
const sendRequest = (from: User, toUid: string, fromUid = from.uid) =>
  setDoc(doc(from.db, 'friendRequests', pair(fromUid, toUid)), { fromUid, toUid, createdAt: serverTimestamp() });
const accept = (me: User, fromUid: string, deleteRequest = true) => {
  const b = writeBatch(me.db);
  b.set(doc(me.db, 'friendships', pair(me.uid, fromUid)), { members: [me.uid, fromUid].sort(), createdAt: serverTimestamp() });
  if (deleteRequest) b.delete(doc(me.db, 'friendRequests', pair(fromUid, me.uid)));
  return b.commit();
};
const exists = async (db: Firestore, ...path: string[]) => (await getDoc(doc(db, path[0], ...path.slice(1)))).exists();

test('public profile: only the owner may write it, and only allowlisted fields', async () => {
  const a = await makeUser('a');
  const b = await makeUser('b');
  const base = { uid: a.uid, displayName: 'A', username: a.name, avatarUrl: '/mascot-cat-avatar.png', schemaVersion: 1, updatedAt: serverTimestamp() };
  await assert.rejects(setDoc(doc(b.db, 'publicProfiles', a.uid), base), 'another user writing my profile');
  await assert.rejects(setDoc(doc(a.db, 'publicProfiles', a.uid), { ...base, email: 'a@x.com' }), 'extra private field');
  await assert.rejects(setDoc(doc(a.db, 'publicProfiles', a.uid), { ...base, bio: 'private' }), 'bio is not public');
  await assert.rejects(setDoc(doc(a.db, 'publicProfiles', a.uid), { ...base, username: b.name }), "someone else's username");
  await assert.rejects(setDoc(doc(a.db, 'publicProfiles', a.uid), { ...base, username: 'unreserved_name' }), 'unreserved username');
  await assert.rejects(setDoc(doc(a.db, 'publicProfiles', a.uid), { ...base, avatarUrl: 'https://evil.example/x.png' }), 'external avatar');
  await assert.rejects(setDoc(doc(a.db, 'publicProfiles', a.uid), { ...base, uid: b.uid }), 'impersonating uid');
  await setDoc(doc(a.db, 'publicProfiles', a.uid), { ...base, displayName: 'Renamed' });
  await assert.rejects(deleteDoc(doc(a.db, 'publicProfiles', a.uid)), 'deleting is denied');
});

test('public profile: readable by signed-in users, list requires a limit, signed-out denied', async () => {
  const a = await makeUser('reader');
  const b = await makeUser('listed');
  assert.ok((await getDoc(doc(a.db, 'publicProfiles', b.uid))).exists());
  const page = await getDocs(query(collection(a.db, 'publicProfiles'), where('username', '>', ''), orderBy('username'), limit(10)));
  assert.ok(page.size >= 2);
  const fields = new Set(page.docs.flatMap((d) => Object.keys(d.data())));
  assert.deepEqual([...fields].sort(), ['avatarUrl', 'displayName', 'schemaVersion', 'uid', 'updatedAt', 'username']);
  await assert.rejects(getDocs(query(collection(a.db, 'publicProfiles'), orderBy('username'))), 'unbounded list');
  await assert.rejects(getDocs(query(collection(a.db, 'publicProfiles'), limit(500))), 'oversized list');
  await assert.rejects(getDoc(doc(unauthenticatedDb(), 'publicProfiles', b.uid)), 'signed-out read');
  await assert.rejects(getDocs(query(collection(unauthenticatedDb(), 'publicProfiles'), limit(5))), 'signed-out list');
});

test('private data stays private', async () => {
  const a = await makeUser('priv_a');
  const b = await makeUser('priv_b');
  await setDoc(doc(a.db, 'users', a.uid, 'progress', 'state'), {}).catch(() => undefined);
  await assert.rejects(getDoc(doc(b.db, 'users', a.uid)), 'private profile of someone else');
  await assert.rejects(getDocs(collection(b.db, 'users')), 'listing users');
  await assert.rejects(getDoc(doc(b.db, 'users', a.uid, 'progress', 'state')), "someone else's progress");
});

test('friend requests: create rules', async () => {
  const a = await makeUser('req_a');
  const b = await makeUser('req_b');
  const c = await makeUser('req_c');
  const ghost = await makeUser('ghost', false); // signed up but never published a profile

  await assert.rejects(sendRequest(a, a.uid), 'request to myself');
  await assert.rejects(sendRequest(a, b.uid, c.uid), 'forged sender uid');
  await assert.rejects(sendRequest(c, b.uid, a.uid), 'sending as someone else');
  await assert.rejects(sendRequest(a, ghost.uid), 'recipient has no public profile');
  await assert.rejects(sendRequest(ghost, a.uid), 'sender has no public profile');
  await assert.rejects(setDoc(doc(a.db, 'friendRequests', 'wrong_id'), { fromUid: a.uid, toUid: b.uid, createdAt: serverTimestamp() }), 'non-deterministic id');
  await assert.rejects(setDoc(doc(a.db, 'friendRequests', reqId(a.uid, b.uid)), { fromUid: a.uid, toUid: b.uid, createdAt: serverTimestamp(), status: 'accepted' }), 'extra field');

  await sendRequest(a, b.uid);
  await assert.rejects(sendRequest(a, b.uid), 'duplicate pending request');
  await assert.rejects(sendRequest(b, a.uid), 'reverse request while one is pending');
  await assert.rejects(updateDoc(doc(a.db, 'friendRequests', reqId(a.uid, b.uid)), { toUid: c.uid }), 'update');
});

test('friend requests: only the two people involved can see them', async () => {
  const a = await makeUser('vis_a');
  const b = await makeUser('vis_b');
  const c = await makeUser('vis_c');
  await sendRequest(a, b.uid);
  const incoming = await getDocs(query(collection(b.db, 'friendRequests'), where('toUid', '==', b.uid)));
  const outgoing = await getDocs(query(collection(a.db, 'friendRequests'), where('fromUid', '==', a.uid)));
  assert.equal(incoming.size, 1);
  assert.equal(outgoing.size, 1);
  await assert.rejects(getDoc(doc(c.db, 'friendRequests', reqId(a.uid, b.uid))), 'third party get');
  await assert.rejects(getDocs(query(collection(c.db, 'friendRequests'), where('toUid', '==', b.uid))), 'third party query');
  await assert.rejects(getDocs(collection(c.db, 'friendRequests')), 'unfiltered list');
  await assert.rejects(deleteDoc(doc(c.db, 'friendRequests', reqId(a.uid, b.uid))), 'third party delete');
});

test('accepting: only the recipient, only with a request, only atomically', async () => {
  const a = await makeUser('acc_a');
  const b = await makeUser('acc_b');
  const c = await makeUser('acc_c');
  await sendRequest(a, b.uid);

  await assert.rejects(accept(a, b.uid), 'sender cannot accept their own request');
  await assert.rejects(accept(c, a.uid), 'a stranger cannot accept');
  await assert.rejects(accept(b, a.uid, false), 'friendship without consuming the request');
  const forced = writeBatch(c.db);
  forced.set(doc(c.db, 'friendships', pair(a.uid, b.uid)), { members: [a.uid, b.uid].sort(), createdAt: serverTimestamp() });
  await assert.rejects(forced.commit(), 'third party forcing a friendship');
  assert.equal(await exists(a.db, 'friendships', pair(a.uid, b.uid)), false);

  await accept(b, a.uid);
  assert.equal(await exists(a.db, 'friendships', pair(a.uid, b.uid)), true, 'sender sees it');
  assert.equal(await exists(b.db, 'friendships', pair(a.uid, b.uid)), true, 'recipient sees it');
  assert.equal(await exists(b.db, 'friendRequests', reqId(a.uid, b.uid)), false, 'request consumed');
  await assert.rejects(getDoc(doc(c.db, 'friendships', pair(a.uid, b.uid))), 'third party cannot see it');
  await assert.rejects(accept(b, a.uid), 'second accept (no request left)');
  await assert.rejects(sendRequest(a, b.uid), 'request to an existing friend');
  await assert.rejects(sendRequest(b, a.uid), 'reverse request to an existing friend');
});

test('friendship removal: members only, and a new request is possible afterwards', async () => {
  const a = await makeUser('rm_a');
  const b = await makeUser('rm_b');
  const c = await makeUser('rm_c');
  await sendRequest(a, b.uid);
  await accept(b, a.uid);
  await assert.rejects(deleteDoc(doc(c.db, 'friendships', pair(a.uid, b.uid))), 'stranger removing');
  await assert.rejects(updateDoc(doc(a.db, 'friendships', pair(a.uid, b.uid)), { members: [a.uid, c.uid] }), 'friendship update');
  await deleteDoc(doc(a.db, 'friendships', pair(a.uid, b.uid)));
  assert.equal(await exists(b.db, 'friendships', pair(a.uid, b.uid)), false);
  await sendRequest(b, a.uid);
});

test('decline and cancel: recipient or sender only', async () => {
  const a = await makeUser('dc_a');
  const b = await makeUser('dc_b');
  const c = await makeUser('dc_c');
  await sendRequest(a, b.uid);
  await assert.rejects(deleteDoc(doc(c.db, 'friendRequests', reqId(a.uid, b.uid))));
  await deleteDoc(doc(b.db, 'friendRequests', reqId(a.uid, b.uid))); // decline
  await sendRequest(a, b.uid);
  await deleteDoc(doc(a.db, 'friendRequests', reqId(a.uid, b.uid))); // cancel
  assert.equal(await exists(a.db, 'friendRequests', reqId(a.uid, b.uid)), false);
});

test('simultaneous mutual requests: exactly one request survives', async () => {
  for (let i = 0; i < 5; i++) {
    const a = await makeUser('mut_a');
    const b = await makeUser('mut_b');
    const results = await Promise.allSettled([sendRequest(a, b.uid), sendRequest(b, a.uid)]);
    const ok = results.filter((r) => r.status === 'fulfilled').length;
    assert.equal(ok, 1, 'one of the two crossing requests must be refused');
  }
});

test('concurrent accept vs cancel vs duplicate accept always ends consistent', async () => {
  for (let i = 0; i < 6; i++) {
    const a = await makeUser('race_a');
    const b = await makeUser('race_b');
    await sendRequest(a, b.uid);
    await Promise.allSettled([
      accept(b, a.uid),
      accept(b, a.uid), // double click / second tab
      deleteDoc(doc(a.db, 'friendRequests', reqId(a.uid, b.uid))), // sender cancels meanwhile
    ]);
    const friend = await exists(a.db, 'friendships', pair(a.uid, b.uid));
    const pending = await exists(a.db, 'friendRequests', reqId(a.uid, b.uid));
    assert.equal(pending, false, 'request must never survive an accept/cancel race');
    const friends = await getDocs(query(collection(a.db, 'friendships'), where('members', 'array-contains', a.uid)));
    assert.equal(friends.size, friend ? 1 : 0, 'at most one friendship document');
  }
});

test('username search for friends works through the public directory only', async () => {
  const a = await makeUser('find_a');
  const b = await makeUser('find_b');
  const hit = await getDocs(query(collection(a.db, 'publicProfiles'), where('username', '==', b.name), limit(1)));
  assert.equal(hit.size, 1);
  assert.equal(hit.docs[0].id, b.uid);
});
