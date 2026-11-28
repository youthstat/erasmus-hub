import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from '../firebase/config.js';
import * as api from '../firebase/services.js';
import * as games from '../firebase/games.js';
import * as chat from '../firebase/chat.js';
import * as rattie from '../firebase/rattie.js';
import * as reflection from '../firebase/reflection.js';
import * as punishment from '../firebase/punishment.js';
import * as mouseAvatar from '../firebase/mouseAvatar.js';
import { subscribeTickets } from '../firebase/help.js';
import { SEED_MISSIONS } from '../data/missions.js';
import { ADMIN_PASSWORD, PADLET_URL, REFLECTION_POINTS_PER_DAY } from '../config/settings.js';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);
const today = () => new Date().toISOString().slice(0, 10);
const store = {
  get: () => { try { return localStorage.getItem('accountId'); } catch { return null; } },
  set: (v) => { try { v ? localStorage.setItem('accountId', v) : localStorage.removeItem('accountId'); } catch { /* ignore */ } },
};

export function AppProvider({ children }) {
  const [uid, setUid] = useState(null);                 // technical anonymous login (database access)
  const [accountId, setAccountId] = useState(store.get); // participant account (a document in `users`)
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === '1');
  const [modal, setModal] = useState(null);
  const [missions, setMissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [pointsLog, setPointsLog] = useState([]);
  const [gossips, setGossips] = useState([]);
  const [heistTasks, setHeistTasks] = useState([]);
  const [stealRequests, setStealRequests] = useState([]);
  const [myNotices, setMyNotices] = useState([]);
  const [mySfPlayer, setMySfPlayer] = useState(null);
  const [sfReceived, setSfReceived] = useState([]);
  const [sfWardMsgs, setSfWardMsgs] = useState([]);
  const [reflectionConfig, setReflectionConfig] = useState({ padletUrl: PADLET_URL, pointsPerDay: REFLECTION_POINTS_PER_DAY, teams: [] });
  const [reflectionLogs, setReflectionLogs] = useState([]);
  const [punishments, setPunishments] = useState([]);
  const [helpTickets, setHelpTickets] = useState([]);
  const [helpTicketAlert, setHelpTicketAlert] = useState(null);
  const seenHelpIdsRef = useRef(null);
  const [missionAlert, setMissionAlert] = useState(null);
  const seenSubIdsRef = useRef(null);
  const [my2048Best, setMy2048Best] = useState(0);
  const [homeHidden, setHomeHiddenState] = useState({});   // sections the admin switched off for participants
  const [homeReady, setHomeReady] = useState(false);
  const [hubSettings, setHubSettings] = useState(api.DEFAULT_HUB_SETTINGS);
  const [error, setError] = useState('');

  // 1. анонімний вхід — лише технічний доступ до бази
  useEffect(() => {
    if (!firebaseConfigured) return;
    const off = onAuthStateChanged(auth, (u) => (u ? setUid(u.uid) : signInAnonymously(auth).catch((e) => setError(e.message))));
    return off;
  }, []);

  // 2. живі підписки
  useEffect(() => {
    if (!uid) return;
    const onErr = (e) => setError(e.message);
    rattie.ensureDefaultHeistTasks().catch(() => {});
    api.ensureDemoAccounts().catch(() => {});
    const offs = [
      api.subscribeMissions(setMissions, onErr),
      api.subscribeUsers(setUsers, onErr),
      api.subscribePointsLog(setPointsLog, onErr),
      api.subscribeHomeConfig((h) => { setHomeHiddenState(h); setHomeReady(true); }, onErr),
      api.subscribeHubSettings(setHubSettings, onErr),
      rattie.subscribeHeistTasks(setHeistTasks, onErr),
      reflection.subscribeReflectionConfig(setReflectionConfig, onErr),
      reflection.subscribeReflectionLogs(setReflectionLogs, onErr),
    ];
    if (isAdmin) {
      offs.push(
        api.subscribeAllSubmissions((rows) => {
          setSubmissions(rows);
          const prevSeen = seenSubIdsRef.current;
          if (!prevSeen) {
            seenSubIdsRef.current = new Set(rows.map((r) => r.id));
            return;
          }
          const newest = rows.find((r) => !prevSeen.has(r.id) && r.status === 'pending');
          rows.forEach((r) => prevSeen.add(r.id));
          if (newest) {
            setMissionAlert(newest);
            if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
              try {
                new window.Notification(`🎯 Mission · ${newest.missionTitle}`, {
                  body: `From ${newest.userName || 'Participant'}${newest.proofType === 'comment' ? `: ${newest.proofValue}` : ''}`,
                });
              } catch { /* ignore notification errors in restricted contexts */ }
            }
          }
        }, onErr),
      );
      offs.push(api.subscribeGossips(setGossips, onErr));
      offs.push(rattie.subscribeStealRequests(setStealRequests, onErr));
      offs.push(punishment.subscribePunishments(setPunishments, onErr));
      offs.push(
        subscribeTickets((rows) => {
          setHelpTickets(rows);
          const prevSeen = seenHelpIdsRef.current;
          if (!prevSeen) {
            seenHelpIdsRef.current = new Set(rows.map((r) => r.id));
            return;
          }
          const newest = rows.find((r) => !prevSeen.has(r.id) && r.status !== 'done');
          rows.forEach((r) => prevSeen.add(r.id));
          if (newest) {
            setHelpTicketAlert(newest);
            if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
              try {
                const who = newest.anonymous ? 'Anonymous' : (newest.userName || 'Participant');
                new window.Notification(`Ask the Team · Case #${newest.caseNo}`, {
                  body: `${newest.categoryTitle || 'Help'} from ${who}`,
                });
              } catch { /* ignore notification errors in restricted contexts */ }
            }
          }
        }, onErr),
      );
    } else if (accountId) {
      offs.push(api.subscribeMySubmissions(accountId, setSubmissions, onErr));
    } else {
      setSubmissions([]);
    }
    if (accountId) {
      offs.push(rattie.subscribeMyNotices(accountId, setMyNotices, onErr));
      offs.push(games.subscribePlayer('sf', accountId, setMySfPlayer, onErr));
      offs.push(chat.subscribeReceived(accountId, setSfReceived, onErr));
      offs.push(
        onSnapshot(
          doc(db, 'game2048Scores', accountId),
          (snap) => setMy2048Best(snap.exists() ? Number(snap.data().bestScore) || 0 : 0),
          onErr,
        ),
      );
    } else {
      setMyNotices([]);
      setMySfPlayer(null);
      setSfReceived([]);
      setMy2048Best(0);
    }
    if (!isAdmin) {
      setGossips([]);
      setStealRequests([]);
      setPunishments([]);
      setHelpTickets([]);
      setHelpTicketAlert(null);
      seenHelpIdsRef.current = null;
      setMissionAlert(null);
      seenSubIdsRef.current = null;
    }
    return () => offs.forEach((o) => o());
  }, [uid, isAdmin, accountId]);

  // Listen for messages sent by our Secret Friend ward (if we have drawn a target)
  const sfTargetId = mySfPlayer?.targetId || null;
  useEffect(() => {
    if (!uid || !accountId || !sfTargetId) {
      setSfWardMsgs([]);
      return undefined;
    }
    return chat.subscribeWardMessages(sfTargetId, setSfWardMsgs, (e) => setError(e.message));
  }, [uid, accountId, sfTargetId]);

  const profile = useMemo(() => users.find((u) => u.id === accountId) || null, [users, accountId]);
  const rank = profile ? users.findIndex((u) => u.id === profile.id) + 1 : 0;
  const wallet2048 = profile && typeof profile.game2048Points === 'number' ? profile.game2048Points : my2048Best;
  const visibleMissions = useMemo(() => (isAdmin ? missions : missions.filter((m) => m.active !== false)), [missions, isAdmin]);
  const activeHeistTasks = useMemo(() => heistTasks.filter((t) => t.active !== false), [heistTasks]);
  const openHelpCount = useMemo(() => helpTickets.filter((t) => t.status !== 'done').length, [helpTickets]);
  const pendingCount = submissions.filter((s) => s.status === 'pending').length + stealRequests.filter((r) => r.status === 'pending').length + openHelpCount;

  // last point change of every participant (shown next to the score) + own history
  const lastChange = useMemo(() => {
    const map = {};
    for (const l of pointsLog) if (!map[l.userId]) map[l.userId] = l;     // log is newest-first
    return map;
  }, [pointsLog]);
  const myHistory = useMemo(() => pointsLog.filter((l) => l.userId === accountId).slice(0, 15), [pointsLog, accountId]);

  const unreadSfMessages = useMemo(() => {
    if (!accountId) return [];
    const targetName = sfTargetId ? (users.find((u) => u.id === sfTargetId)?.name || 'Your friend') : '';
    const fromFriend = sfReceived
      .filter((q) => !q.answer)
      .map((q) => ({
        id: `f-${q.id}`,
        from: 'Your Secret Friend',
        icon: '🕵️',
        text: q.text,
        to: '/secret-friend/my-profile',
        ts: q.createdAt?.seconds || 0,
      }));
    const fromWard = sfWardMsgs
      .filter((m) => !m.answer)
      .map((m) => ({
        id: `w-${m.id}`,
        from: targetName,
        icon: '🎁',
        text: m.text,
        to: '/secret-friend/buddy',
        ts: m.createdAt?.seconds || 0,
      }));
    return [...fromFriend, ...fromWard].sort((a, b) => b.ts - a.ts);
  }, [accountId, sfTargetId, users, sfReceived, sfWardMsgs]);

  const submissionIdFor = (m) => `${accountId}_${m.id}_${m.recurrence === 'DAILY' ? today() : 'once'}`;
  const statusFor = (m) => submissions.find((s) => s.id === submissionIdFor(m))?.status || null;

  // --- модальні вікна ---
  const openAuth = () => setModal({ type: 'auth' });
  const openMission = (mission) => setModal({ type: 'mission', mission });
  const openThanks = () => setModal({ type: 'thanks' });
  const openAccount = (next) => setModal({ type: 'account', next });
  const openEditor = (mission = null) => setModal({ type: 'editor', mission });
  const openUserEditor = (user = null) => setModal({ type: 'userEditor', user });
  const closeModal = () => setModal(null);

  // --- акаунт учасника (помилки кидаються в форму, а не в глобальний банер) ---
  const registerAccount = async ({ userId, country, password }) => {
    await api.registerAccount(userId, country, password);
    store.set(userId); setAccountId(userId);
  };
  const loginAccount = async ({ userId, password }) => {
    await api.checkPassword(userId, password);
    store.set(userId); setAccountId(userId);
  };
  const logoutAccount = () => { store.set(null); setAccountId(null); setModal(null); };

  // --- адмін ---
  const tryAdminLogin = (pw) => {
    if (pw !== ADMIN_PASSWORD) return false;
    sessionStorage.setItem('isAdmin', '1'); setIsAdmin(true); setModal(null); return true;
  };
  const logoutAdmin = () => { sessionStorage.removeItem('isAdmin'); setIsAdmin(false); };

  // --- дії ---
  const run = async (fn) => { try { await fn(); } catch (e) { setError(e.message); } };
  const actions = {
    sendGossip: (text, showName, via) => api.sendGossip({ id: accountId, name: profile?.name || '' }, text, showName, via),   // throws: the mascot shows the message itself
    giftPoints: (recipientId, amount, comment) => rattie.giftPoints(accountId, recipientId, amount, comment),
    submitStealRequest: (payload) => rattie.submitStealRequest({ ...payload, thiefId: accountId, thiefName: profile?.name || '' }),
    approveStealRequest: (req) => run(() => rattie.approveStealRequest(req)),
    rejectStealRequest: (id) => run(() => rattie.rejectStealRequest(id)),
    saveHeistTask: (data, id) => run(() => rattie.saveHeistTask(data, id)),
    deleteHeistTask: (id) => run(() => rattie.removeHeistTask(id)),
    seedHeistTasks: () => run(() => rattie.seedHeistTasks()),
    dismissNotice: (id) => run(() => rattie.dismissNotice(id)),
    submitMission: (m, proof) => run(() => api.sendSubmission(
      submissionIdFor(m),
      {
        missionId: m.id,
        missionTitle: m.title,
        points: Number(m.points),
        userId: accountId,
        userName: profile.name,
        proofType: proof.type,
        proofValue: proof.value,
      },
      { webhookUrl: hubSettings?.notifyWebhookUrl },
    )),
    clearGossips: () => run(() => api.clearGossips()),
    deleteGossip: (id) => run(() => api.deleteGossip(id)),
    clearSubmissions: (missionId) => run(() => api.clearSubmissions(missionId)),
    approve: (s) => run(() => api.approveSubmission(s)),
    reject: (id) => run(() => api.rejectSubmission(id)),
    adjustPoints: (userId, delta, reason) => run(() => api.adjustPoints(userId, delta, reason)),
    adjustPointsBatch: (userIds, delta, reason) => run(() => api.adjustPointsBatch(userIds, delta, reason)),
    syncDemoAccounts: () => run(() => api.ensureDemoAccounts(true)),
    saveReflectionConfig: (patch) => reflection.saveReflectionConfig(patch),
    setReflectionTeamLeader: (teamId, leaderName, leaderId) => reflection.setReflectionTeamLeader(teamId, leaderName, leaderId),
    confirmReflectionDone: (payload) => reflection.confirmReflectionDone(payload),
    resetReflectionLog: (log) => reflection.resetReflectionLog(log),
    saveMission: (data, id) => run(() => api.saveMission(data, id)),
    deleteMission: (id) => run(() => api.removeMission(id)),
    saveUser: (data, id) => run(() => api.saveUser(data, id)),
    resetAccount: (id) => run(() => api.resetAccount(id)),
    // removing a person also keeps the games consistent (contracts pass on / links are freed)
    removeUser: (id) => run(async () => {
      const nameOf = (x) => users.find((u) => u.id === x)?.name || 'Unknown';
      await games.detachUser('sf', id, nameOf).catch(() => {});
      await games.detachUser('kg', id, nameOf).catch(() => {});
      await api.removeUser(id);
    }),
    setHomeHidden: (id, hidden) => run(() => api.setHomeHidden(id, hidden)),
    setAllHomeHidden: (ids, hidden) => run(() => api.setAllHomeHidden(ids, hidden)),
    seedMissions: () => run(() => Promise.all(SEED_MISSIONS.map((m) => api.saveMission(m)))),
    saveMouseLook: (look) => mouseAvatar.saveMouseLook(accountId, look),
    buyMouseCostume: (opts) => mouseAvatar.buyMouseCostume({ userId: accountId, ...opts }),
    saveHubSettings: (patch) => api.saveHubSettings(patch),
  };

  return (
    <AppContext.Provider value={{
      uid, accountId, gossips, isAdmin, homeHidden, homeReady, hubSettings, modal, users, profile, rank, wallet2048, lastChange, myHistory, pointsLog, submissions, pendingCount,
      mySfPlayer, unreadSfMessages, punishments, helpTickets, openHelpCount, helpTicketAlert, dismissHelpAlert: () => setHelpTicketAlert(null),
      missionAlert, dismissMissionAlert: () => setMissionAlert(null),
      reflectionConfig, reflectionLogs,
      missions: visibleMissions, allMissions: missions,
      heistTasks: activeHeistTasks, allHeistTasks: heistTasks, stealRequests, myNotices,
      error, setError, firebaseConfigured, statusFor, openAuth, openMission, openThanks, openAccount, openEditor, openUserEditor,
      closeModal, tryAdminLogin, logoutAdmin, registerAccount, loginAccount, logoutAccount, ...actions,
    }}>
      {children}
    </AppContext.Provider>
  );
}
