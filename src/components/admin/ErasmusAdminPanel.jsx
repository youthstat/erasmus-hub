import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { countryOf } from '../../hooks/useGame.js';
import { JOURNEY_STOPS } from '../../data/erasmusGames.js';
import { MAX_STOP_ATTEMPTS, subscribeAllErasmusProgress } from '../../firebase/erasmus.js';
import { ERASMUS_SPRITES, ERASMUS_STICKERS } from '../../assets/erasmus/index.js';

export default function ErasmusAdminPanel() {
  const { users, setError } = useApp();
  const [progressMap, setProgressMap] = useState(() => new Map());

  useEffect(() => {
    const off = subscribeAllErasmusProgress(setProgressMap, (e) => setError(e.message));
    return () => off();
  }, [setError]);

  const rows = users.map((u) => {
    const p = progressMap.get(u.id);
    const games = p?.games || {};
    const playedStops = JOURNEY_STOPS.filter((s) => (Number(games[s.id]?.attempts) || 0) > 0).length;
    const totalAttempts = JOURNEY_STOPS.reduce((sum, s) => sum + (Number(games[s.id]?.attempts) || 0), 0);
    const totalEarned = Math.min(
      100,
      JOURNEY_STOPS.reduce((sum, s) => sum + (Number(games[s.id]?.best) || 0), 0) || Number(p?.totalEarned) || 0,
    );
    return {
      user: u,
      playedStops,
      totalAttempts,
      totalEarned,
    };
  });

  const startedCount = rows.filter((r) => r.playedStops > 0).length;

  return (
    <div className="flex flex-col gap-5">
      <section className="box overflow-hidden bg-white">
        <div className="bg-[#FFE200] border-b-[3px] border-ink px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src={ERASMUS_STICKERS.cheese} alt="" className="w-7 h-7 object-contain" draggable={false} />
            <h3 className="font-mono font-extrabold uppercase text-sm sm:text-base">
              Erasmus+ Progress &amp; Automatic Hub Rating Sync
            </h3>
          </div>
          <span className="tag bg-neon text-ink">AUTO-CREDITED · MAX {MAX_STOP_ATTEMPTS} TRIES/STOP</span>
        </div>

        <div className="p-4 sm:p-5 bg-paper flex items-center gap-4">
          <img src={ERASMUS_SPRITES.trioCheer} alt="Pretty Patty" className="w-16 h-16 object-contain shrink-0" draggable={false} />
          <p className="text-xs sm:text-sm font-bold text-ink/90">
            Points credit <b>automatically</b> to each participant’s Hub Rating as they progress through all 9 blocks (maximum <b>{MAX_STOP_ATTEMPTS} attempts</b> per block). On Stop 5, self-reflections &amp; quizzes also award <b>+500 Outfit Coins</b> for the Mouse Wardrobe!
          </p>
        </div>
      </section>

      <section className="box overflow-hidden bg-white">
        <div className="bg-ink text-white border-b-[3px] border-ink px-4 sm:px-5 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <span>Participant Erasmus+ Progress ({startedCount} started)</span>
          <span className="text-sun">Max 100 PTS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#ebe7e7] border-b-[3px] border-ink font-mono text-xs uppercase">
                <th className="p-3">Participant</th>
                <th className="p-3">Country</th>
                <th className="p-3">Stops started</th>
                <th className="p-3">Total tries</th>
                <th className="p-3">Auto-Credited Score</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink">
              {rows.map(({ user, playedStops, totalAttempts, totalEarned }) => (
                <tr key={user.id} className={user.isDemo ? 'bg-[#B89CFF]/15' : ''}>
                  <td className="p-3 font-bold">
                    {user.name}
                    {user.isDemo && <span className="tag bg-[#B89CFF] text-ink !text-[10px] ml-2">DEMO</span>}
                  </td>
                  <td className="p-3 text-mute">{countryOf(user)}</td>
                  <td className="p-3 font-mono font-bold tabular-nums">{playedStops} / 9</td>
                  <td className="p-3 font-mono font-bold tabular-nums">{totalAttempts} / {9 * MAX_STOP_ATTEMPTS}</td>
                  <td className="p-3">
                    {totalEarned > 0 ? (
                      <span className="tag bg-neon text-ink tabular-nums">✓ {totalEarned} / 100 PTS</span>
                    ) : (
                      <span className="font-mono text-xs text-mute">Not started</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 font-mono">No participants yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
