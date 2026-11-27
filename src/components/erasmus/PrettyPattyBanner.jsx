import { ERASMUS_BGS, ERASMUS_PROPS, ERASMUS_SPRITES } from '../../assets/erasmus/index.js';

export function SceneHero({ stop, scoreLabel, onBack }) {
  const bg = ERASMUS_BGS[stop.bgKey] || ERASMUS_BGS.mouseHole;
  const patty = ERASMUS_SPRITES[stop.pattyPose] || ERASMUS_SPRITES.pattyIdle;

  return (
    <div className="box shadow-b8 overflow-hidden">
      <div className="relative h-36 sm:h-48 w-full overflow-hidden border-b-[3px] border-ink bg-ink">
        <img src={bg} alt={stop.location} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="btn bg-white text-ink !px-3 !py-1.5 text-xs"
          >
            ← Map
          </button>
          <span className="font-mono text-xs font-extrabold uppercase bg-sun text-ink border-2 border-ink rounded-lg px-2.5 py-1 shadow-b2 tabular-nums">
            {scoreLabel}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="min-w-0 text-white">
            <div className="font-mono text-[11px] font-bold uppercase text-sun">
              Stop {stop.id} · {stop.location} · {stop.competenceLabel}
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold uppercase leading-tight truncate">{stop.title}</h2>
          </div>
          <img
            src={patty}
            alt="Pretty Patty"
            draggable={false}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_3px_0_rgba(0,0,0,0.65)] shrink-0 mascot-breathe"
          />
        </div>
      </div>
    </div>
  );
}

export function PattyReaction({
  mood = 'idle',
  spriteKey,
  line,
  explanation,
  attemptInfo,
  canRetry,
  onRetry,
  onNext,
  nextLabel = 'Next →',
}) {
  const sp =
    ERASMUS_SPRITES[spriteKey] ||
    (mood === 'ok'
      ? ERASMUS_SPRITES.pattyHappy
      : mood === 'fail'
        ? ERASMUS_SPRITES.pattyCry
        : ERASMUS_SPRITES.pattyIdle);

  const tone =
    mood === 'ok'
      ? 'bg-neon/35 border-ink'
      : mood === 'fail'
        ? 'bg-[#FFB4A2]/50 border-ink'
        : 'bg-sun/30 border-ink';

  return (
    <div className={`border-[3px] rounded-2xl p-4 shadow-b4 flex flex-col sm:flex-row items-center gap-4 ${tone}`}>
      <img
        src={sp}
        alt="Pretty Patty reaction"
        draggable={false}
        className="w-20 h-20 object-contain shrink-0 drop-shadow-[0_2px_0_rgba(17,17,17,0.2)]"
      />
      <div className="flex-1 min-w-0 flex flex-col gap-1.5 text-center sm:text-left">
        {attemptInfo && (
          <div className="font-mono text-[11px] font-extrabold uppercase text-ink/75">{attemptInfo}</div>
        )}
        <div className="font-extrabold text-sm sm:text-base">{line}</div>
        {explanation && <p className="text-xs sm:text-sm font-medium text-ink/90">{explanation}</p>}
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        {canRetry && onRetry && (
          <button type="button" onClick={onRetry} className="btn bg-sun text-ink text-xs">
            Try again
          </button>
        )}
        {onNext && (
          <button type="button" onClick={onNext} className="btn bg-ink text-white text-xs">
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function GameCompleteCard({
  stop,
  earned,
  maxPoints,
  saveResult,
  attemptsUsed = 1,
  maxAttempts = 3,
  onReplay,
  onBackToMap,
  onNextStop,
  extraNote,
}) {
  const perfect = earned >= maxPoints;
  const resolvedAttempts = saveResult?.attempts ?? attemptsUsed;
  const maxReached = resolvedAttempts >= maxAttempts || !!saveResult?.maxReached;

  return (
    <div className="box shadow-b8 p-6 sm:p-8 bg-white flex flex-col items-center text-center gap-4">
      <div className="flex items-center justify-center gap-3">
        <img
          src={perfect ? ERASMUS_SPRITES.trioCheer : ERASMUS_SPRITES.trioWalk}
          alt="Pretty Patty cheering"
          draggable={false}
          className="w-24 h-24 object-contain mascot-breathe"
        />
        <img
          src={ERASMUS_PROPS.cheese}
          alt="Cheese points"
          draggable={false}
          className="w-16 h-16 object-contain"
        />
      </div>
      <div>
        <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
          Stop {stop.id} complete · {stop.competenceLabel} · Attempt {Math.min(maxAttempts, resolvedAttempts)}/{maxAttempts}
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold uppercase mt-1">{stop.title}</h3>
      </div>
      <div className="border-[3px] border-ink rounded-2xl bg-sun px-6 py-3 shadow-b4 font-mono font-extrabold text-2xl sm:text-3xl tabular-nums">
        {earned} / {maxPoints} PTS
      </div>
      {extraNote && <p className="text-sm font-bold max-w-xl text-ink">{extraNote}</p>}
      {saveResult && (
        <p className="font-mono text-xs font-bold text-ink/85 max-w-lg">
          {saveResult.maxReached
            ? `All ${maxAttempts}/${maxAttempts} attempts were already used on this block — no extra Hub points added.`
            : saveResult.saved
              ? saveResult.improved > 0
                ? `+${saveResult.improved} PTS added automatically to your Hub rating! (Erasmus+ total: ${saveResult.totalEarned}/100 PTS)`
                : `Your best score for this stop stays ${saveResult.best}/${maxPoints} PTS (Erasmus+ total: ${saveResult.totalEarned}/100 PTS).`
              : 'Sign in at the top so your points credit automatically to the Hub rating!'}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {onReplay && !maxReached ? (
          <button type="button" onClick={onReplay} className="btn bg-paper text-ink text-xs">
            Play again ({maxAttempts - resolvedAttempts} left)
          </button>
        ) : (
          <span className="tag bg-paper text-mute text-xs px-3 py-2">
            3/3 Attempts Used
          </span>
        )}
        <button type="button" onClick={onBackToMap} className="btn bg-sun text-ink text-xs">
          Back to map
        </button>
        {onNextStop && (
          <button type="button" onClick={onNextStop} className="btn bg-neon text-ink text-xs">
            Next stop →
          </button>
        )}
      </div>
    </div>
  );
}
