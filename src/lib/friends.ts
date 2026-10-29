import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

/**
 * Friendship data model (enforced by firestore.rules, not just by this code):
 *
 *   friendRequests/{smallerUid}_{largerUid}  { fromUid, toUid, createdAt }
 *   friendships/{smallerUid}_{largerUid}     { members: [smallerUid, largerUid], createdAt }
 *
 * Both IDs are the sorted pair, so a pair of people can never hold two
 * requests or two friendships, whoever acts first and however often they retry.
 */
export const pairId = (a: string, b: string) => (a < b ? `${a}_${b}` : `${b}_${a}`);

const requestRef = (db: Firestore, a: string, b: string) => doc(db, 'friendRequests', pairId(a, b));
const friendshipRef = (db: Firestore, a: string, b: string) => doc(db, 'friendships', pairId(a, b));

export type SendResult =
  | 'sent'
  | 'accepted' // they had already asked us, so this completed the friendship
  | 'already-friends'
  | 'already-sent'
  | 'self';

export type AcceptResult = 'accepted' | 'already-friends' | 'request-gone';

const isDenied = (e: unknown) => (e as { code?: string } | null)?.code === 'permission-denied';

/**
 * Accepts the request `fromUid` sent to `me`. The friendship is created and
 * the request consumed in ONE atomic batch; the rules refuse either half alone
 * and refuse anyone but the recipient.
 */
export async function acceptFriendRequest(db: Firestore, me: string, fromUid: string): Promise<AcceptResult> {
  const [a, b] = [me, fromUid].sort();
  try {
    const batch = writeBatch(db);
    batch.set(friendshipRef(db, me, fromUid), { members: [a, b], createdAt: serverTimestamp() });
    batch.delete(requestRef(db, me, fromUid));
    await batch.commit();
    return 'accepted';
  } catch (error) {
    if (!isDenied(error)) throw error;
    // Denied means the request vanished (cancelled/declined) or the friendship
    // already exists (double click, second tab). Report which, never "success".
    if ((await getDoc(friendshipRef(db, me, fromUid))).exists()) return 'already-friends';
    return 'request-gone';
  }
}

export async function sendFriendRequest(db: Firestore, me: string, toUid: string): Promise<SendResult> {
  if (me === toUid) return 'self';

  const classify = async (): Promise<SendResult | null> => {
    const [friendship, request] = await Promise.all([
      getDoc(friendshipRef(db, me, toUid)),
      getDoc(requestRef(db, me, toUid)),
    ]);
    if (friendship.exists()) return 'already-friends';
    if (request.exists()) {
      // They asked first (or crossed with us): treat our intent as acceptance.
      if (request.data().fromUid === toUid) {
        const result = await acceptFriendRequest(db, me, toUid);
        return result === 'request-gone' ? null : 'accepted';
      }
      return 'already-sent';
    }
    return null;
  };

  const existing = await classify();
  if (existing) return existing;

  try {
    await setDoc(requestRef(db, me, toUid), { fromUid: me, toUid, createdAt: serverTimestamp() });
    return 'sent';
  } catch (error) {
    if (!isDenied(error)) throw error;
    // Lost a race with a crossing request or a duplicate: re-read and report truthfully.
    const after = await classify();
    if (after) return after;
    throw error;
  }
}

/** The recipient declines, or the sender cancels. Deleting twice is harmless. */
export async function removeFriendRequest(db: Firestore, me: string, otherUid: string): Promise<void> {
  await deleteDoc(requestRef(db, me, otherUid));
}

export async function removeFriendship(db: Firestore, me: string, friendUid: string): Promise<void> {
  await deleteDoc(friendshipRef(db, me, friendUid));
}
