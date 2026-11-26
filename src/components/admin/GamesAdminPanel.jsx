import { useState } from 'react';
import { KILL_MOODS } from '../../config/settings.js';
import { useApp } from '../../context/AppContext.jsx';
import * as games from '../../firebase/games.js';
import { isJoined } from '../../firebase/games.js';
import { DEMO_IDS } from '../../firebase/services.js';
import { useGame, countryOf } from '../../hooks/useGame.js';

const DEMO_ID_LIST = Object.values(DEMO_IDS);

// Admin: choose who plays which game (with Include All / Exclude All)
function WhoPlays({ mode = 'all' }) {
  const { users, setError } = useApp();
  const sf = useGame('sf');
  const kg = useGame('kg');
  const [busy, setBusy] = useState(false);

  const realUsers = users.filter((u) => !u.isDemo);
  const nonDemoIds = realUsers.map((u) => u.id);

  const toggle = async (game, g, id) => {
    const plays = g.excluded.has(id);
    if (!plays && !confirm(`Remove ${g.nameOf(id)} from ${game === 'sf' ? 'Secret friend' : 'Killer game'}? ${game === 'kg' ? 'They will be marked as killed and their hunter inherits the contract.' : 'Their link will be removed and freed.'}`)) return;
    try { await games.setPlays(game, id, plays, g.nameOf); } catch (e) { setError(e.message); }
  };

  const setAll = async (game, plays) => {
    const label = game === 'sf' ? 'Secret friend' : 'Killer game';
    if (!plays && !confirm(`Exclude ALL participants from ${label}?`)) return;
    setBusy(true);
    try {
      await games.setAllPlays(game, nonDemoIds, plays, DEMO_ID_LIST);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const Box = ({ game, g, id }) => (
    <input type="checkbox" className="w-5 h-5 accent-ink cursor-pointer" checked={!g.excluded.has(id)} onChange={() => toggle(game, g, id)} />
  );

  const showSf = mode === 'all' || mode === 'sf';
  const showKg = mode === 'all' || mode === 'kg';

  return (
    <section className="box overflow-hidden">
      <div className="bg-sun border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
        <span>Who plays {mode === 'sf' ? 'Secret Friend' : mode === 'kg' ? 'Killer Game' : 'which game'}</span>
        <div className="flex flex-wrap gap-1.5">
          {showSf && (
            <>
              <button type="button" disabled={busy || !nonDemoIds.length} className="tag bg-neon text-ink disabled:opacity-50" onClick={() => setAll('sf', true)}>✓ Include all SF</button>
              <button type="button" disabled={busy || !nonDemoIds.length} className="tag bg-hot text-white disabled:opacity-50" onClick={() => setAll('sf', false)}>✕ Exclude all SF</button>
            </>
          )}
          {showKg && (
            <>
              <button type="button" disabled={busy || !nonDemoIds.length} className="tag bg-neon text-ink disabled:opacity-50" onClick={() => setAll('kg', true)}>✓ Include all KG</button>
              <button type="button" disabled={busy || !nonDemoIds.length} className="tag bg-hot text-white disabled:opacity-50" onClick={() => setAll('kg', false)}>✕ Exclude all KG</button>
            </>
          )}
        </div>
      </div>
      <div className="overflow-x-auto max-h-[26rem] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#ebe7e7] border-b-[3px] border-ink font-mono text-xs uppercase">
              <th className="p-3">Participant</th>
              <th className="p-3">Country</th>
              {showSf && <th className="p-3 text-center">Secret friend</th>}
              {showKg && <th className="p-3 text-center">Killer game</th>}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink">
            {realUsers.map((u) => (
              <tr key={u.id}>
                <td className="p-3 font-bold">{u.name}</td>
                <td className="p-3 text-mute">{countryOf(u)}</td>
                {showSf && <td className="p-3 text-center"><Box game="sf" g={sf} id={u.id} /></td>}
                {showKg && <td className="p-3 text-center"><Box game="kg" g={kg} id={u.id} /></td>}
              </tr>
            ))}
            {realUsers.length === 0 && <tr><td colSpan="4" className="p-4 font-mono">No participants yet. Add them in the leaderboard.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="p-3 font-mono text-xs text-mute border-t-[3px] border-ink">
        Checked = enabled for the game. Demo accounts (Rattie Patty &amp; Admin) stay excluded from participants’ pool automatically.
      </p>
    </section>
  );
}

function SecretFriendLinks() {
  const { users, setError } = useApp();
  const g = useGame('sf');
  const { players, playing, byId, nameOf } = g;
  const [busy, setBusy] = useState(false);

  const realPlaying = playing.filter((u) => !u.isDemo);
  const realIds = realPlaying.map((u) => u.id);
  const realPlayers = players.filter((p) => !p.isDemo);
  const demoPairs = players.filter((p) => p.isDemo);

  const shuffleAll = async () => {
    if (!confirm(`Generate / re-shuffle Secret Friend pairings for all ${realIds.length} enabled participants?`)) return;
    setBusy(true);
    try {
      await games.assignAllSecretFriends(realIds, nameOf);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const changeTarget = async (giverId, newTargetId) => {
    setBusy(true);
    try {
      await games.setSecretFriendTarget(giverId, newTargetId || null, nameOf);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!confirm('Reset "Secret friend"? All players, links and chats will be deleted.')) return;
    try { await games.resetGame('sf'); } catch (e) { setError(e.message); }
  };

  const rows = realPlaying.map((u) => ({
    user: u,
    player: byId.get(u.id) || null,
  }));

  return (
    <div className="flex flex-col gap-4">
      <section className="box overflow-hidden">
        <div className="bg-neon border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
          <span>Secret friend pairings · {realPlayers.filter(isJoined).length} joined · {realPlayers.filter((p) => p.targetId).length} assigned</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy || realIds.length < 2} className="tag bg-ink text-sun disabled:opacity-50" onClick={shuffleAll}>
              🎲 Generate / Shuffle all
            </button>
            <button type="button" className="tag bg-white text-ink" onClick={reset}>RESET GAME</button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[30rem] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#ebe7e7] border-b-[3px] border-ink font-mono text-xs uppercase">
                <th className="p-3">Giver (Participant)</th>
                <th className="p-3">→ Secret friend of (editable)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink">
              {rows.map(({ user, player }) => {
                const targetId = player?.targetId || '';
                const revealed = targetId && player?.revealed !== false;
                return (
                  <tr key={user.id}>
                    <td className="p-3 font-bold">{user.name}</td>
                    <td className="p-3">
                      <select
                        disabled={busy}
                        value={targetId}
                        onChange={(e) => changeTarget(user.id, e.target.value)}
                        className="border-2 border-ink rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold bg-white min-w-[180px]"
                      >
                        <option value="">— Not assigned —</option>
                        {realPlaying
                          .filter((cand) => cand.id !== user.id)
                          .map((cand) => (
                            <option key={cand.id} value={cand.id}>
                              {cand.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="p-3">
                      {revealed ? (
                        <span className="tag bg-neon text-ink">REVEALED</span>
                      ) : targetId ? (
                        <span className="tag bg-sun text-ink">PRE-ASSIGNED (HIDDEN)</span>
                      ) : isJoined(player) ? (
                        <span className="tag bg-white">JOINED</span>
                      ) : (
                        <span className="font-mono text-xs text-mute">Waiting</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan="3" className="p-4 font-mono">No enabled participants yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="p-3 font-mono text-xs text-mute border-t-[3px] border-ink">
          Use 🎲 Generate / Shuffle all before the game or edit any target dropdown directly. Pre-assigned pairings stay hidden from the participant until they press “Show me who I am secret friend of”.
        </p>
      </section>

      {demoPairs.length > 0 && (
        <div className="border-[3px] border-ink rounded-xl bg-[#B89CFF]/30 p-4 flex flex-col gap-2">
          <div className="font-mono text-xs font-extrabold uppercase">🐭 Demo showcase pairing (isolated from participants)</div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {demoPairs.map((p) => {
              const uName = users.find((u) => u.id === p.id)?.name || p.id;
              const tName = users.find((u) => u.id === p.targetId)?.name || p.targetName || '—';
              return (
                <span key={p.id} className="tag bg-white text-ink">
                  <b>{uName}</b> → <b>{tName}</b> (pw: 1234)
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function KillerLinks() {
  const { setError } = useApp();
  const g = useGame('kg');
  const { players, playing, dead, nameOf } = g;
  const reset = async () => {
    if (!confirm('Reset "Killer game"? All players, numbers and links will be deleted.')) return;
    try { await games.resetGame('kg'); } catch (e) { setError(e.message); }
  };
  const kill = async (id) => {
    if (!confirm(`Eliminate ${nameOf(id)}? Their hunter inherits the contract.`)) return;
    try { await games.adminEliminate(id, nameOf); } catch (e) { setError(e.message); }
  };
  const revive = async (id) => {
    if (!confirm(`Bring ${nameOf(id)} back to the game? Their hunter gets them as the target again.`)) return;
    try {
      await games.revivePlayer(id, nameOf);
      if (g.excluded.has(id)) await games.setPlays('kg', id, true, nameOf);
    } catch (e) { setError(e.message); }
  };
  const rows = players.filter((p) => !p.isDemo && (isJoined(p) || p.dead));
  return (
    <section className="box overflow-hidden">
      <div className="bg-hot text-white border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap justify-between gap-2">
        <span>Killer game contracts · {rows.filter(isJoined).length} joined · {rows.filter((p) => p.targetId).length} received a name · {playing.filter((u) => !u.isDemo && !dead.has(u.id)).length} alive</span>
        <button className="tag bg-white text-ink" onClick={reset}>RESET GAME</button>
      </div>
      <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#ebe7e7] border-b-[3px] border-ink font-mono text-xs uppercase">
              <th className="p-3">Player</th>
              <th className="p-3">→ Hunts</th>
              <th className="p-3">Weapon</th>
              <th className="p-3">Own item</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink">
            {rows.map((p) => (
              <tr key={p.id} className={p.dead ? 'text-mute' : ''}>
                <td className={`p-3 font-bold ${p.dead ? 'line-through' : ''}`}>{nameOf(p.id)}</td>
                <td className="p-3">{p.targetId && !p.dead ? nameOf(p.targetId) : <span className="text-mute">—</span>}</td>
                <td className="p-3">{p.itemText || <span className="text-mute">—</span>}</td>
                <td className="p-3">{p.item}</td>
                <td className="p-3">
                  <span className={`tag ${p.dead ? 'bg-hot text-white' : 'bg-neon text-ink'}`}>{p.dead ? 'KILLED' : 'ALIVE'}</span>
                  {p.dead && p.killStory && <div className="mt-1 text-xs text-ink max-w-xs whitespace-normal">{KILL_MOODS.find((m) => m.id === p.killStory.difficulty)?.label}{p.killStory.text ? ` “${p.killStory.text}”` : ''}</div>}
                  {p.dead && p.killSecret && <div className="mt-1 text-xs text-mute">story kept secret</div>}
                </td>
                <td className="p-3">
                  {p.dead
                    ? <button className="tag bg-neon text-ink" onClick={() => revive(p.id)} title="Undo the kill">↩ REVIVE</button>
                    : <button className="tag bg-white" onClick={() => kill(p.id)}>ELIMINATE</button>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="6" className="p-4 font-mono">Nobody joined yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function GamesAdminPanel({ mode = 'all' }) {
  return (
    <div className="flex flex-col gap-6">
      <WhoPlays mode={mode} />
      {(mode === 'all' || mode === 'sf') && <SecretFriendLinks />}
      {(mode === 'all' || mode === 'kg') && <KillerLinks />}
    </div>
  );
}
