import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { subscribeTickets, setTicketStatus, removeTicket } from '../../firebase/help.js';
import { PRIORITIES } from '../../config/settings.js';

const when = (t) => t.createdAt?.toDate?.().toLocaleDateString([], { day: '2-digit', month: 'short' }) || 'just now';

// Admin: edit Help contact info (who is on duty + phone) and review "Ask the Team" tickets
export default function HelpAdminPanel() {
  const { setError, hubSettings, saveHubSettings } = useApp();
  const [tickets, setTickets] = useState([]);
  const [onlyNew, setOnlyNew] = useState(true);

  const [contacts, setContacts] = useState(() => hubSettings?.contacts || {});
  const [cBusy, setCBusy] = useState(false);
  const [cOk, setCOk] = useState('');
  const [cMsg, setCMsg] = useState('');

  useEffect(() => subscribeTickets(setTickets, (e) => setError(e.message)), [setError]);

  useEffect(() => {
    if (hubSettings?.contacts) setContacts(hubSettings.contacts);
  }, [hubSettings?.contacts]);

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

  return (
    <div className="flex flex-col gap-6">
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
              placeholder="e.g. +380 99 123 45 67"
              maxLength={40}
              value={contacts.dutyPhone || ''}
              onChange={setField('dutyPhone')}
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Telegram / WhatsApp</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="e.g. @erasmus_duty"
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
