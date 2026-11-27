import { useCallback, useEffect, useMemo, useState } from 'react';
import { ERASMUS_BGS, ERASMUS_PROPS, ERASMUS_SPRITES } from '../../assets/erasmus/index.js';
import {
  GRANT_LOCKS,
  GRANT_RATES,
  HACKED_ROOMS,
  MEMORY_PAIRS,
  MYTH_BUSTERS_CARDS,
} from '../../data/erasmusGames.js';
import { GameCompleteCard, PattyReaction, SceneHero } from './PrettyPattyBanner.jsx';

/* ============================================================================
   GAME 1 · MYTH BUSTERS (Literacy · 8 pts)
   ============================================================================ */
export function MythBustersGame({ stop, onFinish, onBack, onNextStop }) {
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const card = MYTH_BUSTERS_CARDS[idx];

  const handleAnswer = useCallback(
    (choice) => {
      if (feedback || done) return;
      const timedOut = choice === 'TIMEOUT';
      const ok = !timedOut && choice === card.answer;
      if (ok) setScore((s) => s + 1);
      setFeedback({
        ok,
        line: ok
          ? `Spot on! That is a ${card.answer}! (+1 pt)`
          : timedOut
            ? 'Time is up! Pretty Patty peeked at the facts:'
            : stop.failLine,
        explanation: card.explanation,
      });
    },
    [card, done, feedback, stop.failLine],
  );

  useEffect(() => {
    if (done || feedback) return undefined;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer('TIMEOUT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done, feedback, handleAnswer]);

  useEffect(() => {
    if (done || feedback) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') handleAnswer('MYTH');
      if (e.key === 'ArrowRight') handleAnswer('FACT');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [done, feedback, handleAnswer]);

  const advance = async () => {
    if (idx + 1 >= MYTH_BUSTERS_CARDS.length) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setIdx((i) => i + 1);
      setTimeLeft(20);
      setFeedback(null);
    }
  };

  const replay = () => {
    setIdx(0);
    setTimeLeft(20);
    setScore(0);
    setFeedback(null);
    setDone(false);
    setSaveResult(null);
  };

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <SceneHero stop={stop} scoreLabel={`${score}/${stop.maxPoints} PTS`} onBack={onBack} />
        <GameCompleteCard
          stop={stop}
          earned={score}
          maxPoints={stop.maxPoints}
          saveResult={saveResult}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote="You busted the most common Erasmus+ myths using critical reading!"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero stop={stop} scoreLabel={`Card ${idx + 1}/${MYTH_BUSTERS_CARDS.length} · ${score} PTS`} onBack={onBack} />

      <div className="box shadow-b8 p-5 sm:p-7 bg-white flex flex-col gap-5 max-w-2xl w-full mx-auto">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs font-extrabold uppercase text-cobalt">
            Fact or Myth? (Arrow Left = Myth · Arrow Right = Fact)
          </span>
          <span className={`tag font-mono tabular-nums ${timeLeft <= 5 ? 'bg-hot text-white' : 'bg-sun text-ink'}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        <div className="h-2.5 w-full border-2 border-ink rounded-full bg-paper overflow-hidden">
          <div
            className="h-full bg-cobalt transition-all duration-300"
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>

        <div className="border-[3px] border-ink rounded-2xl bg-paper p-6 sm:p-8 text-center shadow-b4">
          <p className="text-lg sm:text-2xl font-extrabold leading-snug text-ink">{card.statement}</p>
        </div>

        {!feedback ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleAnswer('MYTH')}
              className="btn bg-[#FFB4A2] text-ink py-4 text-base sm:text-lg"
            >
              ← MYTH
            </button>
            <button
              type="button"
              onClick={() => handleAnswer('FACT')}
              className="btn bg-neon text-ink py-4 text-base sm:text-lg"
            >
              FACT →
            </button>
          </div>
        ) : (
          <PattyReaction
            mood={feedback.ok ? 'ok' : 'fail'}
            spriteKey={feedback.ok ? 'pattyHappy' : stop.failPose}
            line={feedback.line}
            explanation={feedback.explanation}
            onNext={advance}
            nextLabel={idx + 1 >= MYTH_BUSTERS_CARDS.length ? 'See Result →' : 'Next card →'}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 2 · ERASMUS MEMORY (Multilingual · 8 pts)
   ============================================================================ */
function buildMemoryDeck() {
  const cards = [];
  MEMORY_PAIRS.forEach((p) => {
    cards.push({ uid: `${p.id}-term`, pairId: p.id, kind: 'TERM', text: p.term, cardBg: p.cardBg, tagBg: p.tagBg });
    cards.push({ uid: `${p.id}-def`, pairId: p.id, kind: 'MEANING', text: p.def, cardBg: p.cardBg, tagBg: p.tagBg });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function ErasmusMemoryGame({ stop, onFinish, onBack, onNextStop }) {
  const [deck, setDeck] = useState(buildMemoryDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [lockBoard, setLockBoard] = useState(false);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [saveResult, setSaveResult] = useState(null);

  const finishGame = useCallback(
    async (matchedPairs, totalMoves, remainingSec) => {
      let pts = matchedPairs;
      if (matchedPairs === MEMORY_PAIRS.length) {
        if (remainingSec <= 0) pts = 5;
        else if (totalMoves > 22) pts = 6;
        else if (totalMoves > 15) pts = 7;
        else pts = 8;
      }
      setFinalScore(pts);
      setDone(true);
      const res = await onFinish(pts);
      setSaveResult(res);
    },
    [onFinish],
  );

  useEffect(() => {
    if (done) return undefined;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishGame(matched.length, moves, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done, finishGame, matched.length, moves]);

  const flipCard = (card) => {
    if (done || lockBoard) return;
    if (matched.includes(card.pairId) || flipped.some((f) => f.uid === card.uid)) return;

    const nextFlipped = [...flipped, card];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [a, b] = nextFlipped;
      if (a.pairId === b.pairId) {
        const nextMatched = [...matched, a.pairId];
        setMatched(nextMatched);
        setFlipped([]);
        if (nextMatched.length === MEMORY_PAIRS.length) {
          finishGame(nextMatched.length, nextMoves, timeLeft);
        }
      } else {
        setLockBoard(true);
        setTimeout(() => {
          setFlipped([]);
          setLockBoard(false);
        }, 850);
      }
    }
  };

  const replay = () => {
    setDeck(buildMemoryDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeLeft(180);
    setLockBoard(false);
    setDone(false);
    setFinalScore(0);
    setSaveResult(null);
  };

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <SceneHero stop={stop} scoreLabel={`${finalScore}/${stop.maxPoints} PTS`} onBack={onBack} />
        <GameCompleteCard
          stop={stop}
          earned={finalScore}
          maxPoints={stop.maxPoints}
          saveResult={saveResult}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote={`Matched ${matched.length}/${MEMORY_PAIRS.length} pairs in ${moves} moves! Bonus café prompt: say "Youth" or "Solidarity" in two partner languages with someone beside you.`}
        />
      </div>
    );
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Pairs ${matched.length}/${MEMORY_PAIRS.length} · ${mm}:${ss}`}
        onBack={onBack}
      />

      <div className="box shadow-b8 p-4 sm:p-6 bg-white flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs font-extrabold uppercase text-cobalt">
            Match each color-coded Erasmus+ cheese card pair (≤15 moves &amp; on time = full 8 PTS)
          </p>
          <span className="font-mono text-xs font-bold tabular-nums">
            Moves: {moves} · Time: {mm}:{ss}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {deck.map((card) => {
            const isMatched = matched.includes(card.pairId);
            const isOpen = isMatched || flipped.some((f) => f.uid === card.uid);
            return (
              <button
                key={card.uid}
                type="button"
                onClick={() => flipCard(card)}
                disabled={isOpen || lockBoard}
                className={`min-h-[116px] sm:min-h-[132px] p-3 rounded-2xl border-[3px] border-ink text-left transition-all flex flex-col justify-between shadow-b4 cursor-pointer ${
                  isOpen
                    ? `${card.cardBg} text-ink`
                    : 'bg-[#FFE200] hover:-translate-y-0.5 text-ink'
                }`}
              >
                {isOpen ? (
                  <>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-mono text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-ink ${card.tagBg}`}>
                        {card.kind}
                      </span>
                      {isMatched && <span className="font-mono text-xs font-extrabold">✓</span>}
                    </div>
                    <span className={`leading-snug ${card.kind === 'TERM' ? 'font-extrabold text-sm sm:text-base' : 'font-semibold text-xs'}`}>
                      {card.text}
                    </span>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-90">
                    <img src={ERASMUS_PROPS.cheese} alt="" className="w-9 h-9 object-contain" draggable={false} />
                    <span className="font-mono text-[10px] font-extrabold uppercase">Cheese Card</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 3 · GRANT ESCAPE (Math, Science & Tech · 14 pts)
   ============================================================================ */
function PocketCalculator() {
  const [expr, setExpr] = useState('');
  const press = (val) => {
    if (val === 'C') setExpr('');
    else if (val === '⌫') setExpr((e) => e.slice(0, -1));
    else if (val === '=') {
      try {
        const clean = expr.replace(/[^0-9+\-*/().]/g, '');
        if (!clean) return;
        const result = Function(`"use strict"; return (${clean});`)();
        if (Number.isFinite(result)) setExpr(String(Math.round(result * 100) / 100));
      } catch {
        setExpr('Err');
      }
    } else {
      setExpr((e) => (e === 'Err' ? val : e + val));
    }
  };
  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C', '⌫'];
  return (
    <div className="border-[3px] border-ink rounded-2xl bg-ink text-white p-3.5 shadow-b4">
      <div className="font-mono text-[10px] uppercase text-sun mb-1.5 flex items-center justify-between">
        <span>Pocket Calculator</span>
        <img src={ERASMUS_PROPS.calculator} alt="" className="w-5 h-5 object-contain" />
      </div>
      <div className="bg-white text-ink font-mono font-extrabold text-right text-lg px-3 py-2 rounded-lg border-2 border-ink mb-2.5 min-h-[42px] overflow-x-auto tabular-nums">
        {expr || '0'}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            className={`py-2 rounded-lg font-mono font-extrabold text-sm border-2 border-ink cursor-pointer ${
              k === '=' ? 'bg-neon text-ink' : k === 'C' || k === '⌫' ? 'bg-[#FFB4A2] text-ink' : 'bg-paper text-ink'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GrantEscapeGame({ stop, onFinish, onBack, onNextStop }) {
  const [lockIdx, setLockIdx] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [showCalc, setShowCalc] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const lock = GRANT_LOCKS[lockIdx];

  const checkLock = (e) => {
    e.preventDefault();
    if (feedback?.resolved || done) return;
    const num = Number(String(input).replace(/[\s,]+/g, ''));
    if (!Number.isFinite(num) || String(input).trim() === '') return;

    const isOk = Math.abs(num - lock.answer) <= lock.tolerance;
    const tryNum = attempts + 1;

    if (isOk) {
      const basePts = tryNum === 1 ? lock.points : tryNum === 2 ? Math.floor(lock.points / 2) : 0;
      const earned = Math.max(0, basePts - (usedHint ? 1 : 0));
      setTotalScore((s) => s + earned);
      setFeedback({
        resolved: true,
        mood: 'ok',
        spriteKey: 'pattyHappy',
        line: `Lock ${lock.id} opened! (+${earned} PTS)`,
        explanation: lock.explanation,
      });
    } else if (tryNum >= 3) {
      setAttempts(3);
      setFeedback({
        resolved: true,
        mood: 'fail',
        spriteKey: 'pattyReading',
        line: `Now we know! The vault code is ${lock.answer.toLocaleString('en-US')} ${lock.unit}. (+0 PTS)`,
        explanation: lock.explanation,
      });
    } else {
      setAttempts(tryNum);
      setFeedback({
        resolved: false,
        mood: 'fail',
        spriteKey: stop.failPose,
        line: `${stop.failLine} (Attempt ${tryNum}/3)`,
        explanation: `Your entry (${num}) did not open Lock ${lock.id}. Double-check the training rates table or open a Hint!`,
      });
    }
  };

  const advance = async () => {
    if (lockIdx + 1 >= GRANT_LOCKS.length) {
      setDone(true);
      const res = await onFinish(totalScore);
      setSaveResult(res);
    } else {
      setLockIdx((i) => i + 1);
      setInput('');
      setAttempts(0);
      setUsedHint(false);
      setFeedback(null);
    }
  };

  const replay = () => {
    setLockIdx(0);
    setInput('');
    setAttempts(0);
    setUsedHint(false);
    setTotalScore(0);
    setFeedback(null);
    setDone(false);
    setSaveResult(null);
  };

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <SceneHero stop={stop} scoreLabel={`${totalScore}/${stop.maxPoints} PTS`} onBack={onBack} />
        <GameCompleteCard
          stop={stop}
          earned={totalScore}
          maxPoints={stop.maxPoints}
          saveResult={saveResult}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote="Cheese Vault unlocked! Remember: always verify live official unit-cost bands in the current Erasmus+ Programme Guide."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Lock ${lockIdx + 1}/${GRANT_LOCKS.length} · ${totalScore}/${stop.maxPoints} PTS`}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Training Rates & Route Clue + Calculator */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="box shadow-b6 overflow-hidden bg-white">
            <div className="bg-sun border-b-[3px] border-ink px-4 py-2.5 font-mono text-xs font-extrabold uppercase flex items-center justify-between gap-2">
              <span>Grant Reference Sheet</span>
              <img src={ERASMUS_PROPS.map} alt="" className="w-7 h-5 object-contain" />
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="border-2 border-ink rounded-lg bg-[#FFE200]/45 px-3 py-2 text-xs font-extrabold">
                {GRANT_RATES.notice}
              </div>
              <div className="text-xs font-bold leading-snug">{GRANT_RATES.caseTitle}</div>
              <div className="text-xs font-medium text-ink/85 bg-paper p-2.5 rounded-lg border-2 border-ink/20">
                <b>Route Clue:</b> {GRANT_RATES.routeClue}
              </div>
              <div className="divide-y divide-ink/15 border-2 border-ink rounded-xl overflow-hidden text-xs">
                {GRANT_RATES.rates.map((r) => (
                  <div key={r.item} className="px-3 py-2 flex items-center justify-between gap-2 bg-white">
                    <span className="font-medium">{r.item}</span>
                    <b className="font-mono tabular-nums shrink-0">{r.rate}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCalc((s) => !s)}
            className="btn bg-paper text-ink text-xs self-start"
          >
            {showCalc ? 'Hide Pocket Calculator' : 'Open Pocket Calculator'}
          </button>
          {showCalc && <PocketCalculator />}
        </div>

        {/* Right: Active Lock Challenge */}
        <div className="lg:col-span-7 box shadow-b8 p-5 sm:p-6 bg-white flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img src={ERASMUS_PROPS.lock} alt="" className="w-8 h-8 object-contain" draggable={false} />
              <span className="tag bg-[#B89CFF] text-ink">Worth {lock.points} PTS</span>
              {lock.tolerance > 0 && <span className="font-mono text-[11px] font-bold text-mute">±{lock.tolerance} tolerated</span>}
            </div>
            <button
              type="button"
              onClick={() => setUsedHint(true)}
              disabled={usedHint || feedback?.resolved}
              className="btn bg-paper text-ink !px-3 !py-1.5 text-xs disabled:opacity-50"
            >
              {usedHint ? 'Hint shown (−1 pt)' : 'Hint (−1 pt)'}
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold leading-snug">{lock.question}</h3>

          {usedHint && (
            <div className="border-2 border-ink rounded-xl bg-sun/35 p-3 text-xs sm:text-sm font-bold">
              💡 Hint: {lock.hint}
            </div>
          )}

          <form onSubmit={checkLock} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                step="any"
                required
                disabled={feedback?.resolved}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (feedback && !feedback.resolved) setFeedback(null);
                }}
                placeholder={`Enter ${lock.unit}...`}
                className="input text-lg font-extrabold tabular-nums"
              />
              <span className="font-mono font-extrabold text-sm uppercase shrink-0">{lock.unit}</span>
            </div>
            <button
              type="submit"
              disabled={feedback?.resolved}
              className="btn bg-neon text-ink disabled:opacity-50"
            >
              Unlock →
            </button>
          </form>

          {feedback && (
            <PattyReaction
              mood={feedback.mood}
              spriteKey={feedback.spriteKey}
              attemptInfo={!feedback.resolved ? 'Try again for half points! (2nd try = 50%)' : null}
              line={feedback.line}
              explanation={feedback.explanation}
              canRetry={!feedback.resolved}
              onRetry={() => setFeedback(null)}
              onNext={feedback.resolved ? advance : null}
              nextLabel={lockIdx + 1 >= GRANT_LOCKS.length ? 'Finish Escape →' : 'Next lock →'}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 4 · HACKED EXCHANGE (Digital · 4 rooms × 2 pts = 8 pts)
   ============================================================================ */
export function HackedExchangeGame({ stop, onFinish, onBack, onNextStop }) {
  const [room, setRoom] = useState(1);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Room 1 state
  const [pickedFlags, setPickedFlags] = useState([]);
  // Room 2 state
  const [photoWall, setPhotoWall] = useState({});
  // Room 4 state
  const [fakeChoice, setFakeChoice] = useState({ source: null, verdict: null });

  const completeRoom = (pts, ok, explain) => {
    if (ok) setScore((s) => s + pts);
    setFeedback({
      ok,
      line: ok ? `Hacker Cat blocked! (+${pts} PTS)` : `${stop.failLine} (+${pts} PTS)`,
      explanation: explain,
    });
  };

  const nextRoom = async () => {
    setFeedback(null);
    if (room >= 4) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setRoom((r) => r + 1);
    }
  };

  const replay = () => {
    setRoom(1);
    setScore(0);
    setDone(false);
    setSaveResult(null);
    setFeedback(null);
    setPickedFlags([]);
    setPhotoWall({});
    setFakeChoice({ source: null, verdict: null });
  };

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <div className="box shadow-b8 overflow-hidden">
          <div className="relative h-48 w-full border-b-[3px] border-ink overflow-hidden">
            <img src={ERASMUS_BGS.accessRestored} alt="Access Restored" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <span className="tag bg-neon text-ink text-base px-4 py-1.5">ACCESS RESTORED!</span>
            </div>
          </div>
        </div>
        <GameCompleteCard
          stop={stop}
          earned={score}
          maxPoints={stop.maxPoints}
          saveResult={saveResult}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote="You defeated Hacker Cat! Keep protecting team accounts, checking sources, and respecting photo consent."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero stop={stop} scoreLabel={`Room ${room}/4 · ${score}/${stop.maxPoints} PTS`} onBack={onBack} />

      <div className="box shadow-b8 p-5 sm:p-6 bg-white flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink/15 pb-3">
          <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
            Room {room} of 4 · Defeat Hacker Cat
          </div>
          <img
            src={feedback?.ok ? ERASMUS_SPRITES.catAngry : ERASMUS_SPRITES.catHoodie}
            alt="Hacker Cat"
            className="w-12 h-12 object-contain"
            draggable={false}
          />
        </div>

        {/* ROOM 1: Phishing Email */}
        {room === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold uppercase">{HACKED_ROOMS.room1.title}</h3>
              <p className="text-sm font-medium mt-1">{HACKED_ROOMS.room1.instruction}</p>
            </div>
            <div className="border-[3px] border-ink rounded-2xl bg-paper p-4 flex flex-col gap-2.5">
              <div className="font-mono text-xs font-extrabold uppercase text-hot">
                Subject: {HACKED_ROOMS.room1.subject}
              </div>
              {HACKED_ROOMS.room1.segments.map((seg) => {
                const picked = pickedFlags.includes(seg.id);
                return (
                  <button
                    key={seg.id}
                    type="button"
                    disabled={!!feedback}
                    onClick={() =>
                      setPickedFlags((p) => (p.includes(seg.id) ? p.filter((x) => x !== seg.id) : [...p, seg.id]))
                    }
                    className={`text-left p-3 rounded-xl border-2 border-ink font-medium text-sm transition-colors cursor-pointer ${
                      picked ? 'bg-[#FFB4A2] font-bold' : 'bg-white hover:bg-sun/30'
                    }`}
                  >
                    {picked ? '🚩 ' : '▫ '}
                    {seg.text}
                  </button>
                );
              })}
            </div>
            {!feedback && (
              <button
                type="button"
                disabled={pickedFlags.length === 0}
                onClick={() => {
                  const trueFlags = HACKED_ROOMS.room1.segments.filter((s) => s.isFlag).map((s) => s.id);
                  const hits = pickedFlags.filter((id) => trueFlags.includes(id)).length;
                  const wrong = pickedFlags.filter((id) => !trueFlags.includes(id)).length;
                  const earned = hits === 3 && wrong === 0 ? 2 : hits >= 2 ? 1 : 0;
                  completeRoom(
                    earned,
                    earned === 2,
                    'The 3 red flags: fake free-mail domain, false urgency/payment demand, and suspicious shortened link asking for PIN/passport!',
                  );
                }}
                className="btn bg-neon text-ink self-start disabled:opacity-50"
              >
                Inspect Flags ({pickedFlags.length} selected) →
              </button>
            )}
          </div>
        )}

        {/* ROOM 2: Photo Consent Wall */}
        {room === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold uppercase">{HACKED_ROOMS.room2.title}</h3>
              <p className="text-sm font-medium mt-1">{HACKED_ROOMS.room2.instruction}</p>
            </div>
            <div className="flex flex-col gap-3">
              {HACKED_ROOMS.room2.items.map((item) => {
                const val = photoWall[item.id];
                return (
                  <div
                    key={item.id}
                    className="border-2 border-ink rounded-xl p-3 bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <span className="text-sm font-bold flex-1">{item.label}</span>
                    <div className="flex gap-1.5 shrink-0">
                      {[
                        { k: 'OK', label: 'OK to post', cls: 'bg-neon text-ink' },
                        { k: 'ASK', label: 'Ask first', cls: 'bg-sun text-ink' },
                        { k: 'NEVER', label: 'Never post', cls: 'bg-[#FFB4A2] text-ink' },
                      ].map((b) => (
                        <button
                          key={b.k}
                          type="button"
                          disabled={!!feedback}
                          onClick={() => setPhotoWall((w) => ({ ...w, [item.id]: b.k }))}
                          className={`px-2.5 py-1.5 rounded-lg border-2 border-ink font-mono text-[11px] font-extrabold uppercase cursor-pointer ${
                            val === b.k ? `${b.cls} shadow-b2` : 'bg-white text-ink/70'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {!feedback && (
              <button
                type="button"
                disabled={Object.keys(photoWall).length < HACKED_ROOMS.room2.items.length}
                onClick={() => {
                  const correct = HACKED_ROOMS.room2.items.filter((it) => photoWall[it.id] === it.correct).length;
                  const earned = correct === 6 ? 2 : correct >= 4 ? 1 : 0;
                  completeRoom(
                    earned,
                    correct === 6,
                    `You placed ${correct}/6 correctly! Never post passports or vulnerable crying faces; ask consent before posting personal moments.`,
                  );
                }}
                className="btn bg-neon text-ink self-start disabled:opacity-50"
              >
                Check Photo Wall →
              </button>
            )}
          </div>
        )}

        {/* ROOM 3: Password Vault */}
        {room === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold uppercase">{HACKED_ROOMS.room3.title}</h3>
              <p className="text-sm font-medium mt-1">{HACKED_ROOMS.room3.instruction}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HACKED_ROOMS.room3.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={!!feedback}
                  onClick={() => completeRoom(opt.ok ? 2 : 0, opt.ok, opt.feedback)}
                  className="border-[3px] border-ink rounded-2xl p-4 bg-paper hover:bg-sun/35 text-left font-bold text-sm shadow-b4 cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ROOM 4: Fake Post Inspector */}
        {room === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold uppercase">{HACKED_ROOMS.room4.title}</h3>
              <p className="text-sm font-medium mt-1">{HACKED_ROOMS.room4.instruction}</p>
            </div>
            <div className="border-[3px] border-ink rounded-2xl bg-[#FFE200]/35 p-4 font-extrabold text-sm sm:text-base">
              {HACKED_ROOMS.room4.postText}
            </div>
            {HACKED_ROOMS.room4.questions.map((qu) => (
              <div key={qu.id} className="flex flex-col gap-2">
                <div className="font-mono text-xs font-extrabold uppercase">{qu.q}</div>
                <div className="grid grid-cols-1 gap-2">
                  {qu.options.map((o, idx) => (
                    <button
                      key={o.text}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => setFakeChoice((prev) => ({ ...prev, [qu.id]: idx }))}
                      className={`border-2 border-ink rounded-xl p-3 text-left text-sm font-bold cursor-pointer ${
                        fakeChoice[qu.id] === idx ? 'bg-sun shadow-b2' : 'bg-paper'
                      }`}
                    >
                      {o.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!feedback && (
              <button
                type="button"
                disabled={fakeChoice.source === null || fakeChoice.verdict === null}
                onClick={() => {
                  const sOk = HACKED_ROOMS.room4.questions[0].options[fakeChoice.source]?.ok;
                  const vOk = HACKED_ROOMS.room4.questions[1].options[fakeChoice.verdict]?.ok;
                  const pts = (sOk ? 1 : 0) + (vOk ? 1 : 0);
                  completeRoom(
                    pts,
                    pts === 2,
                    'Always verify dramatic claims on erasmus-plus.ec.europa.eu or your National Agency before forwarding!',
                  );
                }}
                className="btn bg-neon text-ink self-start disabled:opacity-50"
              >
                Restore Access →
              </button>
            )}
          </div>
        )}

        {feedback && (
          <PattyReaction
            mood={feedback.ok ? 'ok' : 'fail'}
            spriteKey={feedback.ok ? 'pattyCelebrate' : 'catSmirk'}
            line={feedback.line}
            explanation={feedback.explanation}
            onNext={nextRoom}
            nextLabel={room >= 4 ? 'Unlock Access →' : `Enter Room ${room + 1} →`}
          />
        )}
      </div>
    </div>
  );
}
