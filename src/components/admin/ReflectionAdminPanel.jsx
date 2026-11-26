import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { todayKey } from '../../firebase/punishment.js';
import { PADLET_URL, REFLECTION_POINTS_PER_DAY } from '../../config/settings.js';

export default function ReflectionAdminPanel() {
  const {
    users,
    reflectionConfig,
    reflectionLogs,
    saveReflectionConfig,
    confirmReflectionDone,
    resetReflectionLog,
  } = useApp();

  const [padletUrl, setPadletUrl] = useState(reflectionConfig?.padletUrl || PADLET_URL);
  const [pointsPerDay, setPointsPerDay] = useState(reflectionConfig?.pointsPerDay || REFLECTION_POINTS_PER_DAY);
  const [teams, setTeams] = useState(reflectionConfig?.teams || []);
  const [newTeamName, setNewTeamName] = useState('');
  const [splitCount, setSplitCount] = useState(4);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    setPadletUrl(reflectionConfig?.padletUrl || PADLET_URL);
    setPointsPerDay(reflectionConfig?.pointsPerDay || REFLECTION_POINTS_PER_DAY);
    setTeams(reflectionConfig?.teams || []);
  }, [reflectionConfig]);

  const realUsers = users.filter((u) => !u.isDemo).sort((a, b) => a.name.localeCompare(b.name));
  const nameOf = (id) => users.find((u) => u.id === id)?.name || 'Unknown';
  const today = todayKey();

  const saveAll = async (nextTeams = teams) => {
    setBusy(true); setMsg(''); setOk('');
    try {
      await saveReflectionConfig({
        padletUrl: String(padletUrl || '').trim(),
        pointsPerDay: Math.max(1, Number(pointsPerDay) || REFLECTION_POINTS_PER_DAY),
        teams: nextTeams,
      });
      setOk('Reflection settings & teams saved!');
    } catch (e) {
      setMsg(e.message || 'Could not save reflection settings.');
    } finally {
      setBusy(false);
    }
  };

  const addTeam = async (e) => {
    e.preventDefault();
    const title = newTeamName.trim();
    if (!title) return;
    const id = `team_${Date.now()}`;
    const next = [...teams, { id, name: title, leaderName: '', leaderId: '', memberIds: [] }];
    setTeams(next);
    setNewTeamName('');
    await saveAll(next);
  };

  const removeTeam = async (id) => {
    if (!confirm('Delete this reflection team?')) return;
    const next = teams.filter((t) => t.id !== id);
    setTeams(next);
    await saveAll(next);
  };

  const autoSplit = async () => {
    const n = Math.max(2, Math.min(12, Math.floor(Number(splitCount) || 4)));
    if (!realUsers.length) return;
    if (teams.length && !confirm(`Replace current ${teams.length} teams with ${n} balanced random teams?`)) return;
    const shuffled = [...realUsers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const buckets = Array.from({ length: n }, (_, i) => ({
      id: `team_${i + 1}_${Date.now()}`,
      name: `Team ${i + 1}`,
      leaderName: '',
      leaderId: '',
      memberIds: [],
    }));
    shuffled.forEach((u, idx) => {
      buckets[idx % n].memberIds.push(u.id);
    });
    setTeams(buckets);
    await saveAll(buckets);
  };

  const toggleMember = (teamId, uid) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const exists = (t.memberIds || []).includes(uid);
          return {
            ...t,
            memberIds: exists ? t.memberIds.filter((x) => x !== uid) : [...(t.memberIds || []), uid],
          };
        }
        // Remove from any other team so each participant belongs to one team cleanly
        return {
          ...t,
          memberIds: (t.memberIds || []).filter((x) => x !== uid),
        };
      }),
    );
    setOk('');
  };

  const updateTeamField = (teamId, field, value) => {
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, [field]: value } : t)));
    setOk('');
  };

  const adminCreditTeam = async (team) => {
    setBusy(true); setMsg(''); setOk('');
    try {
      const res = await confirmReflectionDone({
        teamId: team.id,
        userId: 'admin',
        userName: 'Admin',
        isAdmin: true,
      });
      setOk(`Awarded +${res.points} PTS to ${res.creditedCount} members of ${res.teamName}!`);
    } catch (e) {
      setMsg(e.message || 'Could not credit team.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Settings: Link & Daily Points */}
      <section className="box overflow-hidden">
        <div className="bg-cobalt text-white border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>🪞 Daily reflection link &amp; points</span>
          <button type="button" disabled={busy} className="tag bg-sun text-ink" onClick={() => saveAll(teams)}>
            {busy ? 'Saving…' : '💾 Save all changes'}
          </button>
        </div>
        <div className="p-4 bg-paper grid md:grid-cols-12 gap-3 items-end">
          <label className="md:col-span-7 flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Reflection site URL (Padlet / Form)</span>
            <input
              className="input !shadow-none"
              type="url"
              placeholder="https://padlet.com/..."
              value={padletUrl}
              onChange={(e) => setPadletUrl(e.target.value)}
            />
          </label>
          <label className="md:col-span-3 flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Points per day (each member)</span>
            <input
              className="input !shadow-none"
              type="number"
              min="1"
              value={pointsPerDay}
              onChange={(e) => setPointsPerDay(e.target.value)}
            />
          </label>
          <div className="md:col-span-2">
            <button type="button" disabled={busy} onClick={() => saveAll(teams)} className="btn bg-neon w-full text-xs">
              Save
            </button>
          </div>
        </div>
      </section>

      {/* Team Management */}
      <section className="box overflow-hidden">
        <div className="bg-sun border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>👥 Reflection teams ({teams.length})</span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min="2"
              max="12"
              value={splitCount}
              onChange={(e) => setSplitCount(e.target.value)}
              className="w-16 border-2 border-ink rounded-lg px-2 py-1 text-xs font-mono bg-white"
            />
            <button type="button" disabled={busy} onClick={autoSplit} className="tag bg-ink text-sun">
              🎲 Auto-split into {splitCount} teams
            </button>
          </div>
        </div>

        <div className="p-4 bg-paper flex flex-col gap-4">
          <form onSubmit={addTeam} className="flex flex-wrap gap-2">
            <input
              className="input !shadow-none flex-1 min-w-[200px]"
              placeholder="New team name (e.g. Moonlight Crew)…"
              maxLength={40}
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <button type="submit" disabled={busy || !newTeamName.trim()} className="btn bg-neon text-xs">+ Create team</button>
          </form>

          {msg && <p className="font-mono text-xs font-bold text-hot">{msg}</p>}
          {ok && <p className="border-2 border-ink rounded-xl bg-neon px-3 py-2 font-mono text-xs font-bold">{ok}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teams.map((t) => {
              const doneToday = reflectionLogs.find((l) => l.teamId === t.id && l.day === today);
              return (
                <div key={t.id} className="border-[3px] border-ink rounded-xl bg-white p-4 shadow-b4 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <input
                      className="font-extrabold uppercase text-base border-2 border-ink rounded-lg px-2.5 py-1 bg-paper flex-1 min-w-[140px]"
                      value={t.name}
                      onChange={(e) => updateTeamField(t.id, 'name', e.target.value)}
                    />
                    <div className="flex items-center gap-1.5">
                      {doneToday ? (
                        <span className="tag bg-neon text-ink">DONE TODAY ✓</span>
                      ) : (
                        <button
                          type="button"
                          disabled={busy || !(t.memberIds || []).length}
                          onClick={() => adminCreditTeam(t)}
                          className="tag bg-cobalt text-white disabled:opacity-40"
                        >
                          +{pointsPerDay} PTS NOW
                        </button>
                      )}
                      <button type="button" onClick={() => removeTeam(t.id)} className="tag bg-hot text-white">✕</button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2">
                    <label className="flex flex-col gap-1 font-mono text-[10px] font-bold uppercase">
                      <span>Reflection Leader</span>
                      <input
                        className="border-2 border-ink rounded-lg px-2.5 py-1 text-xs bg-white"
                        placeholder="Leader name…"
                        value={t.leaderName || ''}
                        onChange={(e) => updateTeamField(t.id, 'leaderName', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 font-mono text-[10px] font-bold uppercase">
                      <span>Or pick from members</span>
                      <select
                        className="border-2 border-ink rounded-lg px-2 py-1 text-xs bg-white"
                        value=""
                        onChange={(e) => {
                          if (!e.target.value) return;
                          updateTeamField(t.id, 'leaderName', nameOf(e.target.value));
                        }}
                      >
                        <option value="">Choose leader…</option>
                        {(t.memberIds || []).map((uid) => (
                          <option key={uid} value={uid}>{nameOf(uid)}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] font-bold uppercase text-mute mb-1.5">
                      Members ({(t.memberIds || []).length}) — click to toggle:
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-paper rounded-lg border-2 border-ink/15">
                      {realUsers.map((u) => {
                        const inThis = (t.memberIds || []).includes(u.id);
                        return (
                          <button
                            type="button"
                            key={u.id}
                            onClick={() => toggleMember(t.id, u.id)}
                            className={`tag !text-[10px] cursor-pointer ${inThis ? 'bg-sun text-ink' : 'bg-white text-mute'}`}
                          >
                            {inThis ? '✓ ' : ''}{u.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {teams.length > 0 && (
            <button type="button" disabled={busy} onClick={() => saveAll(teams)} className="btn bg-neon self-start text-xs">
              💾 Save team memberships &amp; leaders
            </button>
          )}
        </div>
      </section>

      {/* Completion History */}
      <section className="box overflow-hidden">
        <div className="bg-ink text-white border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase">
          ✓ Daily reflection completion log ({reflectionLogs.length})
        </div>
        <div className="divide-y-2 divide-ink bg-white">
          {reflectionLogs.map((l) => (
            <div key={l.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div>
                <b>{l.teamName}</b> · <span className="font-mono text-xs">{l.day}</span>
                {l.leaderName && <span className="font-mono text-xs text-mute"> · Leader: {l.leaderName}</span>}
                <div className="font-mono text-xs text-mute">
                  +{(l.points || REFLECTION_POINTS_PER_DAY)} PTS to {(l.memberIds || []).length} members · confirmed by {l.confirmedByName}
                </div>
              </div>
              <button
                type="button"
                className="tag bg-white text-ink"
                onClick={() => confirm(`Reset daily lock for ${l.teamName} (${l.day}) so they can submit again today? (Points already given stay.)`) && resetReflectionLog(l)}
              >
                ↺ Reset day
              </button>
            </div>
          ))}
          {reflectionLogs.length === 0 && <p className="p-4 font-mono text-sm text-mute">No team reflections logged yet.</p>}
        </div>
      </section>
    </div>
  );
}
