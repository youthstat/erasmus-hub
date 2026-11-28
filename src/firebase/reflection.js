import {
  collection, doc, onSnapshot, query, orderBy, limit,
  setDoc, runTransaction, serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from './config.js';
import { PADLET_URL, REFLECTION_POINTS_PER_DAY } from '../config/settings.js';
import { todayKey } from './punishment.js';
import { buildUserRewardPatch, s2048DocRef } from './wallet.js';

const list = (s) => s.docs.map((d) => ({ id: d.id, ...d.data() }));
const noop = () => {};
const fail = (code, message) => Object.assign(new Error(message), { code });

export const subscribeReflectionConfig = (cb, onErr = noop) =>
  onSnapshot(
    doc(db, 'settings', 'reflection'),
    (s) => {
      const d = s.exists() ? s.data() : {};
      cb({
        padletUrl: d.padletUrl ?? PADLET_URL,
        pointsPerDay: Number(d.pointsPerDay) || REFLECTION_POINTS_PER_DAY,
        teams: Array.isArray(d.teams) ? d.teams : [],
      });
    },
    onErr,
  );

export const subscribeReflectionLogs = (cb, onErr = noop) =>
  onSnapshot(query(collection(db, 'reflectionLogs'), orderBy('createdAt', 'desc'), limit(200)), (s) => cb(list(s)), onErr);

export const saveReflectionConfig = (patch) =>
  setDoc(doc(db, 'settings', 'reflection'), { ...patch, updatedAt: serverTimestamp() }, { merge: true });

export async function setReflectionTeamLeader(teamId, leaderName, leaderId = '') {
  const cleanName = String(leaderName || '').trim().slice(0, 50);
  if (!cleanName) throw fail('empty', 'Enter the name of the reflection leader.');
  const ref = doc(db, 'settings', 'reflection');
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const teams = snap.exists() && Array.isArray(snap.data().teams) ? snap.data().teams : [];
    const idx = teams.findIndex((t) => t.id === teamId);
    if (idx < 0) throw fail('missing', 'Reflection team not found.');
    const next = teams.map((t, i) => (i === idx ? { ...t, leaderName: cleanName, leaderId: leaderId || '' } : t));
    tx.set(ref, { teams: next, updatedAt: serverTimestamp() }, { merge: true });
  });
}

export async function confirmReflectionDone({ teamId, userId, userName, isAdmin = false, day = todayKey() }) {
  if (!teamId) throw fail('noteam', 'You are not in a reflection team yet.');
  const cfgRef = doc(db, 'settings', 'reflection');
  const logRef = doc(db, 'reflectionLogs', `${teamId}_${day}`);

  return runTransaction(db, async (tx) => {
    const [cfgSnap, logSnap] = await Promise.all([tx.get(cfgRef), tx.get(logRef)]);
    if (logSnap.exists()) throw fail('already', 'Your team has already confirmed today’s reflection!');

    const cfg = cfgSnap.exists() ? cfgSnap.data() : {};
    const teams = Array.isArray(cfg.teams) ? cfg.teams : [];
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw fail('missing', 'Reflection team not found.');

    const members = Array.isArray(team.memberIds) ? [...new Set(team.memberIds.filter(Boolean))] : [];
    if (!members.length) throw fail('empty', 'This team has no members yet.');
    if (!isAdmin && (!userId || !members.includes(userId))) {
      throw fail('forbidden', 'Only a member of this team can confirm today’s reflection.');
    }

    const pts = Math.max(1, Number(cfg.pointsPerDay) || REFLECTION_POINTS_PER_DAY);
    const [userSnaps, s2048Snaps, dayLocks] = await Promise.all([
      Promise.all(members.map((id) => tx.get(doc(db, 'users', id)))),
      Promise.all(members.map((id) => tx.get(s2048DocRef(id)))),
      Promise.all(members.map((id) => tx.get(doc(db, 'reflectionUserDays', `${id}_${day}`)))),
    ]);

    const credited = [];
    members.forEach((id, i) => {
      const uSnap = userSnaps[i];
      const lockSnap = dayLocks[i];
      if (!uSnap.exists() || uSnap.data()?.isDemo || lockSnap.exists()) return;
      const uRef = doc(db, 'users', id);
      tx.update(uRef, buildUserRewardPatch(uSnap.data(), s2048Snaps[i], pts));
      tx.set(doc(db, 'reflectionUserDays', `${id}_${day}`), {
        userId: id,
        teamId: team.id,
        day,
        createdAt: serverTimestamp(),
      });
      tx.set(doc(collection(db, 'pointsLog')), {
        userId: id,
        delta: pts,
        reason: `🪞 Daily reflection · ${team.name} (${day})`,
        createdAt: serverTimestamp(),
      });
      credited.push(id);
    });

    tx.set(logRef, {
      teamId: team.id,
      teamName: team.name,
      leaderName: team.leaderName || '',
      day,
      memberIds: credited,
      points: pts,
      confirmedBy: userId || 'admin',
      confirmedByName: userName || 'Admin',
      createdAt: serverTimestamp(),
    });

    return { creditedCount: credited.length, points: pts, teamName: team.name };
  });
}

export async function resetReflectionLog(log) {
  if (!log?.id) return;
  const members = Array.isArray(log.memberIds) ? log.memberIds : [];
  await runTransaction(db, async (tx) => {
    tx.delete(doc(db, 'reflectionLogs', log.id));
    if (log.day) {
      members.forEach((uid) => {
        tx.delete(doc(db, 'reflectionUserDays', `${uid}_${log.day}`));
      });
    }
  });
}
