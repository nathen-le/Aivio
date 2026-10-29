import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { acceptFriendRequest, pairId, removeFriendRequest, removeFriendship, sendFriendRequest } from '../../src/lib/friends.ts';
import { client, closeAll, uniqueEmail } from './helpers.ts';

after(closeAll);

interface User { db: Firestore; uid: string }
async function makeUser(label: string): Promise<User> {
  const c = await client(uniqueEmail(label), true);
  const name = `${label}_${Math.random().toString(36).slice(2, 7)}`;
  await setDoc(doc(c.db, 'usernames', name), { uid: c.uid, createdAt: serverTimestamp() });
  await setDoc(doc(c.db, 'publicProfiles', c.uid), {
    uid: c.uid, displayName: label, username: name, avatarUrl: '/mascot-cat-avatar.png', schemaVersion: 1, updatedAt: serverTimestamp(),
  });
  return c;
}
const has = async (db: Firestore, col: string, id: string) => (await getDoc(doc(db, col, id))).exists();

test('send, duplicate send, then accept', async () => {
  const a = await makeUser('ca'), b = await makeUser('cb');
  assert.equal(await sendFriendRequest(a.db, a.uid, b.uid), 'sent');
  assert.equal(await sendFriendRequest(a.db, a.uid, b.uid), 'already-sent');
  assert.equal(await acceptFriendRequest(b.db, b.uid, a.uid), 'accepted');
  assert.equal(await sendFriendRequest(a.db, a.uid, b.uid), 'already-friends');
  assert.equal(await acceptFriendRequest(b.db, b.uid, a.uid), 'already-friends', 'double accept is reported truthfully');
  assert.equal(await has(a.db, 'friendRequests', pairId(a.uid, b.uid)), false);
});

test('sending to someone who already asked you completes the friendship', async () => {
  const a = await makeUser('cc'), b = await makeUser('cd');
  assert.equal(await sendFriendRequest(a.db, a.uid, b.uid), 'sent');
  assert.equal(await sendFriendRequest(b.db, b.uid, a.uid), 'accepted');
  assert.ok(await has(a.db, 'friendships', pairId(a.uid, b.uid)));
});

test('self request, missing profile, and a request that vanished', async () => {
  const a = await makeUser('ce'), b = await makeUser('cf');
  const ghost = await client(uniqueEmail('ghost'), true);
  assert.equal(await sendFriendRequest(a.db, a.uid, a.uid), 'self');
  await assert.rejects(sendFriendRequest(a.db, a.uid, ghost.uid));
  await sendFriendRequest(a.db, a.uid, b.uid);
  await removeFriendRequest(a.db, a.uid, b.uid); // sender cancels
  assert.equal(await acceptFriendRequest(b.db, b.uid, a.uid), 'request-gone');
  assert.equal(await has(b.db, 'friendships', pairId(a.uid, b.uid)), false);
});

test('crossing requests sent at the same moment end in one pending request or a friendship', async () => {
  for (let i = 0; i < 5; i++) {
    const a = await makeUser('cg'), b = await makeUser('ch');
    const results = await Promise.allSettled([
      sendFriendRequest(a.db, a.uid, b.uid),
      sendFriendRequest(b.db, b.uid, a.uid),
    ]);
    for (const r of results) assert.equal(r.status, 'fulfilled', 'neither user sees an error');
    const req = await has(a.db, 'friendRequests', pairId(a.uid, b.uid));
    const friends = await has(a.db, 'friendships', pairId(a.uid, b.uid));
    assert.ok(req !== friends || (!req && friends), 'exactly one of: pending request, friendship');
    assert.ok(!(req && friends));
  }
});

test('removing a friend, then asking again', async () => {
  const a = await makeUser('ci'), b = await makeUser('cj');
  await sendFriendRequest(a.db, a.uid, b.uid);
  await acceptFriendRequest(b.db, b.uid, a.uid);
  await removeFriendship(a.db, a.uid, b.uid);
  assert.equal(await has(b.db, 'friendships', pairId(a.uid, b.uid)), false);
  assert.equal(await sendFriendRequest(b.db, b.uid, a.uid), 'sent');
});
