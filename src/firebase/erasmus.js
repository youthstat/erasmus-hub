import {
  collection, doc, onSnapshot, runTransaction, serverTimestamp, increment, setDoc,
} from 'firebase/firestore';
import { db } from './config.js';

const noop = () => {};

export const EMPTY_ERASMUS_PROGRESS = {
  games: {},
  totalEarned: 0,
  ratingClaimed: false,
  claimedPoints: 0,
  claimedAt: null,
  updatedAt: null,
};

const parseProgress = (d = {}) => ({
  games: d.games && typeof d.games === 'object' ? d.games : {},
  totalEarned: Number(d.totalEarned) || 0,
  ratingClaimed: !!d.ratingClaimed,
  claimedPoints: Number(d.claimedPoints) || 0,
  claimedAt: d.claimedAt || null,
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

export const subscribeErasmusSettings = (cb, onErr = noop) =>
  onSnapshot(
    doc(db, 'settings', 'erasmus'),
    (snap) => {
      const d = snap.exists() ? snap.data() || {} : {};
      cb({
        claimOpen: !!d.claimOpen,
        updatedAt: d.updatedAt || null,
      });
    },
    onErr,
  );

export const setErasmusClaimOpen = (claimOpen) =>
  setDoc(
    doc(db, 'settings', 'erasmus'),
    { claimOpen: !!claimOpen, updatedAt: serverTimestamp() },
    { merge: true },
  );

/**
 * Records a participant's score for one of the 9 Erasmus+ stops.
 * Automatically updates `erasmusProgress/{userId}.totalEarned` (0..100) as best scores improve.
 * Does NOT credit `users/{userId}.score` immediately — participants transfer their total once
 * via the admin-gated "Send points to rating" button.
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
    return { saved: false, improved: 0, best: cleanScore, totalEarned: cleanScore };
  }

  let improved = 0;
  let newBest = cleanScore;
  let totalEarned = 0;
  let ratingClaimed = false;

  await runTransaction(db, async (tx) => {
    const pRef = doc(db, 'erasmusProgress', userId);
    const pSnap = await tx.get(pRef);

    const data = pSnap.exists() ? (pSnap.data() || {}) : {};
    ratingClaimed = !!data.ratingClaimed;
    const prevGames = data.games && typeof data.games === 'object' ? { ...data.games } : {};
    const prevEntry = prevGames[stopId] || {};
    const prevBest = Number(prevEntry.best) || 0;
    newBest = Math.max(prevBest, cleanScore);
    improved = Math.max(0, newBest - prevBest);

    prevGames[stopId] = {
      stopId,
      title,
      competenceKey,
      best: newBest,
      lastScore: cleanScore,
      maxPoints,
      attempts: (Number(prevEntry.attempts) || 0) + 1,
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
  });

  return { saved: true, improved, best: newBest, totalEarned, ratingClaimed };
}

/**
 * Transfers the participant's earned Erasmus+ score (0..100) into `users/{userId}.score` ONE time.
 * Requires `settings/erasmus.claimOpen === true` (admin permission).
 */
export async function claimErasmusPointsToRating(userId) {
  if (!userId) throw new Error('Sign in with your participant name first.');

  let claimedPoints = 0;

  await runTransaction(db, async (tx) => {
    const sRef = doc(db, 'settings', 'erasmus');
    const pRef = doc(db, 'erasmusProgress', userId);
    const uRef = doc(db, 'users', userId);

    const [sSnap, pSnap, uSnap] = await Promise.all([tx.get(sRef), tx.get(pRef), tx.get(uRef)]);

    const claimOpen = sSnap.exists() && !!sSnap.data()?.claimOpen;
    if (!claimOpen) {
      throw new Error('Sending Erasmus+ points to the rating is not open yet. Wait for admin permission.');
    }
    if (!uSnap.exists()) {
      throw new Error('Participant account not found.');
    }

    const pData = pSnap.exists() ? (pSnap.data() || {}) : {};
    if (pData.ratingClaimed) {
      throw new Error(`You already sent +${Number(pData.claimedPoints) || 0} PTS to your rating.`);
    }

    const games = pData.games && typeof pData.games === 'object' ? pData.games : {};
    const computedTotal = Math.min(
      100,
      Object.values(games).reduce((sum, g) => sum + (Number(g?.best) || 0), 0),
    );
    claimedPoints = Math.max(computedTotal, Number(pData.totalEarned) || 0);
    claimedPoints = Math.min(100, Math.max(0, Math.round(claimedPoints)));

    if (claimedPoints <= 0) {
      throw new Error('Play at least one Erasmus+ mini-game first to earn points.');
    }

    tx.set(
      pRef,
      {
        userId,
        totalEarned: claimedPoints,
        ratingClaimed: true,
        claimedPoints,
        claimedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    tx.update(uRef, { score: increment(claimedPoints) });
    tx.set(doc(collection(db, 'pointsLog')), {
      userId,
      delta: claimedPoints,
      reason: `Erasmus+: Competence Games (${claimedPoints}/100)`,
      createdAt: serverTimestamp(),
    });
  });

  return { claimedPoints };
}
