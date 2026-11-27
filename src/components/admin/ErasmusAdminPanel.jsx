import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { countryOf } from '../../hooks/useGame.js';
import { JOURNEY_STOPS } from '../../data/erasmusGames.js';
import {
  setErasmusClaimOpen,
  subscribeAllErasmusProgress,
  subscribeErasmusSettings,
} from '../../firebase/erasmus.js';
import { ERASMUS_SPRITES, ERASMUS_STICKERS } from '../../assets/erasmus/index.js';

export default function ErasmusAdminPanel() {
  const { users, setError } = useApp();
  const [settings, setSettings] = useState({ claimOpen: false });
  const [progressMap, setProgressMap] = useState(() => new Map());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onErr = (e) => setError(e.message);
    const offs = [
      subscribeErasmusSettings(setSettings, onErr),
      subscribeAllErasmusProgress(setProgressMap, onErr),
    ];
    return () => offs.forEach((o) => o());
  }, [setError]);

  const toggleClaim = async () => {
    setBusy(true);
    try {
      await setErasmusClaimOpen(!settings.claimOpen);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const rows = users.map((u) => {
    const p = progressMap.get(u.id);
    const games = p?.games || {};
    const playedStops = JOURNEY_STOPS.filter((s) => (Number(games[s.id]?.attempts) || 0) > 0).length;
    const totalEarned = Math.min(
      100,
      JOURNEY_STOPS.reduce((sum, s) => sum + (Number(games[s.id]?.best) || 0), 0) || Number(p?.totalEarned) || 0,
    );
    return {
      user: u,
      playedStops,
      totalEarned,
      ratingClaimed: !!p?.ratingClaimed,
      claimedPoints: Number(p?.claimedPoints) || 0,
    };
  });

  const claimedCount = rows.filter((r) => r.ratingClaimed).length;
  const startedCount = rows.filter((r) => r.playedStops > 0).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Rating Transfer Permission Switch */}
      <section className="box overflow-hidden bg-white">
        <div className="bg-[#FFE200] border-b-[3px] border-ink px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src={ERASMUS_STICKERS.cheese} alt="" className="w-7 h-7 object-contain" draggable={false} />
            <h3 className="font-mono font-extrabold uppercase text-sm sm:text-base">
              Erasmus+ → Rating Claim Permission
            </h3>
          </div>
          <span className={`tag ${settings.claimOpen ? 'bg-neon text-ink' : 'bg-hot text-white'}`}>
            {settings.claimOpen ? 'OPEN · PARTICIPANTS CAN CLAIM' : 'LOCKED · WAITING FOR ADMIN'}
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={settings.claimOpen ? ERASMUS_SPRITES.trioCheer : ERASMUS_SPRITES.trioCurious}
              alt="Pretty Patty"
              className="w-16 h-16 object-contain shrink-0"
              draggable={false}
            />
            <div className="flex flex-col gap-1">
              <div className="font-extrabold text-base uppercase">
                {settings.claimOpen
                  ? 'Participants can now send their 0–100 Erasmus+ score to the Hub Rating (once per person).'
                  : 'Claim button is currently locked for participants.'}
              </div>
              <p className="text-xs sm:text-sm font-medium text-ink/80">
                Participants’ scores update automatically out of 100 as they play and replay the 9 stops. When you turn this ON, each participant can click <b>“Send points to rating”</b> one single time to add their score to the Hub leaderboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={toggleClaim}
            className={`btn shrink-0 ${settings.claimOpen ? 'bg-hot text-white' : 'bg-neon text-ink'} disabled:opacity-50`}
          >
            {busy ? 'Saving…' : settings.claimOpen ? '🔒 Lock rating claims' : '🔓 Allow sending points to rating'}
          </button>
        </div>
      </section>

      {/* Participant Erasmus+ Scores Table */}
      <section className="box overflow-hidden bg-white">
        <div className="bg-ink text-white border-b-[3px] border-ink px-4 sm:px-5 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <span>Participant Erasmus+ Progress ({startedCount} started · {claimedCount} sent to rating)</span>
          <span className="text-sun">Max 100 PTS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#ebe7e7] border-b-[3px] border-ink font-mono text-xs uppercase">
                <th className="p-3">Participant</th>
                <th className="p-3">Country</th>
                <th className="p-3">Stops played</th>
                <th className="p-3">Earned (0–100)</th>
                <th className="p-3">Rating transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink">
              {rows.map(({ user, playedStops, totalEarned, ratingClaimed, claimedPoints }) => (
                <tr key={user.id} className={user.isDemo ? 'bg-[#B89CFF]/15' : ''}>
                  <td className="p-3 font-bold">
                    {user.name}
                    {user.isDemo && <span className="tag bg-[#B89CFF] text-ink !text-[10px] ml-2">DEMO</span>}
                  </td>
                  <td className="p-3 text-mute">{countryOf(user)}</td>
                  <td className="p-3 font-mono font-bold tabular-nums">{playedStops} / 9</td>
                  <td className="p-3 font-mono font-extrabold tabular-nums">{totalEarned} / 100 PTS</td>
                  <td className="p-3">
                    {ratingClaimed ? (
                      <span className="tag bg-neon text-ink">✓ SENT +{claimedPoints} PTS</span>
                    ) : totalEarned > 0 ? (
                      <span className="tag bg-sun text-ink">
                        {settings.claimOpen ? 'READY TO CLAIM' : 'WAITING PERMISSION'}
                      </span>
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
