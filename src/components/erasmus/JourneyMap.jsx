import { ERASMUS_BGS, ERASMUS_PROPS, ERASMUS_SPRITES, ERASMUS_STICKERS } from '../../assets/erasmus/index.js';
import { JOURNEY_STOPS, getRatingLevel } from '../../data/erasmusGames.js';

export function ErasmusClaimBanner({
  totalEarned,
  progress,
  claimOpen,
  profile,
  claimBusy,
  onClaimToRating,
  onSignIn,
}) {
  const claimed = !!progress?.ratingClaimed;
  const claimedPoints = Number(progress?.claimedPoints) || 0;

  return (
    <div className={`border-[3px] border-ink rounded-2xl p-4 sm:p-5 shadow-b6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
      claimed ? 'bg-neon/35' : claimOpen ? 'bg-[#FFE200]/55' : 'bg-white'
    }`}>
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <img
          src={claimed ? ERASMUS_SPRITES.trioCheer : claimOpen ? ERASMUS_STICKERS.cheese : ERASMUS_STICKERS.folderLock}
          alt=""
          draggable={false}
          className="w-12 h-12 object-contain shrink-0"
        />
        <div className="min-w-0">
          <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
            Hub Rating Transfer · One-time send
          </div>
          {claimed ? (
            <div className="font-extrabold text-sm sm:text-base text-ink">
              ✓ Sent +{claimedPoints} PTS to your Hub Rating! You can keep replaying any game below for fun.
            </div>
          ) : !profile ? (
            <div className="font-bold text-xs sm:text-sm text-ink">
              Sign in with your participant name to save your 0–100 score and send it to the leaderboard once unlocked.
            </div>
          ) : !claimOpen ? (
            <div className="font-bold text-xs sm:text-sm text-ink/90">
              Your Erasmus+ score updates automatically ({totalEarned}/100 PTS). You can replay all 9 games as many times as you want — sending points to your rating unlocks once the organizers allow it (one-time transfer).
            </div>
          ) : (
            <div className="font-bold text-xs sm:text-sm text-ink">
              Permission is OPEN! Send your current score ({totalEarned}/100 PTS) to your Hub rating — you can only press this button <b>once</b>, so make sure you are happy with your score first!
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0">
        {!profile ? (
          <button type="button" onClick={onSignIn} className="btn bg-ink text-sun text-xs w-full md:w-auto">
            Sign in / Register
          </button>
        ) : claimed ? (
          <span className="tag bg-neon text-ink text-xs px-3 py-2 inline-block">
            ✓ SENT +{claimedPoints} PTS (USED 1/1)
          </span>
        ) : (
          <button
            type="button"
            disabled={!claimOpen || totalEarned <= 0 || claimBusy}
            onClick={onClaimToRating}
            className={`btn text-xs w-full md:w-auto disabled:opacity-55 disabled:cursor-not-allowed ${
              claimOpen && totalEarned > 0 ? 'bg-neon text-ink' : 'bg-paper text-ink'
            }`}
          >
            {claimBusy
              ? 'Sending…'
              : !claimOpen
                ? '🔒 Send points to rating (Locked by Admin)'
                : totalEarned <= 0
                  ? 'Play a game first (0 PTS)'
                  : `Send ${totalEarned} PTS to rating →`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function JourneyMap({
  progress,
  claimOpen,
  profile,
  claimBusy,
  onClaimToRating,
  onSignIn,
  onOpenStop,
  onOpenEssentials,
  onOpenResults,
}) {
  const games = progress?.games || {};
  const totalEarned = Math.min(
    100,
    JOURNEY_STOPS.reduce((sum, s) => sum + (Number(games[s.id]?.best) || 0), 0),
  );
  const completedCount = JOURNEY_STOPS.filter((s) => (games[s.id]?.attempts || 0) > 0).length;
  const rating = getRatingLevel(totalEarned);

  return (
    <div className="flex flex-col gap-6">
      {/* Journey Summary + 9-Color Competence Cheese Progress Bar */}
      <div className="box shadow-b8 overflow-hidden bg-white">
        <div className="bg-ink text-white px-5 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-ink">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={ERASMUS_BGS.journeyMap}
              alt="Erasmus+ Trail"
              className="hidden sm:block w-36 h-14 object-cover rounded-xl border-2 border-sun shrink-0"
              draggable={false}
            />
            <div className="min-w-0">
              <div className="font-mono text-xs font-extrabold uppercase text-sun">
                9 Stops · 8 Key Competences · 100 Points Total
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold uppercase leading-tight mt-0.5">
                Pretty Patty’s Competence Trail
              </h2>
            </div>
          </div>
          <img
            src={ERASMUS_SPRITES.pattyReading}
            alt="Pretty Patty with backpack"
            draggable={false}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
          />
        </div>

        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 bg-paper">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img src={ERASMUS_PROPS.cheese} alt="Cheese meter" className="w-10 h-10 object-contain shrink-0" draggable={false} />
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between font-mono text-xs font-extrabold uppercase mb-1.5">
                <span>Cheese Progress · {completedCount}/9 stops played</span>
                <span className="tabular-nums">{totalEarned} / 100 PTS</span>
              </div>
              <div className="h-4 w-full border-[3px] border-ink rounded-full bg-white overflow-hidden flex">
                {JOURNEY_STOPS.map((st) => {
                  const best = Number(games[st.id]?.best) || 0;
                  const fillRatio = Math.min(1, best / st.maxPoints);
                  return (
                    <div
                      key={st.id}
                      title={`${st.title}: ${best}/${st.maxPoints} PTS`}
                      className="h-full border-r border-ink/30 last:border-r-0 bg-paper relative"
                      style={{ width: `${(st.maxPoints / 100) * 100}%` }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${fillRatio * 100}%`, backgroundColor: st.barHex }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button type="button" onClick={onOpenEssentials} className="btn bg-white text-ink text-xs">
              Handbook &amp; Links
            </button>
            <button type="button" onClick={onOpenResults} className="btn bg-sun text-ink text-xs">
              Youthpass Radar ({rating.title})
            </button>
          </div>
        </div>
      </div>

      {/* Single-use Admin-Gated Rating Claim Banner */}
      <ErasmusClaimBanner
        totalEarned={totalEarned}
        progress={progress}
        claimOpen={claimOpen}
        profile={profile}
        claimBusy={claimBusy}
        onClaimToRating={onClaimToRating}
        onSignIn={onSignIn}
      />

      {/* 9-Stop Interactive Map Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {JOURNEY_STOPS.map((stop) => {
          const entry = games[stop.id];
          const best = Number(entry?.best) || 0;
          const played = (Number(entry?.attempts) || 0) > 0;
          const maxed = best >= stop.maxPoints;
          const bg = ERASMUS_BGS[stop.bgKey] || ERASMUS_BGS.mouseHole;

          return (
            <div
              key={stop.id}
              className="box shadow-b6 overflow-hidden flex flex-col justify-between bg-white hover:-translate-y-0.5 hover:shadow-b8 transition-all"
            >
              <div>
                <div className="relative h-32 w-full border-b-[3px] border-ink overflow-hidden bg-ink">
                  <img src={bg} alt={stop.location} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35" />
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                    <span className="tag bg-sun text-ink text-[10px]">
                      Stop {String(stop.id).padStart(2, '0')} · {stop.location}
                    </span>
                    <span
                      className={`tag text-[10px] tabular-nums ${
                        maxed ? 'bg-neon text-ink' : played ? 'bg-white text-ink' : 'bg-paper text-mute'
                      }`}
                    >
                      {best}/{stop.maxPoints} PTS
                    </span>
                  </div>
                  <img
                    src={ERASMUS_SPRITES[stop.pattyPose] || ERASMUS_SPRITES.pattyIdle}
                    alt=""
                    draggable={false}
                    className="w-14 h-14 object-contain absolute bottom-1.5 right-2 drop-shadow-[0_2px_0_rgba(0,0,0,0.65)]"
                  />
                </div>

                <div className="p-4 flex flex-col gap-1.5">
                  <div className="font-mono text-[11px] font-extrabold uppercase text-cobalt">
                    {stop.competenceLabel}
                  </div>
                  <h3 className="text-xl font-extrabold uppercase leading-tight">{stop.title}</h3>
                  <p className="text-xs sm:text-sm font-medium text-ink/85 leading-snug">{stop.summary}</p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-bold uppercase text-mute">
                  {maxed ? 'Mastered ✓' : played ? 'Played · Replayable' : 'Ready to play'}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenStop(stop.id)}
                  className={`btn text-xs ${played ? 'bg-paper text-ink' : 'bg-neon text-ink'}`}
                >
                  {played ? 'Replay' : 'Start →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
