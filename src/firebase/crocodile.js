import {
  collection, doc, addDoc, deleteDoc, onSnapshot, orderBy, query, runTransaction, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config.js';
import { buildUserRewardPatch, OUTFIT_COINS_PER_HUB_PT, s2048DocRef } from './wallet.js';

export const CROCODILE_TEAM_BONUS_PTS = 8;
export const CROCODILE_TEAM_BONUS_COINS = CROCODILE_TEAM_BONUS_PTS * OUTFIT_COINS_PER_HUB_PT; // 800
export const CROCODILE_ACTOR_BONUS_PTS = CROCODILE_TEAM_BONUS_PTS;
export const CROCODILE_ACTOR_BONUS_COINS = CROCODILE_TEAM_BONUS_COINS;

const list = (s) => s.docs.map((d) => ({ id: d.id, ...d.data() }));
const noop = () => {};

export const subscribeCrocodilePhrases = (cb, onErr = noop) =>
  onSnapshot(query(collection(db, 'crocodilePhrases'), orderBy('createdAt', 'desc')), (s) => cb(list(s)), onErr);

export async function addCrocodilePhrase({ text, categoryId }) {
  const clean = String(text || '').trim().replace(/\s+/g, ' ').slice(0, 120);
  if (clean.length < 2) throw new Error('Write a word or phrase (at least 2 characters).');
  await addDoc(collection(db, 'crocodilePhrases'), {
    text: clean,
    categoryId: categoryId || 'erasmus',
    createdAt: serverTimestamp(),
  });
}

export const deleteCrocodilePhrase = (id) => deleteDoc(doc(db, 'crocodilePhrases', id));

/**
 * Automatically awards +8 Hub PTS (+800 Outfit Coins) ONCE per participant
 * listed in the Crocodile team roster. Participants who already claimed
 * their Crocodile bonus earlier are skipped and returned in `alreadyClaimedNames`.
 */
export async function awardCrocodileTeamBonus(userIds) {
  const uniqueIds = [...new Set((Array.isArray(userIds) ? userIds : []).filter(Boolean))];
  if (uniqueIds.length === 0) {
    return {
      awarded: false,
      pts: 0,
      coins: 0,
      names: [],
      alreadyClaimedNames: [],
      count: 0,
      alreadyCount: 0,
    };
  }

  return runTransaction(db, async (tx) => {
    const refs = uniqueIds.map((uid) => ({
      uid,
      uRef: doc(db, 'users', uid),
      sRef: s2048DocRef(uid),
    }));

    const snaps = await Promise.all(
      refs.map(async ({ uid, uRef, sRef }) => {
        const [uSnap, sSnap] = await Promise.all([tx.get(uRef), tx.get(sRef)]);
        return { uid, uRef, uSnap, sSnap };
      }),
    );

    const creditedNames = [];
    const alreadyClaimedNames = [];

    for (const { uid, uRef, uSnap, sSnap } of snaps) {
      if (!uSnap.exists()) continue;
      const data = uSnap.data();
      const name = data?.name || 'Participant';

      if (data?.crocodileBonusClaimed) {
        alreadyClaimedNames.push(name);
        continue;
      }

      const patch = {
        ...buildUserRewardPatch(data, sSnap, CROCODILE_TEAM_BONUS_PTS),
        crocodileBonusClaimed: true,
        crocodileBonusAt: serverTimestamp(),
      };
      tx.update(uRef, patch);
      tx.set(doc(collection(db, 'pointsLog')), {
        userId: uid,
        delta: CROCODILE_TEAM_BONUS_PTS,
        reason: '🐊 Crocodile team game (one-time bonus)',
        createdAt: serverTimestamp(),
      });
      creditedNames.push(name);
    }

    return {
      awarded: creditedNames.length > 0,
      pts: CROCODILE_TEAM_BONUS_PTS,
      coins: CROCODILE_TEAM_BONUS_COINS,
      names: creditedNames,
      alreadyClaimedNames,
      count: creditedNames.length,
      alreadyCount: alreadyClaimedNames.length,
    };
  });
}

/**
 * Automatically awards +8 Hub PTS (+800 Outfit Coins) ONCE to a single participant.
 */
export async function awardCrocodileActorBonus(userId) {
  if (!userId) return { awarded: false, alreadyClaimed: false, pts: 0, coins: 0 };
  const res = await awardCrocodileTeamBonus([userId]);
  if (res.count === 0 && res.alreadyCount > 0) {
    return {
      awarded: false,
      alreadyClaimed: true,
      pts: 0,
      coins: 0,
      name: res.alreadyClaimedNames[0] || 'Participant',
    };
  }
  if (!res.awarded) throw new Error('Participant account not found.');
  return {
    awarded: true,
    alreadyClaimed: false,
    pts: CROCODILE_TEAM_BONUS_PTS,
    coins: CROCODILE_TEAM_BONUS_COINS,
    name: res.names[0] || 'Participant',
  };
}
