import {
  collection, doc, onSnapshot, runTransaction, serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from './config.js';

const noop = () => {};

export const MAX_STOP_ATTEMPTS = 3;

export const EMPTY_ERASMUS_PROGRESS = {
  games: {},
  totalEarned: 0,
  updatedAt: null,
};

const parseProgress = (d = {}) => ({
  games: d.games && typeof d.games === 'object' ? d.games : {},
  totalEarned: Number(d.totalEarned) || 0,
  updatedAt: d.updatedAt || null,
});

export const subscribeErasmusProgress = (userId, cb, onErr = noop) => {
  if (!userId) {
    cb(EMPTY_ERASMUS_PROGRESS);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'erasmusProgress', userId),
    (snap) => {
      if (!snap.exists()) {
        cb(EMPTY_ERASMUS_PROGRESS);
        return;
      }
      cb(parseProgress(snap.data() || {}));
    },
    onErr,
  );
};

export const subscribeAllErasmusProgress = (cb, onErr = noop) =>
  onSnapshot(
    collection(db, 'erasmusProgress'),
    (snap) => {
      const map = new Map();
      snap.docs.forEach((d) => {
        map.set(d.id, parseProgress(d.data() || {}));
      });
      cb(map);
    },
    onErr,
  );

/**
 * Records a participant's score for Stops 1–4 & 6–9 (max 3 attempts per block).
 * Immediately credits any improvement (`improved > 0`) straight into `users/{userId}.score`.
 */
export async function recordErasmusGameScore({
  userId,
  stopId,
  title,
  competenceKey,
  score,
  maxPoints,
  details = null,
}) {
  const cleanScore = Math.max(0, Math.min(Number(maxPoints) || 0, Math.round(Number(score) || 0)));
  if (!userId) {
    return { saved: false, improved: 0, best: cleanScore, totalEarned: cleanScore, attempts: 1, maxReached: false };
  }

  let improved = 0;
  let newBest = cleanScore;
  let totalEarned = 0;
  let attempts = 0;
  let maxReached = false;

  await runTransaction(db, async (tx) => {
    const pRef = doc(db, 'erasmusProgress', userId);
    const uRef = doc(db, 'users', userId);
    const [pSnap, uSnap] = await Promise.all([tx.get(pRef), tx.get(uRef)]);

    const data = pSnap.exists() ? (pSnap.data() || {}) : {};
    const prevGames = data.games && typeof data.games === 'object' ? { ...data.games } : {};
    const prevEntry = prevGames[stopId] || {};
    const prevAttempts = Number(prevEntry.attempts) || 0;
    const prevBest = Number(prevEntry.best) || 0;

    if (prevAttempts >= MAX_STOP_ATTEMPTS) {
      maxReached = true;
      attempts = prevAttempts;
      newBest = prevBest;
      totalEarned = Math.min(
        100,
        Object.values(prevGames).reduce((sum, g) => sum + (Number(g?.best) || 0), 0),
      );
      return;
    }

    attempts = prevAttempts + 1;
    newBest = Math.max(prevBest, cleanScore);
    improved = Math.max(0, newBest - prevBest);

    prevGames[stopId] = {
      stopId,
      title,
      competenceKey,
      best: newBest,
      lastScore: cleanScore,
      maxPoints,
      attempts,
      completedAt: new Date().toISOString(),
      ...(details ? { details } : {}),
    };

    totalEarned = Math.min(
      100,
      Object.values(prevGames).reduce((sum, g) => sum + (Number(g?.best) || 0), 0),
    );

    tx.set(
      pRef,
      {
        userId,
        games: prevGames,
        totalEarned,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (improved > 0 && uSnap.exists()) {
      tx.update(uRef, { score: increment(improved) });
      tx.set(doc(collection(db, 'pointsLog')), {
        userId,
        delta: improved,
        reason: `Erasmus+: ${title}`,
        createdAt: serverTimestamp(),
      });
    }
  });

  return { saved: !maxReached, maxReached, attempts, improved, best: newBest, totalEarned };
}

/**
 * Reserves one of the 3 allowed attempts when starting a Stop 5 Adventure Board run,
 * preventing page-refresh farming of +500 Outfit Coins.
 */
export async function beginStop5Run({ userId, title, competenceKey, maxPoints }) {
  if (!userId) return { allowed: true, attempts: 1, maxReached: false };

  let allowed = false;
  let attempts = 0;

  await runTransaction(db, async (tx) => {
    const pRef = doc(db, 'erasmusProgress', userId);
    const pSnap = await tx.get(pRef);
    const data = pSnap.exists() ? (pSnap.data() || {}) : {};
    const prevGames = data.games && typeof data.games === 'object' ? { ...data.games } : {};
    const prevEntry = prevGames[5] || {};
    const prevAttempts = Number(prevEntry.attempts) || 0;

    if (prevAttempts >= MAX_STOP_ATTEMPTS) {
      allowed = false;
      attempts = prevAttempts;
      return;
    }

    allowed = true;
    attempts = prevAttempts + 1;
    prevGames[5] = {
      stopId: 5,
      title,
      competenceKey,
      best: Number(prevEntry.best) || 0,
      lastScore: Number(prevEntry.lastScore) || 0,
      maxPoints,
      attempts,
      startedAt: new Date().toISOString(),
    };

    const totalEarned = Math.min(
      100,
      Object.values(prevGames).reduce((sum, g) => sum + (Number(g?.best) || 0), 0),
    );

    tx.set(
      pRef,
      {
        userId,
        games: prevGames,
        totalEarned,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  return { allowed, attempts, maxReached: !allowed };
}

/**
 * Live Extra Points / Wardrobe Coins on Stop 5 tiles:
 * - Credits `outfitCoins` (e.g. +500 from Mission/Reflection tiles) into `users/{userId}.game2048Points`
 * - Credits `extraHubPts` (e.g. +5 from the 10 Question tiles) into `users/{userId}.score` + `pointsLog`
 * - NEVER modifies `erasmusProgress/{userId}` so Extra Points stay strictly outside Erasmus+ Challenge total.
 */
export async function awardStop5ExtraReward({
  userId,
  outfitCoins = 0,
  extraHubPts = 0,
  reason = '',
}) {
  if (!userId) return { newScore: 0, newWallet: 0 };

  let newScore = 0;
  let newWallet = 0;

  await runTransaction(db, async (tx) => {
    const uRef = doc(db, 'users', userId);
    const s2048Ref = doc(db, 'game2048Scores', userId);
    const [uSnap, s2048Snap] = await Promise.all([tx.get(uRef), tx.get(s2048Ref)]);

    if (!uSnap.exists()) return;
    const u = uSnap.data() || {};

    const curHub = Number(u.score) || 0;
    const cleanHub = Math.max(0, Math.round(Number(extraHubPts) || 0));
    newScore = curHub + cleanHub;

    const fallback2048 = s2048Snap.exists() ? Number(s2048Snap.data()?.bestScore) || 0 : 0;
    const curWallet = typeof u.game2048Points === 'number' ? u.game2048Points : fallback2048;
    const cleanCoins = Math.max(0, Math.round(Number(outfitCoins) || 0));
    newWallet = curWallet + cleanCoins;

    const userPatch = {};
    if (cleanCoins > 0) userPatch.game2048Points = newWallet;
    if (cleanHub > 0) userPatch.score = newScore;
    if (Object.keys(userPatch).length > 0) tx.update(uRef, userPatch);

    if (cleanHub > 0 && reason) {
      tx.set(doc(collection(db, 'pointsLog')), {
        userId,
        delta: cleanHub,
        reason,
        createdAt: serverTimestamp(),
      });
    }
  });

  return { newScore, newWallet };
}

/**
 * Records Stop 5 completion (reaching Square 60) inside `erasmusProgress/{userId}.games[5]`
 * without double-counting `attempts` (already incremented by `beginStop5Run`),
 * and credits any improved Erasmus+ Stop 5 points into `users/{userId}.score`.
 */
export async function completeStop5Challenge({
  userId,
  title = 'Exchange Journey',
  competenceKey = 'personal',
  score = 8,
  maxPoints = 8,
}) {
  const cleanScore = Math.max(0, Math.min(Number(maxPoints) || 8, Math.round(Number(score) || 0)));
  if (!userId) {
    return { saved: false, improved: 0, best: cleanScore, totalEarned: cleanScore, attempts: 1, maxReached: false };
  }

  let improved = 0;
  let newBest = cleanScore;
  let totalEarned = 0;
  let attempts = 1;

  await runTransaction(db, async (tx) => {
    const pRef = doc(db, 'erasmusProgress', userId);
    const uRef = doc(db, 'users', userId);
    const [pSnap, uSnap] = await Promise.all([tx.get(pRef), tx.get(uRef)]);

    const data = pSnap.exists() ? (pSnap.data() || {}) : {};
    const prevGames = data.games && typeof data.games === 'object' ? { ...data.games } : {};
    const prevEntry = prevGames[5] || {};
    attempts = Math.max(1, Number(prevEntry.attempts) || 1);
    const prevBest = Number(prevEntry.best) || 0;

    newBest = Math.max(prevBest, cleanScore);
    improved = Math.max(0, newBest - prevBest);

    prevGames[5] = {
      stopId: 5,
      title,
      competenceKey,
      best: newBest,
      lastScore: cleanScore,
      maxPoints,
      attempts,
      completedAt: new Date().toISOString(),
    };

    totalEarned = Math.min(
      100,
      Object.values(prevGames).reduce((sum, g) => sum + (Number(g?.best) || 0), 0),
    );

    tx.set(
      pRef,
      {
        userId,
        games: prevGames,
        totalEarned,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (improved > 0 && uSnap.exists()) {
      tx.update(uRef, { score: increment(improved) });
      tx.set(doc(collection(db, 'pointsLog')), {
        userId,
        delta: improved,
        reason: `Erasmus+: ${title}`,
        createdAt: serverTimestamp(),
      });
    }
  });

  return { saved: true, maxReached: false, attempts, improved, best: newBest, totalEarned };
}
