import { collection, doc, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config.js';
import { COSTUME_BY_ID, nextCostumePrice } from '../config/costumes.js';

const fail = (code, message) => Object.assign(new Error(message), { code });

export function isCostumeUnlocked(costumeId, ownedCostumes = []) {
  const c = COSTUME_BY_ID.get(costumeId);
  if (!c) return false;
  if (c.free) return true;
  return Array.isArray(ownedCostumes) && ownedCostumes.includes(costumeId);
}

export async function saveMouseLook(userId, { costumeId = 'plain', bgColor = '#FFE600' }) {
  if (!userId) throw fail('noauth', 'Sign in first.');
  const costume = COSTUME_BY_ID.get(costumeId);
  if (!costume) throw fail('invalid', 'Unknown mouse costume.');

  const uRef = doc(db, 'users', userId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(uRef);
    if (!snap.exists()) throw fail('nouser', 'Account not found.');
    const u = snap.data();
    if (!isCostumeUnlocked(costumeId, u.ownedCostumes)) {
      throw fail('locked', 'Buy this costume first before equipping it!');
    }
    tx.update(uRef, {
      avatarCostume: costumeId,
      avatarBg: bgColor || '#FFE600',
      avatarUpdatedAt: serverTimestamp(),
    });
  });
}

export async function buyMouseCostume({ userId, costumeId, currency, bgColor = '#FFE600' }) {
  if (!userId) throw fail('noauth', 'Sign in first.');
  const costume = COSTUME_BY_ID.get(costumeId);
  if (!costume) throw fail('invalid', 'Unknown mouse costume.');
  if (costume.free) {
    await updateDoc(doc(db, 'users', userId), { avatarCostume: costumeId, avatarBg: bgColor });
    return { costume, price: 0, currency };
  }

  const uRef = doc(db, 'users', userId);
  const s2048Ref = doc(db, 'game2048Scores', userId);

  return runTransaction(db, async (tx) => {
    const [uSnap, s2048Snap] = await Promise.all([tx.get(uRef), tx.get(s2048Ref)]);
    if (!uSnap.exists()) throw fail('nouser', 'Account not found.');
    const u = uSnap.data();
    const owned = Array.isArray(u.ownedCostumes) ? u.ownedCostumes : [];
    if (owned.includes(costumeId)) {
      tx.update(uRef, { avatarCostume: costumeId, avatarBg: bgColor });
      return { costume, price: 0, currency, alreadyOwned: true };
    }

    const price = nextCostumePrice(owned.length);
    const nextOwned = [...owned, costumeId];

    if (currency === 'game2048') {
      const currentWallet =
        typeof u.game2048Points === 'number'
          ? u.game2048Points
          : s2048Snap.exists()
            ? Number(s2048Snap.data().bestScore) || 0
            : 0;
      if (currentWallet < price.game2048) {
        throw fail('funds', `You need ${price.game2048.toLocaleString('en-US')} Outfit Coins (you have ${currentWallet.toLocaleString('en-US')}).`);
      }
      tx.update(uRef, {
        game2048Points: currentWallet - price.game2048,
        ownedCostumes: nextOwned,
        avatarCostume: costumeId,
        avatarBg: bgColor,
        avatarUpdatedAt: serverTimestamp(),
      });
      return { costume, price: price.game2048, currency: 'game2048' };
    }

    // Default: Hub Points (PTS)
    const currentScore = Number(u.score);
    if (!Number.isFinite(currentScore) || currentScore < price.pts) {
      throw fail('funds', `You need ${price.pts} PTS to unlock this outfit.`);
    }
    tx.update(uRef, {
      score: currentScore - price.pts,
      ownedCostumes: nextOwned,
      avatarCostume: costumeId,
      avatarBg: bgColor,
      avatarUpdatedAt: serverTimestamp(),
    });
    tx.set(doc(collection(db, 'pointsLog')), {
      userId,
      delta: -price.pts,
      reason: `🐭 Mouse wardrobe: ${costume.name}`,
      createdAt: serverTimestamp(),
    });
    return { costume, price: price.pts, currency: 'pts' };
  });
}
