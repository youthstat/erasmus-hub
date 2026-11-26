import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import SubmissionsPanel from './SubmissionsPanel.jsx';
import HeistAdminPanel from './HeistAdminPanel.jsx';

const TABS = [
  ['all', '📋 Everything'],
  ['missions', '🎯 Missions'],
  ['heists', '🕵️ Heists'],
  ['reflections', '🪞 Reflections'],
  ['punishments', '📦 Punishments'],
  ['points', '⚡ All Points Activity'],
];

const fmtTime = (ts) => {
  const d = ts?.toDate?.();
  return d ? d.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'just now';
};

export default function ActivityCenterPanel() {
  const {
    users,
    submissions,
    stealRequests,
    reflectionLogs,
    punishments,
    pointsLog,
    approveStealRequest,
    rejectStealRequest,
  } = useApp();

  const [tab, setTab] = useState('all');
  const [filterName, setFilterName] = useState('');

  const nameOf = (id) => users.find((u) => u.id === id)?.name || 'Unknown';
  const pendingMissions = submissions.filter((s) => s.status === 'pending');
  const pendingHeists = stealRequests.filter((r) => r.status === 'pending');

  const q = filterName.trim().toLowerCase();
  const filteredPoints = pointsLog.filter((l) => {
    if (!q) return true;
    const uname = nameOf(l.userId).toLowerCase();
    const rsn = String(l.reason || '').toLowerCase();
    return uname.includes(q) || rsn.includes(q);
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Tab switcher */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(([id, label]) => {
          const active = tab === id;
          let badge = null;
          if (id === 'missions' && pendingMissions.length > 0) badge = pendingMissions.length;
          if (id === 'heists' && pendingHeists.length > 0) badge = pendingHeists.length;
          if (id === 'all' && pendingMissions.length + pendingHeists.length > 0) badge = pendingMissions.length + pendingHeists.length;
          return (
            <button
              type="button"
              key={id}
              onClick={() => setTab(id)}
              className={`btn !px-3 !py-1.5 text-xs ${active ? 'bg-sun text-ink' : 'bg-white text-ink'}`}
            >
              <span>{label}</span>
              {badge !== null && <span className="tag bg-hot text-white !text-[10px] !px-1.5 !py-0">{badge}</span>}
            </button>
          );
        })}
      </div>

      {tab === 'all' && (
        <div className="flex flex-col gap-5">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border-[3px] border-ink rounded-xl bg-sun p-3 shadow-b4">
              <div className="font-mono text-[10px] font-bold uppercase">Missions</div>
              <div className="text-2xl font-extrabold">{submissions.length}</div>
              <div className="font-mono text-xs">{pendingMissions.length} waiting</div>
            </div>
            <div className="border-[3px] border-ink rounded-xl bg-[#FF4B72] text-white p-3 shadow-b4">
              <div className="font-mono text-[10px] font-bold uppercase">Heist requests</div>
              <div className="text-2xl font-extrabold">{stealRequests.length}</div>
              <div className="font-mono text-xs">{pendingHeists.length} waiting</div>
            </div>
            <div className="border-[3px] border-ink rounded-xl bg-cobalt text-white p-3 shadow-b4">
              <div className="font-mono text-[10px] font-bold uppercase">Reflections</div>
              <div className="text-2xl font-extrabold">{reflectionLogs.length}</div>
              <div className="font-mono text-xs">team check-ins</div>
            </div>
            <div className="border-[3px] border-ink rounded-xl bg-[#FF94B8] p-3 shadow-b4">
              <div className="font-mono text-[10px] font-bold uppercase">Punishments</div>
              <div className="text-2xl font-extrabold">{punishments.length}</div>
              <div className="font-mono text-xs">{punishments.filter((p) => p.drawn).length} drawn</div>
            </div>
          </div>

          <SubmissionsPanel />

          {/* Pending heists preview */}
          {pendingHeists.length > 0 && (
            <section className="box overflow-hidden">
              <div className="bg-hot text-white border-b-[3px] border-ink px-4 py-2.5 font-mono font-bold uppercase flex items-center justify-between gap-2">
                <span>🕵️ Pending heist requests ({pendingHeists.length})</span>
                <button type="button" className="tag bg-white text-ink" onClick={() => setTab('heists')}>Open Heist details →</button>
              </div>
              <div className="divide-y-2 divide-ink bg-white">
                {pendingHeists.map((r) => (
                  <div key={r.id} className="p-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm">
                      <b>{r.thiefName}</b> → steals <b>{r.amount} PTS</b> from <b>{r.victimName}</b> ({r.taskTitle})
                      {r.comment && <span className="ml-2 font-mono text-xs text-mute">“{r.comment}”</span>}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="tag bg-hot text-white" onClick={() => rejectStealRequest(r.id)}>✕ Reject</button>
                      <button type="button" className="tag bg-neon text-ink" onClick={() => approveStealRequest(r)}>✓ Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Reflections */}
          <section className="box overflow-hidden">
            <div className="bg-cobalt text-white border-b-[3px] border-ink px-4 py-2.5 font-mono font-bold uppercase">
              🪞 Recent daily reflections ({reflectionLogs.length})
            </div>
            <div className="divide-y-2 divide-ink bg-white max-h-60 overflow-y-auto">
              {reflectionLogs.slice(0, 15).map((l) => (
                <div key={l.id} className="p-3 text-sm flex flex-wrap justify-between gap-2">
                  <span>
                    <b>{l.teamName}</b> ({l.day}) · Leader: <b>{l.leaderName || '—'}</b> · {(l.memberIds || []).length} members
                  </span>
                  <span className="tag bg-neon text-ink">+{l.points || 50} PTS</span>
                </div>
              ))}
              {reflectionLogs.length === 0 && <p className="p-3 font-mono text-xs text-mute">No reflection completions yet.</p>}
            </div>
          </section>
        </div>
      )}

      {tab === 'missions' && <SubmissionsPanel />}

      {tab === 'heists' && <HeistAdminPanel />}

      {tab === 'reflections' && (
        <section className="box overflow-hidden">
          <div className="bg-cobalt text-white border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase">
            🪞 Daily reflection completions ({reflectionLogs.length})
          </div>
          <div className="divide-y-2 divide-ink bg-white max-h-[32rem] overflow-y-auto">
            {reflectionLogs.map((l) => (
              <div key={l.id} className="p-4 flex flex-wrap justify-between gap-2">
                <div>
                  <div className="font-extrabold uppercase">{l.teamName} · {l.day}</div>
                  <div className="font-mono text-xs text-mute">
                    Leader: <b>{l.leaderName || '—'}</b> · Confirmed by <b>{l.confirmedByName}</b>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(l.memberIds || []).map((uid) => (
                      <span key={uid} className="tag !text-[10px] bg-paper">{nameOf(uid)}</span>
                    ))}
                  </div>
                </div>
                <span className="tag bg-neon text-ink self-start">+{l.points || 50} PTS each</span>
              </div>
            ))}
            {reflectionLogs.length === 0 && <p className="p-4 font-mono text-sm text-mute">No daily reflections logged yet.</p>}
          </div>
        </section>
      )}

      {tab === 'punishments' && (
        <section className="box overflow-hidden">
          <div className="bg-[#FF94B8] border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase">
            📦 Punishment box activity ({punishments.length})
          </div>
          <div className="divide-y-2 divide-ink bg-white max-h-[32rem] overflow-y-auto">
            {[...punishments]
              .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
              .map((p) => (
                <div key={p.id} className="p-3.5 flex flex-wrap justify-between gap-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">“{p.text}”</p>
                    <div className="font-mono text-xs text-mute mt-0.5">
                      Written by <b className="text-ink">{p.userName}</b>
                      {p.drawn && <> · Drawn by <b className="text-ink">{p.drawnByName}</b></>}
                    </div>
                  </div>
                  <span className={`tag self-start ${p.drawn ? 'bg-sun' : 'bg-neon'}`}>
                    {p.drawn ? 'DRAWN' : 'IN BOX'}
                  </span>
                </div>
              ))}
            {punishments.length === 0 && <p className="p-4 font-mono text-sm text-mute">No punishments yet.</p>}
          </div>
        </section>
      )}

      {tab === 'points' && (
        <section className="box overflow-hidden">
          <div className="bg-ink text-white border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap justify-between gap-2">
            <span>⚡ Full points &amp; activity log ({filteredPoints.length})</span>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filter by name or activity…"
              className="border-2 border-white rounded-lg px-2.5 py-1 text-xs font-mono text-ink bg-white"
            />
          </div>
          <div className="divide-y-2 divide-ink bg-white max-h-[32rem] overflow-y-auto">
            {filteredPoints.map((l) => (
              <div key={l.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <b>{nameOf(l.userId)}</b> — <span className="text-[#3b3728]">{l.reason}</span>
                  <div className="font-mono text-[10px] text-mute">{fmtTime(l.createdAt)}</div>
                </div>
                <span className={`tag shrink-0 ${l.delta >= 0 ? 'bg-neon text-ink' : 'bg-hot text-white'}`}>
                  {l.delta >= 0 ? `+${l.delta}` : `−${Math.abs(l.delta)}`} PTS
                </span>
              </div>
            ))}
            {filteredPoints.length === 0 && <p className="p-4 font-mono text-sm text-mute">No activity matching filter.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
