import { ERASMUS_PROPS, ERASMUS_SPRITES } from '../../assets/erasmus/index.js';
import { JOURNEY_STOPS, OFFICIAL_LINKS, getRatingLevel } from '../../data/erasmusGames.js';
import { ErasmusClaimBanner } from './JourneyMap.jsx';

const AXES = [
  { key: 'literacy', stopId: 1, short: 'Literacy', full: '1. Literacy' },
  { key: 'multilingual', stopId: 2, short: 'Multilingual', full: '2. Multilingual' },
  { key: 'math', stopId: 3, short: 'Grants/Math', full: '3. Math, Science & Tech' },
  { key: 'digital', stopId: 4, short: 'Digital', full: '4. Digital' },
  { key: 'personal', stopId: 5, short: 'Personal/Social', full: '5. Personal, Social & Learning' },
  { key: 'citizenship', stopId: 6, short: 'Citizenship', full: '6. Citizenship' },
  { key: 'entrepreneurship', stopId: 7, short: 'Pitch/Entrep.', full: '7. Entrepreneurship' },
  { key: 'cultural', stopId: 8, short: 'Cultural', full: '8. Cultural Awareness' },
];

function CompetenceRadarChart({ values }) {
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 110;
  const n = AXES.length;

  const ptAt = (idx, ratio) => {
    const angle = (-Math.PI / 2) + (idx * 2 * Math.PI) / n;
    return [
      cx + Math.cos(angle) * maxR * ratio,
      cy + Math.sin(angle) * maxR * ratio,
    ];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const polyPoints = AXES.map((a, i) => ptAt(i, Math.max(0.08, values[a.key] || 0)).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[360px] mx-auto select-none">
      {rings.map((r) => (
        <polygon
          key={r}
          points={AXES.map((_, i) => ptAt(i, r).join(',')).join(' ')}
          fill={r === 1 ? '#F4F3EE' : 'none'}
          stroke="#111111"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
      ))}

      {AXES.map((a, i) => {
        const [x2, y2] = ptAt(i, 1);
        const [lx, ly] = ptAt(i, 1.25);
        return (
          <g key={a.key}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#111111" strokeOpacity="0.25" strokeWidth="1.5" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#111111] font-mono text-[10px] font-extrabold uppercase"
            >
              {a.short}
            </text>
          </g>
        );
      })}

      <polygon
        points={polyPoints}
        fill="#FFE200"
        fillOpacity="0.58"
        stroke="#111111"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {AXES.map((a, i) => {
        const [vx, vy] = ptAt(i, Math.max(0.08, values[a.key] || 0));
        return (
          <circle
            key={a.key}
            cx={vx}
            cy={vy}
            r="4.5"
            fill="#2E5BFF"
            stroke="#111111"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

export default function ErasmusResults({
  progress,
  claimOpen,
  profile,
  claimBusy,
  onClaimToRating,
  onSignIn,
  onOpenStop,
  onBackToMap,
}) {
  const games = progress?.games || {};
  const totalScore = Math.min(
    100,
    JOURNEY_STOPS.reduce((sum, s) => sum + (Number(games[s.id]?.best) || 0), 0),
  );
  const rating = getRatingLevel(totalScore);
  const finalBest = Number(games[9]?.best) || 0;

  const competenceRatios = {};
  AXES.forEach((ax) => {
    const stop = JOURNEY_STOPS.find((s) => s.id === ax.stopId);
    const earned = Number(games[ax.stopId]?.best) || 0;
    const stopRatio = stop ? earned / stop.maxPoints : 0;
    competenceRatios[ax.key] = Math.min(1, stopRatio);
  });

  return (
    <div className="flex flex-col gap-6">
      <ErasmusClaimBanner
        totalEarned={totalScore}
        progress={progress}
        claimOpen={claimOpen}
        profile={profile}
        claimBusy={claimBusy}
        onClaimToRating={onClaimToRating}
        onSignIn={onSignIn}
      />

      {/* Top Score & Rating Card */}
      <div className="box shadow-b8 p-6 sm:p-8 bg-white grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={ERASMUS_PROPS.scroll} alt="Youthpass scroll" className="w-14 h-12 object-contain" draggable={false} />
            <div>
              <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
                Your Erasmus+ Competence Profile
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase leading-none mt-1">
                {totalScore} / 100 PTS
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className={`tag text-sm px-3 py-1 ${rating.badge}`}>{rating.title}</span>
            <span className="font-mono text-xs font-bold text-mute">
              Final Test: {finalBest}/30 PTS
            </span>
          </div>

          <p className="text-sm sm:text-base font-medium text-ink/90 leading-relaxed">{rating.note}</p>

          <div className="p-3.5 rounded-xl border-2 border-ink bg-paper text-xs sm:text-sm font-medium">
            <b>Youthpass Tip:</b> Use the scores on your 8-axis chart below to pick which competences felt strongest and which ones you practised most during your Youth Exchange reflection!
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={onBackToMap} className="btn bg-sun text-ink text-xs">
              ← Back to Journey Map
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 border-[3px] border-ink rounded-2xl bg-paper p-4 flex flex-col items-center">
          <div className="font-mono text-xs font-extrabold uppercase text-ink mb-2">
            8 Key Competences Radar
          </div>
          <CompetenceRadarChart values={competenceRatios} />
        </div>
      </div>

      {/* Per-Competence Breakdown */}
      <section className="box shadow-b6 overflow-hidden">
        <div className="bg-sun border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-extrabold uppercase flex items-center justify-between">
          <span>Breakdown by Stop &amp; Competence</span>
          <img src={ERASMUS_SPRITES.trioCheer} alt="" className="w-8 h-8 object-contain" draggable={false} />
        </div>
        <div className="p-4 sm:p-6 bg-paper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {JOURNEY_STOPS.map((stop) => {
            const earned = Number(games[stop.id]?.best) || 0;
            const pct = Math.round((earned / stop.maxPoints) * 100);
            return (
              <div key={stop.id} className="border-[3px] border-ink rounded-xl bg-white p-4 shadow-b2 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px] font-extrabold uppercase text-cobalt">
                    <span>{stop.competenceLabel}</span>
                    <span className="tabular-nums text-ink">{earned}/{stop.maxPoints} PTS</span>
                  </div>
                  <h4 className="font-extrabold text-base uppercase mt-1">{stop.title}</h4>
                  <div className="h-2.5 w-full border-2 border-ink rounded-full bg-paper overflow-hidden mt-2">
                    <div className="h-full bg-neon" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenStop(stop.id)}
                  className="btn bg-paper text-ink text-xs self-start !px-3 !py-1.5"
                >
                  {earned > 0 ? 'Replay stop' : 'Play stop →'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Useful Links */}
      <section className="box shadow-b6 overflow-hidden">
        <div className="bg-cobalt text-white border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-extrabold uppercase">
          Keep Exploring · Official Youthpass &amp; Erasmus+ Links
        </div>
        <div className="p-4 sm:p-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_LINKS.slice(0, 6).map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-ink rounded-xl p-3 bg-paper hover:bg-sun/40 transition-colors flex items-center justify-between gap-2"
            >
              <span className="font-extrabold text-sm truncate">{l.label}</span>
              <span className="font-mono font-extrabold shrink-0">↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
