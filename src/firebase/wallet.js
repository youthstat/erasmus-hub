import { doc, increment } from 'firebase/firestore';
import { db } from './config.js';

export const OUTFIT_COINS_PER_HUB_PT = 100;

/**
 * Computes the safe Firestore user update patch when crediting `deltaPts` Hub points.
 * Whenever `deltaPts > 0`, ALSO awards `deltaPts * 100` Outfit Coins (`game2048Points`),
 * preserving any existing `game2048Scores/{userId}.bestScore` fallback so historical balances are never overwritten.
 */
export function buildUserRewardPatch(userData, s2048Snap, deltaPts) {
  const amt = Number(deltaPts) || 0;
  const patch = { score: increment(amt) };
  if (amt > 0) {
    const coinsToAdd = Math.round(amt * OUTFIT_COINS_PER_HUB_PT);
    if (coinsToAdd > 0) {
      const fallback = s2048Snap?.exists?.() ? Number(s2048Snap.data()?.bestScore) || 0 : 0;
      const curWallet = typeof userData?.game2048Points === 'number' ? userData.game2048Points : fallback;
      patch.game2048Points = curWallet + coinsToAdd;
    }
  }
  return patch;
}

export const s2048DocRef = (userId) => doc(db, 'game2048Scores', userId);
