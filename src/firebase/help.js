import { collection, doc, deleteDoc, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config.js';
import { ADMIN_NOTIFY_EMAIL, HELP_NOTIFY_WEBHOOK_URL } from '../config/settings.js';
import { dispatchAdminAlert } from './notify.js';

/*
  helpTickets/{id}  questions / absence notices for the organizers (the admin page reads them)
    { caseNo, category, categoryTitle, anonymous, userId, userName (only when not anonymous), priority, location, text, contact,
      absence: { session, from, to, returnTime, reason, comment } | null, status: 'new' | 'done', createdAt }
  counters/help     { n }   -> sequential case numbers
*/
export const subscribeTickets = (cb, onErr) =>
  onSnapshot(query(collection(db, 'helpTickets'), orderBy('createdAt', 'desc'), limit(500)), (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))), onErr);

export async function createTicket(t, notifyOptions = {}) {
  const ref = doc(collection(db, 'helpTickets'));
  const cRef = doc(db, 'counters', 'help');
  let caseNo = 0;
  await runTransaction(db, async (tx) => {
    const c = await tx.get(cRef);
    caseNo = (c.exists() ? c.data().n || 0 : 0) + 1;
    tx.set(cRef, { n: caseNo });
    tx.set(ref, { ...t, caseNo, status: 'new', createdAt: serverTimestamp() });
  });

  const summaryMessage = t.absence
    ? `Reason: ${t.absence.reason}${t.absence.comment ? ` | Comment: ${t.absence.comment}` : ''}`
    : t.text;

  // Non-blocking external alert to Google Apps Script (Telegram / Email)
  dispatchAdminAlert(
    {
      event: 'help_ticket',
      title: `🆘 Ask the Team · Case #${caseNo}`,
      caseNo,
      category: t.categoryTitle || t.category || 'Help request',
      priority: t.priority || 'normal',
      from: t.anonymous ? 'Anonymous' : (t.userName || 'Participant'),
      location: t.location || '',
      contact: t.contact || '',
      message: summaryMessage || '',
      adminEmail: String(notifyOptions.notifyEmail || ADMIN_NOTIFY_EMAIL || '').trim(),
      createdAt: new Date().toISOString(),
    },
    notifyOptions.webhookUrl,
  );

  return caseNo;
}

export async function sendTestHelpNotification(webhookUrl) {
  const clean = String(webhookUrl || HELP_NOTIFY_WEBHOOK_URL || '').trim();
  if (!/^https:\/\//i.test(clean)) {
    throw new Error('Paste a valid https:// Telegram Webhook URL first.');
  }
  const sent = await dispatchAdminAlert(
    {
      event: 'help_test',
      title: '🔔 Test Alert · Hub for Youth',
      caseNo: 'TEST',
      category: 'Ask the Team & Missions',
      priority: 'urgent',
      from: 'Admin Panel Check',
      location: 'Hub for Youth',
      contact: ADMIN_NOTIFY_EMAIL,
      message: 'If you see this message in Telegram, instant alerts for Ask the Team & Mission messages are working!',
      adminEmail: ADMIN_NOTIFY_EMAIL,
      createdAt: new Date().toISOString(),
    },
    clean,
  );
  if (!sent) throw new Error('Could not reach the notification URL.');
  return true;
}

export const setTicketStatus = (id, status) => updateDoc(doc(db, 'helpTickets', id), { status });
export const removeTicket = (id) => deleteDoc(doc(db, 'helpTickets', id));
