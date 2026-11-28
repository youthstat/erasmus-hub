import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { subscribeTickets, setTicketStatus, removeTicket, sendTestHelpNotification } from '../../firebase/help.js';
import { PRIORITIES } from '../../config/settings.js';

const when = (t) => t.createdAt?.toDate?.().toLocaleDateString([], { day: '2-digit', month: 'short' }) || 'just now';

// Admin: edit Help contact info, Telegram/Browser instant alerts, and review "Ask the Team" tickets
export default function HelpAdminPanel() {
  const { setError, hubSettings, saveHubSettings } = useApp();
  const [tickets, setTickets] = useState([]);
  const [onlyNew, setOnlyNew] = useState(true);

  const [contacts, setContacts] = useState(() => hubSettings?.contacts || {});
  const [webhookUrl, setWebhookUrl] = useState(() => hubSettings?.notifyWebhookUrl || '');

  const [cBusy, setCBusy] = useState(false);
  const [cOk, setCOk] = useState('');
  const [cMsg, setCMsg] = useState('');

  const [nBusy, setNBusy] = useState(false);
  const [nOk, setNOk] = useState('');
  const [nMsg, setNMsg] = useState('');
  const [notifPerm, setNotifPerm] = useState(() =>
    typeof window !== 'undefined' && 'Notification' in window ? window.Notification.permission : 'unsupported',
  );

  useEffect(() => subscribeTickets(setTickets, (e) => setError(e.message)), [setError]);

  useEffect(() => {
    if (hubSettings?.contacts) setContacts(hubSettings.contacts);
    if (typeof hubSettings?.notifyWebhookUrl === 'string') setWebhookUrl(hubSettings.notifyWebhookUrl);
  }, [hubSettings?.contacts, hubSettings?.notifyWebhookUrl]);

  const run = async (fn) => { try { await fn(); } catch (e) { setError(e.message); } };
  const fresh = tickets.filter((t) => t.status !== 'done').length;
  const rows = onlyNew ? tickets.filter((t) => t.status !== 'done') : tickets;

  const setField = (k) => (e) => {
    setContacts((prev) => ({ ...prev, [k]: e.target.value }));
    setCOk('');
    setCMsg('');
  };

  const saveContacts = async (e) => {
    e.preventDefault();
    setCBusy(true);
    setCOk('');
    setCMsg('');
    try {
      await saveHubSettings({
        contacts: {
          dutyName: String(contacts.dutyName || '').trim(),
          dutyPhone: String(contacts.dutyPhone || '').trim(),
          telegram: String(contacts.telegram || '').trim(),
          medicalRoom: String(contacts.medicalRoom || '').trim(),
          infoDesk: String(contacts.infoDesk || '').trim(),
          emergencyNumber: String(contacts.emergencyNumber || '').trim() || '112',
        },
      });
      setCOk('Help contacts saved! Participants see them on the Help page now.');
    } catch (err) {
      setCMsg(err.message || 'Could not save contacts.');
    } finally {
      setCBusy(false);
    }
  };

  const saveAlerts = async (e) => {
    e.preventDefault();
    setNBusy(true);
    setNOk('');
    setNMsg('');
    try {
      const cleanUrl = String(webhookUrl || '').trim();
      if (cleanUrl && !/^https:\/\//i.test(cleanUrl)) {
        throw new Error('The Telegram Webhook URL must start with https://');
      }
      await saveHubSettings({ notifyWebhookUrl: cleanUrl });
      setNOk(
        cleanUrl
          ? 'Telegram alert link saved! Every new Ask the Team request & Mission message will notify you.'
          : 'Alert URL cleared (in-app & browser admin alerts remain active).',
      );
    } catch (err) {
      setNMsg(err.message || 'Could not save alert URL.');
    } finally {
      setNBusy(false);
    }
  };

  const handleTestAlert = async () => {
    setNBusy(true);
    setNOk('');
    setNMsg('');
    try {
      await sendTestHelpNotification(webhookUrl);
      setNOk('Test alert sent! Check your Telegram bot.');
    } catch (err) {
      setNMsg(err.message || 'Could not send test alert.');
    } finally {
      setNBusy(false);
    }
  };

  const requestBrowserNotifs = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const perm = await window.Notification.requestPermission();
      setNotifPerm(perm);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Instant Telegram & Browser Notifications */}
      <section className="box overflow-hidden bg-white">
        <div className="bg-[#00E676] text-ink border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>🔔 Instant Admin Alerts (Telegram &amp; Browser)</span>
        </div>
        <div className="p-4 bg-paper flex flex-col gap-4">
          <div className="border-2 border-ink rounded-xl bg-white p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-xs font-extrabold uppercase">1 · Live Browser Alerts</div>
              <p className="text-xs text-mute font-medium mt-0.5">
                While Admin mode is open, new Help requests &amp; Mission messages pop up an in-app banner and update the Admin badge immediately.
              </p>
            </div>
            {notifPerm === 'granted' ? (
              <span className="tag bg-neon text-ink !text-[11px]">✓ Desktop Alerts Enabled</span>
            ) : notifPerm !== 'unsupported' ? (
              <button type="button" onClick={requestBrowserNotifs} className="btn bg-sun text-ink text-xs whitespace-nowrap">
                🔔 Enable Desktop Alerts
              </button>
            ) : null}
          </div>

          <form onSubmit={saveAlerts} className="border-2 border-ink rounded-xl bg-white p-3.5 flex flex-col gap-3">
            <div>
              <div className="font-mono text-xs font-extrabold uppercase">2 · Telegram Alert Webhook URL (Ask the Team &amp; Missions)</div>
              <p className="text-xs text-mute font-medium mt-0.5">
                Paste your private Telegram relay URL (Cloudflare Worker <code>https://…workers.dev</code> or Telegram-only Apps Script) so your bot token stays completely private outside GitHub.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                className="input flex-1 !shadow-none !py-2 text-xs font-mono"
                placeholder="https://your-telegram-alert.workers.dev"
                value={webhookUrl}
                onChange={(e) => { setWebhookUrl(e.target.value); setNOk(''); setNMsg(''); }}
              />
              <button type="submit" disabled={nBusy} className="btn bg-neon text-ink text-xs whitespace-nowrap disabled:opacity-50">
                {nBusy ? 'Saving…' : '💾 Save Alert URL'}
              </button>
              <button
                type="button"
                disabled={nBusy || !String(webhookUrl || '').trim()}
                onClick={handleTestAlert}
                className="btn bg-sun text-ink text-xs whitespace-nowrap disabled:opacity-40"
              >
                📨 Send Test Alert
              </button>
            </div>
            {nOk && <div className="border-2 border-ink rounded-lg bg-neon px-3 py-1.5 font-mono text-xs font-bold">{nOk}</div>}
            {nMsg && <div className="font-mono text-xs font-bold text-hot">{nMsg}</div>}
          </form>
        </div>
      </section>

      {/* Editable Help Contacts */}
      <section className="box overflow-hidden bg-white">
        <div className="bg-cobalt text-white border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>📞 Help &amp; On-Duty Contacts (shown on Help page)</span>
        </div>
        <form onSubmit={saveContacts} className="p-4 bg-paper grid sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Who is on duty / responsible *</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="e.g. Olena Koval (Duty coordinator 24/7)"
              maxLength={80}
              value={contacts.dutyName || ''}
              onChange={setField('dutyName')}
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Phone number *</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="e.g. +34 600 123 456"
              maxLength={40}
              value={contacts.dutyPhone || ''}
              onChange={setField('dutyPhone')}
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Telegram / WhatsApp</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="e.g. @hub_support"
              maxLength={60}
              value={contacts.telegram || ''}
              onChange={setField('telegram')}
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Medical room / first aid</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="e.g. Room 101 (1st floor)"
              maxLength={80}
              value={contacts.medicalRoom || ''}
              onChange={setField('medicalRoom')}
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Info desk</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="e.g. Info desk in the central hall"
              maxLength={80}
              value={contacts.infoDesk || ''}
              onChange={setField('infoDesk')}
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Emergency number</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="112"
              maxLength={20}
              value={contacts.emergencyNumber || ''}
              onChange={setField('emergencyNumber')}
            />
          </label>

          <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-3 pt-1">
            <button type="submit" disabled={cBusy} className="btn bg-neon text-ink text-xs disabled:opacity-50">
              {cBusy ? 'Saving…' : '💾 Save contacts'}
            </button>
            {cOk && <span className="border-2 border-ink rounded-lg bg-neon px-3 py-1 font-mono text-xs font-bold">{cOk}</span>}
            {cMsg && <span className="font-mono text-xs font-bold text-hot">{cMsg}</span>}
          </div>
        </form>
      </section>

      {/* Incoming Help Tickets */}
      <section className="box overflow-hidden">
        <div className="bg-hot text-white border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>🆘 Ask the Team · {fresh} new · {tickets.length} total</span>
          <button className="tag bg-white text-ink" onClick={() => setOnlyNew(!onlyNew)}>{onlyNew ? 'SHOW ALL' : 'SHOW NEW ONLY'}</button>
        </div>
        <div className="divide-y-2 divide-ink">
          {rows.map((t) => (
            <div key={t.id} className={`p-4 flex flex-col gap-2 ${t.status === 'done' ? 'opacity-60' : ''} ${t.priority === 'emergency' && t.status !== 'done' ? 'bg-hot/15' : ''}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag bg-ink text-white">CASE #{t.caseNo}</span>
                <span className="tag bg-sun">{t.categoryTitle}</span>
                {t.priority && t.priority !== 'normal' && <span className="tag bg-hot text-white">{PRIORITIES.find((p) => p.id === t.priority)?.id.toUpperCase()}</span>}
                <span className="font-mono text-xs text-mute ml-auto">{when(t)}</span>
              </div>
              <div className="font-mono text-xs">from <b>{t.anonymous ? 'Anonymous 🔒' : t.userName}</b>{t.contact && <> · contact: {t.contact}</>}{t.location && <> · location: {t.location}</>}</div>
              {t.absence ? (
                <div className="text-sm border-[3px] border-ink rounded-lg bg-white p-3 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                  <div className="sm:col-span-2"><b>Reason:</b> {t.absence.reason}</div>
                  {t.absence.comment && <div className="sm:col-span-2"><b>Comment:</b> {t.absence.comment}</div>}
                </div>
              ) : <p className="whitespace-pre-line break-words text-sm">{t.text}</p>}
              <div className="flex gap-2">
                <button className="tag bg-neon" onClick={() => run(() => setTicketStatus(t.id, t.status === 'done' ? 'new' : 'done'))}>{t.status === 'done' ? 'REOPEN' : '✓ DONE'}</button>
                <button className="tag bg-white" onClick={() => confirm('Delete this message?') && run(() => removeTicket(t.id))}>DELETE</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="p-4 font-mono text-sm">{onlyNew ? 'No new messages.' : 'No messages yet.'}</p>}
        </div>
      </section>
    </div>
  );
}
