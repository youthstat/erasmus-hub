import { useEffect, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import { Banner, Step } from '../components/games/RulesBits.jsx';
import { useApp } from '../context/AppContext.jsx';
import { todayKey } from '../firebase/punishment.js';
import { PADLET_URL, REFLECTION_POINTS_PER_DAY, REFLECTION_PROMPTS } from '../config/settings.js';

export { PADLET_URL };

export default function ReflectionPage() {
  const {
    profile,
    users,
    openAccount,
    reflectionConfig,
    reflectionLogs,
    setReflectionTeamLeader,
    confirmReflectionDone,
  } = useApp();

  const today = todayKey();
  const padletUrl = reflectionConfig?.padletUrl || PADLET_URL;
  const ptsPerDay = Number(reflectionConfig?.pointsPerDay) || REFLECTION_POINTS_PER_DAY;
  const teams = reflectionConfig?.teams || [];
  const nameOf = (id) => users.find((u) => u.id === id)?.name || 'Unknown';

  const myTeam = profile ? teams.find((t) => Array.isArray(t.memberIds) && t.memberIds.includes(profile.id)) : null;
  const myTeamDone = myTeam ? reflectionLogs.find((l) => l.teamId === myTeam.id && l.day === today) : null;

  const [leaderName, setLeaderName] = useState(myTeam?.leaderName || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    setLeaderName(myTeam?.leaderName || '');
  }, [myTeam?.id, myTeam?.leaderName]);

  const saveLeader = async (e) => {
    e.preventDefault();
    if (!myTeam) return;
    setBusy(true); setMsg(''); setOk('');
    try {
      const matched = (myTeam.memberIds || []).find((uid) => nameOf(uid).toLowerCase() === leaderName.trim().toLowerCase());
      await setReflectionTeamLeader(myTeam.id, leaderName, matched || '');
      setOk('Reflection leader saved!');
    } catch (err) {
      setMsg(err.message || 'Could not save leader.');
    } finally {
      setBusy(false);
    }
  };

  const markDone = async () => {
    if (!myTeam || !profile) return;
    setBusy(true); setMsg(''); setOk('');
    try {
      const res = await confirmReflectionDone({
        teamId: myTeam.id,
        userId: profile.id,
        userName: profile.name,
      });
      setOk(`🎉 Confirmed! +${res.points} PTS awarded to all ${res.creditedCount} members of ${res.teamName}!`);
    } catch (err) {
      setMsg(err.message || 'Could not confirm today’s reflection.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      <Header back />
      <Banner title="Daily reflection" cls="bg-cobalt text-white" frames={['reflect1', 'reflect2', 'reflect3', 'reflect4']}>
        Every evening after sessions, your reflection team gathers to pause, share emotions, answer today’s questions, and earn +{ptsPerDay} PTS together.
      </Banner>

      {/* Explanation & Evening Rules */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Step n="01" tag="When" title="Every evening" cls="bg-sun">
          <p className="text-sm font-medium">
            Daily reflection takes place <b>every evening after the sessions</b>. Teams meet on their own at any cozy spot on campus.
          </p>
        </Step>
        <Step n="02" tag="Who leads" title="Choose a leader" cls="bg-neon">
          <p className="text-sm font-medium">
            Pick a team <b>Reflection Leader (Головний рефлексії)</b> who gathers everyone, leads the discussion, and makes sure every voice is heard.
          </p>
        </Step>
        <Step n="03" tag="Reward" title={`+${ptsPerDay} PTS per person`} cls="bg-[#B89CFF]">
          <p className="text-sm font-medium">
            Open the link below, answer all questions, and press <b>Done today</b> in your team box — every member gets <b>+{ptsPerDay} PTS</b> once per day!
          </p>
        </Step>
      </section>

      {/* Daily Prompts & Link */}
      <section className="box shadow-b8 overflow-hidden">
        <div className="bg-sun border-b-[3px] border-ink px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-extrabold uppercase">📝 Tonight’s reflection questions</h2>
          {padletUrl && (
            <a href={padletUrl} target="_blank" rel="noopener noreferrer" className="btn bg-ink text-sun text-xs">
              Open reflection board →
            </a>
          )}
        </div>
        <div className="p-4 sm:p-6 bg-paper flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REFLECTION_PROMPTS.map((q, i) => (
              <div key={q} className="border-[3px] border-ink rounded-xl bg-white p-4 shadow-b4 flex flex-col gap-1.5">
                <span className="tag bg-cobalt text-white self-start">Question {String(i + 1).padStart(2, '0')}</span>
                <p className="font-extrabold text-sm sm:text-base leading-snug">{q}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="font-mono text-xs text-mute">Discuss these together, post your answers at the link, then confirm below.</span>
            {padletUrl && (
              <a href={padletUrl} target="_blank" rel="noopener noreferrer" className="btn bg-cobalt text-white text-xs">
                Go to reflection link →
              </a>
            )}
          </div>
        </div>
      </section>

      {/* My Team Box */}
      <section className="box shadow-b8 overflow-hidden">
        <div className="bg-ink text-white px-4 sm:px-6 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>🪞 My reflection team</span>
          <span className="text-sun">{today}</span>
        </div>
        <div className="p-4 sm:p-6 bg-white flex flex-col gap-4">
          {!profile && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">Sign in to see your reflection team, pick a leader, and claim your +{ptsPerDay} PTS.</p>
              <button className="btn bg-neon text-xs" onClick={() => openAccount(null)}>Sign in / Register</button>
            </div>
          )}

          {profile && !myTeam && (
            <p className="font-mono text-sm text-mute">
              You have not been assigned to a reflection team yet. Ask an organizer to put you in a team!
            </p>
          )}

          {profile && myTeam && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="tag bg-cobalt text-white">YOUR TEAM</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold uppercase mt-1">{myTeam.name}</h3>
                </div>
                {myTeamDone ? (
                  <span className="tag bg-neon text-ink text-sm px-3 py-1.5">✓ DONE TODAY (+{myTeamDone.points || ptsPerDay} PTS)</span>
                ) : (
                  <span className="tag bg-sun text-ink text-sm px-3 py-1.5">WAITING FOR TODAY’S REFLECTION</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(myTeam.memberIds || []).map((uid) => (
                  <span key={uid} className={`tag ${uid === profile.id ? 'bg-sun' : 'bg-paper'}`}>
                    {nameOf(uid)}{uid === profile.id ? ' (you)' : ''}
                  </span>
                ))}
              </div>

              <form onSubmit={saveLeader} className="border-[3px] border-ink rounded-xl bg-paper p-4 flex flex-col sm:flex-row sm:items-end gap-3">
                <label className="flex-1 flex flex-col gap-1 font-mono text-xs font-bold uppercase">
                  <span>Reflection leader for {myTeam.name} (Головний рефлексії)</span>
                  <input
                    className="input !shadow-none"
                    list="my-reflection-members"
                    maxLength={50}
                    placeholder="Pick a member or type leader name…"
                    value={leaderName}
                    onChange={(e) => { setLeaderName(e.target.value); setOk(''); setMsg(''); }}
                  />
                  <datalist id="my-reflection-members">
                    {(myTeam.memberIds || []).map((uid) => (
                      <option key={uid} value={nameOf(uid)} />
                    ))}
                  </datalist>
                </label>
                <button type="submit" disabled={busy || !leaderName.trim()} className="btn bg-sun text-xs disabled:opacity-50">
                  Save leader
                </button>
              </form>

              {msg && <p className="font-mono text-sm font-bold text-hot">{msg}</p>}
              {ok && <p className="border-[3px] border-ink rounded-xl bg-neon px-4 py-3 font-bold shadow-b4">{ok}</p>}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t-2 border-ink/15">
                <p className="text-xs sm:text-sm font-medium text-mute">
                  Finished discussing and posting at the reflection link? Confirm to give every member +{ptsPerDay} PTS!
                </p>
                <button
                  type="button"
                  disabled={busy || !!myTeamDone}
                  onClick={markDone}
                  className="btn bg-neon text-ink disabled:opacity-50"
                >
                  {myTeamDone ? '✓ Completed today' : busy ? 'Confirming…' : `✓ Reflection done today (+${ptsPerDay} PTS)`}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* All Reflection Teams Overview */}
      <section className="box shadow-b8 overflow-hidden">
        <div className="bg-sun border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>👥 Reflection teams &amp; members ({teams.length})</span>
          <span className="text-xs">Today: {today}</span>
        </div>
        <div className="p-4 sm:p-6 bg-paper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => {
            const done = reflectionLogs.find((l) => l.teamId === t.id && l.day === today);
            const isMine = myTeam?.id === t.id;
            return (
              <div
                key={t.id}
                className={`border-[3px] border-ink rounded-xl p-4 shadow-b4 flex flex-col gap-2.5 ${isMine ? 'bg-sun/35' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold uppercase text-lg leading-tight break-words">{t.name}</h4>
                  <span className={`tag shrink-0 ${done ? 'bg-neon text-ink' : 'bg-paper text-mute'}`}>
                    {done ? 'DONE ✓' : 'WAITING'}
                  </span>
                </div>
                <div className="font-mono text-xs">
                  <b>Leader:</b> {t.leaderName || <span className="text-mute">Not chosen yet</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(t.memberIds || []).map((uid) => (
                    <span key={uid} className={`tag !text-[10px] ${uid === profile?.id ? 'bg-sun' : 'bg-paper'}`}>
                      {nameOf(uid)}
                    </span>
                  ))}
                  {(!t.memberIds || t.memberIds.length === 0) && (
                    <span className="font-mono text-xs text-mute">No members yet</span>
                  )}
                </div>
              </div>
            );
          })}
          {teams.length === 0 && (
            <p className="font-mono text-sm text-mute col-span-full">
              Reflection teams have not been created by organizers yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
