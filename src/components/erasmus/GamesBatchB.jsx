import { useCallback, useEffect, useRef, useState } from 'react';
import { ERASMUS_BGS, ERASMUS_PROPS, ERASMUS_SPRITES } from '../../assets/erasmus/index.js';
import {
  BOARD_LADDERS,
  BOARD_SNAKES,
  EXCHANGE_DILEMMAS,
  FINAL_TEST_QUESTIONS,
  ICEBERG_PIECES,
  PITCH_REELS,
  PITCH_STEPS,
  SITUATION_SQUARES,
  TETRIS_BLOCKS,
  TETRIS_PRIORITIES,
} from '../../data/erasmusGames.js';
import { GameCompleteCard, PattyReaction, SceneHero } from './PrettyPattyBanner.jsx';

/* ============================================================================
   GAME 5 · EXCHANGE JOURNEY (60-square Snakes & Ladders + 8 Dilemmas = 8 pts)
   ============================================================================ */
export function ExchangeJourneyGame({ stop, onFinish, onBack, onNextStop }) {
  const [pos, setPos] = useState(1);
  const [dice, setDice] = useState(null);
  const [score, setScore] = useState(0);
  const [solvedSquares, setSolvedSquares] = useState([]);
  const [activeDilemma, setActiveDilemma] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('Roll the dice to begin Patty’s 60-square Youth Exchange adventure!');
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const finishJourney = async (finalPts) => {
    setDone(true);
    const res = await onFinish(finalPts);
    setSaveResult(res);
  };

  const rollDice = () => {
    if (activeDilemma || done) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    setFeedback(null);

    const rawNext = Math.min(60, pos + roll);
    // Stop on the first unvisited dilemma square along the path so participant can solve all scenarios
    const hitSq = SITUATION_SQUARES.find((sq) => sq > pos && sq <= rawNext && !solvedSquares.includes(sq));
    if (hitSq) {
      setPos(hitSq);
      const dilemma = EXCHANGE_DILEMMAS.find((d) => d.square === hitSq);
      setActiveDilemma(dilemma);
      setBannerMsg(`Square ${hitSq}: Situation Card — ${dilemma.title}!`);
      return;
    }

    if (BOARD_LADDERS[rawNext]) {
      const dest = BOARD_LADDERS[rawNext];
      setPos(dest);
      setBannerMsg(`🪜 Yay! Ladder at ${rawNext} boosts Patty up to square ${dest}!`);
    } else if (BOARD_SNAKES[rawNext]) {
      const dest = BOARD_SNAKES[rawNext];
      setPos(dest);
      setBannerMsg(`🐍 Oops! Snake at ${rawNext} slides Patty back to ${dest} — keep going!`);
    } else {
      setPos(rawNext);
      setBannerMsg(`Rolled a ${roll}! Pretty Patty reached square ${rawNext}.`);
    }

    if (rawNext >= 60) {
      finishJourney(score);
    }
  };

  const answerDilemma = (choice) => {
    if (!activeDilemma || feedback) return;
    const nextScore = choice.ok ? score + 1 : score;
    if (choice.ok) setScore(nextScore);
    setSolvedSquares((prev) => [...prev, activeDilemma.square]);
    setFeedback({
      ok: choice.ok,
      line: choice.ok ? 'Great teamwork! (+1 PT)' : stop.failLine,
      explanation: choice.feedback,
      nextScore,
    });
  };

  const closeDilemma = () => {
    const reachedEnd = pos >= 60 || solvedSquares.length >= EXCHANGE_DILEMMAS.length;
    const sc = feedback?.nextScore ?? score;
    setActiveDilemma(null);
    setFeedback(null);
    if (pos >= 60) {
      finishJourney(sc);
    } else if (reachedEnd && pos < 60) {
      setBannerMsg('All 8 dilemmas solved! Keep rolling to cross square 60!');
    }
  };

  const replay = () => {
    setPos(1);
    setDice(null);
    setScore(0);
    setSolvedSquares([]);
    setActiveDilemma(null);
    setFeedback(null);
    setDone(false);
    setSaveResult(null);
    setBannerMsg('Roll the dice to begin Patty’s 60-square Youth Exchange adventure!');
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
          extraNote="Personal, social & learning-to-learn skills shine whenever teams care for every member!"
        />
      </div>
    );
  }

  // Build 6 rows of 10 squares (boustrophedon 60 down to 1 so square 60 sits at top-left or top-right)
  const rows = [];
  for (let r = 5; r >= 0; r--) {
    const start = r * 10 + 1;
    const rowArr = Array.from({ length: 10 }, (_, c) => start + c);
    if (r % 2 === 1) rowArr.reverse();
    rows.push(rowArr);
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Square ${pos}/60 · ${score}/${stop.maxPoints} PTS`}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left/Top: Interactive 60-square Board */}
        <div className="lg:col-span-8 box shadow-b8 p-3 sm:p-4 bg-white">
          <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
            {rows.flat().map((sq) => {
              const isPatty = sq === pos;
              const isLadder = !!BOARD_LADDERS[sq];
              const isSnake = !!BOARD_SNAKES[sq];
              const isDilemma = SITUATION_SQUARES.includes(sq);
              const isSolved = solvedSquares.includes(sq);

              let bg = 'bg-paper';
              if (sq === 60) bg = 'bg-neon';
              else if (isSolved) bg = 'bg-neon/40';
              else if (isDilemma) bg = 'bg-sun';
              else if (isLadder) bg = 'bg-[#B89CFF]/55';
              else if (isSnake) bg = 'bg-[#FFB4A2]/65';

              return (
                <div
                  key={sq}
                  className={`relative aspect-square rounded-lg border-2 border-ink flex flex-col items-center justify-center p-0.5 text-[10px] sm:text-xs font-mono font-extrabold ${bg} ${
                    isPatty ? 'ring-2 ring-cobalt bg-white scale-105 z-10' : ''
                  }`}
                >
                  <span className="leading-none">{sq}</span>
                  {isLadder && <span className="text-[9px] leading-none">🪜{BOARD_LADDERS[sq]}</span>}
                  {isSnake && <span className="text-[9px] leading-none">🐍{BOARD_SNAKES[sq]}</span>}
                  {isDilemma && !isPatty && <span className="text-[9px] leading-none">{isSolved ? '✓' : '★'}</span>}
                  {isPatty && (
                    <img
                      src={ERASMUS_SPRITES.pattySuitcase}
                      alt="Patty"
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain absolute inset-0 m-auto drop-shadow"
                      draggable={false}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 font-mono text-[11px] font-bold uppercase text-ink/80">
            <span>★ = Situation Card ({solvedSquares.length}/8)</span>
            <span>🪜 = Ladder</span>
            <span>🐍 = Snake</span>
          </div>
        </div>

        {/* Right: Dice & Active Dilemma */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="box shadow-b6 p-4 sm:p-5 bg-white flex flex-col gap-3 items-center text-center">
            <img src={ERASMUS_PROPS.dice} alt="Dice" className="w-16 h-16 object-contain" draggable={false} />
            <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
              {dice ? `Last roll: ${dice}` : 'Ready to roll'}
            </div>
            <p className="text-sm font-bold leading-snug">{bannerMsg}</p>
            <button
              type="button"
              disabled={!!activeDilemma}
              onClick={rollDice}
              className="btn bg-sun text-ink w-full disabled:opacity-50"
            >
              Roll Dice →
            </button>
          </div>

          {activeDilemma && (
            <div className="box shadow-b8 p-4 sm:p-5 bg-sun/25 flex flex-col gap-3">
              <div className="tag bg-sun text-ink self-start">Square {activeDilemma.square} · Dilemma</div>
              <h3 className="text-lg font-extrabold uppercase leading-tight">{activeDilemma.title}</h3>
              <p className="text-sm font-medium">{activeDilemma.text}</p>

              {!feedback ? (
                <div className="flex flex-col gap-2">
                  {activeDilemma.choices.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => answerDilemma(c)}
                      className="border-2 border-ink rounded-xl bg-white hover:bg-sun/45 p-3 text-left text-xs sm:text-sm font-bold cursor-pointer"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              ) : (
                <PattyReaction
                  mood={feedback.ok ? 'ok' : 'fail'}
                  spriteKey={feedback.ok ? 'pattyHappy' : stop.failPose}
                  line={feedback.line}
                  explanation={feedback.explanation}
                  onNext={closeDilemma}
                  nextLabel="Continue →"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 6 · PRIORITY TETRIS (Citizenship · Canvas Sorter · 8 pts)
   ============================================================================ */
export function PriorityTetrisGame({ stop, onFinish, onBack, onNextStop }) {
  const [blockIdx, setBlockIdx] = useState(0);
  const [lane, setLane] = useState(1); // 0..3
  const [yRatio, setYRatio] = useState(0); // 0..1
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const canvasRef = useRef(null);
  const laneRef = useRef(lane);
  const yRef = useRef(yRatio);
  laneRef.current = lane;
  yRef.current = yRatio;

  const currentBlock = TETRIS_BLOCKS[blockIdx];

  const resolveDrop = useCallback(
    (chosenLane) => {
      if (feedback || done || !currentBlock) return;
      const pickedPriority = TETRIS_PRIORITIES[chosenLane];
      const ok = pickedPriority.id === currentBlock.target;
      if (ok) setScore((s) => s + 1);
      setFeedback({
        ok,
        line: ok ? `Sorted into ${pickedPriority.label}! (+1 PT)` : stop.failLine,
        explanation: currentBlock.reason,
      });
    },
    [currentBlock, done, feedback, stop.failLine],
  );

  // Smooth falling loop via requestAnimationFrame
  useEffect(() => {
    if (done || feedback) return undefined;
    let rafId;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setYRatio((prev) => {
        const next = prev + dt * 0.085; // ~11.5 seconds steady descent per block
        if (next >= 1) {
          resolveDrop(laneRef.current);
          return 1;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [done, feedback, resolveDrop]);

  // Draw crisp 4-column board on <canvas>
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background columns
    const colW = W / 4;
    const binH = 64;
    TETRIS_PRIORITIES.forEach((p, idx) => {
      const x = idx * colW;
      ctx.fillStyle = idx === lane ? '#FFF8CC' : '#F4F3EE';
      ctx.fillRect(x, 0, colW, H - binH);
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, 0, colW, H - binH);

      // Priority bottom bin
      ctx.fillStyle = p.color;
      ctx.fillRect(x + 2, H - binH + 2, colW - 4, binH - 4);
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 2, H - binH + 2, colW - 4, binH - 4);

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.short.toUpperCase(), x + colW / 2, H - binH / 2 + 5);
    });

    // Draw falling card block
    if (currentBlock) {
      const bx = lane * colW + 10;
      const bw = colW - 20;
      const bh = 68;
      const by = Math.min(H - binH - bh - 6, yRatio * (H - binH - bh - 6));

      ctx.fillStyle = '#FFE200';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Idea #${currentBlock.id}`, bx + bw / 2, by + 28);
      ctx.font = 'bold 11px monospace';
      ctx.fillText('▼ DROP ▼', bx + bw / 2, by + 48);
    }
  }, [currentBlock, lane, yRatio]);

  // Keyboard controls
  useEffect(() => {
    if (done || feedback) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setLane((l) => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setLane((l) => Math.min(3, l + 1));
      } else if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        resolveDrop(laneRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [done, feedback, resolveDrop]);

  const advance = async () => {
    if (blockIdx + 1 >= TETRIS_BLOCKS.length) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setBlockIdx((i) => i + 1);
      setLane(1);
      setYRatio(0);
      setFeedback(null);
    }
  };

  const replay = () => {
    setBlockIdx(0);
    setLane(1);
    setYRatio(0);
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
          extraNote="You matched youth ideas straight into the 4 Erasmus+ Horizontal Priorities!"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Idea ${blockIdx + 1}/${TETRIS_BLOCKS.length} · ${score}/${stop.maxPoints} PTS`}
        onBack={onBack}
      />

      <div className="box shadow-b8 p-4 sm:p-6 bg-white flex flex-col gap-4 max-w-3xl w-full mx-auto">
        <div className="border-[3px] border-ink rounded-2xl bg-sun/40 p-4 text-center">
          <div className="font-mono text-[11px] font-extrabold uppercase text-cobalt">
            Active Project Idea #{currentBlock.id}
          </div>
          <div className="text-base sm:text-xl font-extrabold mt-1">{currentBlock.title}</div>
          <div className="font-mono text-xs font-bold text-ink/80 mt-1">
            Currently over: <u>{TETRIS_PRIORITIES[lane].label}</u>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={640}
          height={290}
          className="w-full h-auto border-[3px] border-ink rounded-2xl bg-paper shadow-b4"
        />

        {!feedback ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setLane((l) => Math.max(0, l - 1))}
              className="btn bg-paper text-ink px-5 py-3 text-sm"
            >
              ← Left
            </button>
            <button
              type="button"
              onClick={() => resolveDrop(lane)}
              className="btn bg-neon text-ink px-6 py-3 text-sm"
            >
              ↓ Drop into {TETRIS_PRIORITIES[lane].short}
            </button>
            <button
              type="button"
              onClick={() => setLane((l) => Math.min(3, l + 1))}
              className="btn bg-paper text-ink px-5 py-3 text-sm"
            >
              Right →
            </button>
          </div>
        ) : (
          <PattyReaction
            mood={feedback.ok ? 'ok' : 'fail'}
            spriteKey={feedback.ok ? 'pattyHardhat' : stop.failPose}
            line={feedback.line}
            explanation={feedback.explanation}
            onNext={advance}
            nextLabel={blockIdx + 1 >= TETRIS_BLOCKS.length ? 'Finish Stop →' : 'Next Idea →'}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 7 · PITCH LAB (Slot Machine + 4-Step Builder = 8 pts)
   ============================================================================ */
export function PitchLabGame({ stop, onFinish, onBack, onNextStop }) {
  const [spun, setSpun] = useState(false);
  const [reels, setReels] = useState({
    topic: PITCH_REELS.topics[0],
    target: PITCH_REELS.targets[0],
    twist: PITCH_REELS.twists[0],
  });
  const [stepIdx, setStepIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const spinReels = () => {
    setReels({
      topic: PITCH_REELS.topics[Math.floor(Math.random() * PITCH_REELS.topics.length)],
      target: PITCH_REELS.targets[Math.floor(Math.random() * PITCH_REELS.targets.length)],
      twist: PITCH_REELS.twists[Math.floor(Math.random() * PITCH_REELS.twists.length)],
    });
    setSpun(true);
  };

  const step = PITCH_STEPS[stepIdx];

  const pickOption = (opt) => {
    if (feedback) return;
    if (opt.ok) setScore((s) => s + 2);
    setFeedback({
      ok: opt.ok,
      line: opt.ok ? `${step.mentor} approves! (+2 PTS)` : stop.failLine,
      explanation: opt.feedback,
    });
  };

  const advance = async () => {
    if (stepIdx + 1 >= PITCH_STEPS.length) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setStepIdx((i) => i + 1);
      setFeedback(null);
    }
  };

  const replay = () => {
    setSpun(false);
    setStepIdx(0);
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
          extraNote={`Pitched "${reels.topic}" for ${reels.target} — Owl, Turtle & Fox are impressed!`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={spun ? `Step ${stepIdx + 1}/4 · ${score}/${stop.maxPoints} PTS` : 'Spin Concept Reels'}
        onBack={onBack}
      />

      {/* Slot Machine Banner */}
      <div className="box shadow-b8 p-5 bg-white flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
              Youth Exchange Pitch Slot Machine
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold uppercase">
              {spun ? 'Your Randomized Exchange Brief:' : 'Spin the 3 reels to lock in your pitch concept!'}
            </h3>
          </div>
          <button type="button" onClick={spinReels} className="btn bg-sun text-ink text-xs">
            {spun ? 'Re-spin Brief 🎲' : 'Spin Reels →'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Reel 1 · Topic', val: reels.topic, bg: 'bg-[#FFB4A2]/50' },
            { label: 'Reel 2 · Target Group', val: reels.target, bg: 'bg-[#90DBF4]/50' },
            { label: 'Reel 3 · Twist', val: reels.twist, bg: 'bg-neon/40' },
          ].map((r) => (
            <div key={r.label} className={`border-[3px] border-ink rounded-2xl p-3.5 ${r.bg}`}>
              <div className="font-mono text-[10px] font-extrabold uppercase opacity-75">{r.label}</div>
              <div className="font-extrabold text-sm sm:text-base mt-1">{r.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Pitch Builder */}
      {spun && (
        <div className="box shadow-b8 p-5 sm:p-6 bg-white flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b-2 border-ink/15 pb-3">
            <img
              src={ERASMUS_SPRITES[step.mentorSprite] || ERASMUS_SPRITES.mentorOwl}
              alt={step.mentor}
              className="w-16 h-16 object-contain shrink-0"
              draggable={false}
            />
            <div>
              <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
                Judge on Stage: {step.mentor}
              </div>
              <h3 className="text-xl font-extrabold uppercase">{step.title}</h3>
            </div>
          </div>

          <p className="text-sm sm:text-base font-bold">{step.prompt}</p>

          {!feedback ? (
            <div className="grid grid-cols-1 gap-3">
              {step.options.map((opt) => (
                <button
                  key={opt.text}
                  type="button"
                  onClick={() => pickOption(opt)}
                  className="border-[3px] border-ink rounded-2xl p-4 bg-paper hover:bg-sun/35 text-left font-bold text-sm shadow-b4 cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          ) : (
            <PattyReaction
              mood={feedback.ok ? 'ok' : 'fail'}
              spriteKey={feedback.ok ? step.mentorSprite : stop.failPose}
              line={feedback.line}
              explanation={feedback.explanation}
              onNext={advance}
              nextLabel={stepIdx + 1 >= PITCH_STEPS.length ? 'Finish Pitch →' : `Next Step (${stepIdx + 2}/4) →`}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   GAME 8 · CULTURE ICEBERG (Cultural Awareness · 8 pieces = 8 pts)
   ============================================================================ */
export function CultureIcebergGame({ stop, onFinish, onBack, onNextStop }) {
  const [placements, setPlacements] = useState({});
  const [selectedId, setSelectedId] = useState(ICEBERG_PIECES[0].id);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [saveResult, setSaveResult] = useState(null);

  const selectedPiece = ICEBERG_PIECES.find((p) => p.id === selectedId) || null;
  const allPlaced = Object.keys(placements).length === ICEBERG_PIECES.length;

  const assignZone = (zone) => {
    if (checked || !selectedId) return;
    const next = { ...placements, [selectedId]: zone };
    setPlacements(next);
    const nextUnplaced = ICEBERG_PIECES.find((p) => !next[p.id]);
    setSelectedId(nextUnplaced ? nextUnplaced.id : null);
  };

  const checkIceberg = async () => {
    const pts = ICEBERG_PIECES.filter((p) => placements[p.id] === p.zone).length;
    setScore(pts);
    setChecked(true);
    const res = await onFinish(pts);
    setSaveResult(res);
  };

  const replay = () => {
    setPlacements({});
    setSelectedId(ICEBERG_PIECES[0].id);
    setChecked(false);
    setScore(0);
    setSaveResult(null);
  };

  if (checked) {
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
          extraNote="Most intercultural misunderstandings happen below the water — curiosity and open questions help bridge what isn't visible at first sight!"
        />
        <div className="box shadow-b6 p-4 sm:p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ICEBERG_PIECES.map((p) => {
            const ok = placements[p.id] === p.zone;
            return (
              <div key={p.id} className={`border-2 border-ink rounded-xl p-3 ${ok ? 'bg-neon/35' : 'bg-[#FFB4A2]/45'}`}>
                <div className="font-extrabold text-sm">
                  {ok ? '✓' : '✕'} {p.label} — <span className="font-mono uppercase">{p.zone} WATER</span>
                </div>
                <p className="text-xs font-medium mt-1">{p.explain}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Placed ${Object.keys(placements).length}/${ICEBERG_PIECES.length}`}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Iceberg visual & 2 placement zones */}
        <div className="lg:col-span-6 box shadow-b8 overflow-hidden bg-white">
          <div className="relative h-44 w-full border-b-[3px] border-ink overflow-hidden">
            <img src={ERASMUS_BGS.iceberg} alt="Culture Iceberg" className="w-full h-full object-cover" draggable={false} />
            <div className="absolute top-3 left-3 tag bg-white text-ink">Above water = Visible</div>
            <div className="absolute bottom-3 left-3 tag bg-ink text-sun">Below water = Unspoken norms</div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {selectedPiece ? (
              <div className="border-[3px] border-ink rounded-2xl bg-sun/35 p-4 text-center">
                <div className="font-mono text-[11px] font-extrabold uppercase text-cobalt">Place selected puzzle piece:</div>
                <div className="text-base sm:text-lg font-extrabold mt-1">{selectedPiece.label}</div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button type="button" onClick={() => assignZone('ABOVE')} className="btn bg-white text-ink text-xs">
                    ☀ Above Water
                  </button>
                  <button type="button" onClick={() => assignZone('BELOW')} className="btn bg-cobalt text-white text-xs">
                    🌊 Below Water
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={checkIceberg} className="btn bg-neon text-ink w-full py-3">
                Check Culture Iceberg →
              </button>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border-2 border-ink rounded-xl bg-paper p-3">
                <div className="font-mono font-extrabold uppercase mb-2">☀ Above ({ICEBERG_PIECES.filter((p) => placements[p.id] === 'ABOVE').length})</div>
                <div className="flex flex-col gap-1">
                  {ICEBERG_PIECES.filter((p) => placements[p.id] === 'ABOVE').map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className="text-left px-2 py-1 rounded bg-white border border-ink/40 font-bold truncate cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-2 border-ink rounded-xl bg-[#90DBF4]/35 p-3">
                <div className="font-mono font-extrabold uppercase mb-2">🌊 Below ({ICEBERG_PIECES.filter((p) => placements[p.id] === 'BELOW').length})</div>
                <div className="flex flex-col gap-1">
                  {ICEBERG_PIECES.filter((p) => placements[p.id] === 'BELOW').map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className="text-left px-2 py-1 rounded bg-white border border-ink/40 font-bold truncate cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: All 8 Puzzle Clues */}
        <div className="lg:col-span-6 box shadow-b6 p-4 sm:p-5 bg-white flex flex-col gap-2.5">
          <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
            Select a piece to place or change:
          </div>
          {ICEBERG_PIECES.map((p) => {
            const z = placements[p.id];
            const active = selectedId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`p-3 rounded-xl border-2 border-ink text-left flex items-center justify-between gap-3 cursor-pointer ${
                  active ? 'bg-sun shadow-b2' : z ? 'bg-paper' : 'bg-white hover:bg-paper'
                }`}
              >
                <span className="font-bold text-sm">{p.label}</span>
                <span className={`tag text-[10px] shrink-0 ${z === 'ABOVE' ? 'bg-white' : z === 'BELOW' ? 'bg-cobalt text-white' : 'bg-paper text-mute'}`}>
                  {z || 'Unplaced'}
                </span>
              </button>
            );
          })}
          {allPlaced && (
            <button type="button" onClick={checkIceberg} className="btn bg-neon text-ink mt-2">
              Submit Iceberg Sort →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 9 · FINAL TEST & YOUTHPASS CEREMONY (10 MCQs × 3 pts = 30 pts)
   ============================================================================ */
export function FinalTestGame({ stop, onFinish, onBack, onOpenResults }) {
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const q = FINAL_TEST_QUESTIONS[qIdx];

  const handlePick = useCallback(
    (choiceIdx) => {
      if (feedback || done) return;
      const timedOut = choiceIdx === -1;
      const ok = !timedOut && choiceIdx === q.correct;
      if (ok) setScore((s) => s + 3);
      setFeedback({
        ok,
        picked: choiceIdx,
        line: ok
          ? 'Brilliant! +3 PTS toward your Youthpass!'
          : timedOut
            ? 'Time is up! Here is the answer:'
            : stop.failLine,
        explanation: q.explanation,
      });
    },
    [done, feedback, q, stop.failLine],
  );

  useEffect(() => {
    if (done || feedback) return undefined;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handlePick(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done, feedback, handlePick]);

  const advance = async () => {
    if (qIdx + 1 >= FINAL_TEST_QUESTIONS.length) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setQIdx((i) => i + 1);
      setTimeLeft(30);
      setFeedback(null);
    }
  };

  const replay = () => {
    setQIdx(0);
    setTimeLeft(30);
    setScore(0);
    setFeedback(null);
    setDone(false);
    setSaveResult(null);
  };

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <SceneHero stop={stop} scoreLabel={`${score}/${stop.maxPoints} PTS`} onBack={onBack} />
        <div className="box shadow-b8 p-6 bg-paper flex flex-col sm:flex-row items-center gap-4">
          <img src={ERASMUS_PROPS.scroll} alt="Youthpass Certificate" className="w-24 h-20 object-contain shrink-0" draggable={false} />
          <div className="flex-1">
            <div className="font-mono text-xs font-extrabold uppercase text-cobalt">Youthpass Ceremony</div>
            <h3 className="text-xl font-extrabold uppercase">Certificate Scroll Unlocked!</h3>
            <p className="text-sm font-medium mt-1">
              Open your full 8-axis Youthpass Radar Chart &amp; rating tier now to see every competence in action.
            </p>
          </div>
          {onOpenResults && (
            <button type="button" onClick={onOpenResults} className="btn bg-cobalt text-white text-xs shrink-0">
              Open Youthpass Radar →
            </button>
          )}
        </div>
        <GameCompleteCard
          stop={stop}
          earned={score}
          maxPoints={stop.maxPoints}
          saveResult={saveResult}
          onReplay={replay}
          onBackToMap={onBack}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Q${qIdx + 1}/${FINAL_TEST_QUESTIONS.length} · ${score}/${stop.maxPoints} PTS`}
        onBack={onBack}
      />

      <div className="box shadow-b8 p-5 sm:p-7 bg-white flex flex-col gap-5 max-w-2xl w-full mx-auto">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-extrabold uppercase text-cobalt">
            Worth 3 PTS · Final Exam
          </span>
          <span className={`tag font-mono tabular-nums ${timeLeft <= 6 ? 'bg-hot text-white' : 'bg-sun text-ink'}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        <h3 className="text-lg sm:text-2xl font-extrabold leading-snug">{q.q}</h3>

        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correct;
            const isPicked = feedback && feedback.picked === idx;
            let cls = 'bg-paper hover:bg-sun/35';
            if (feedback) {
              if (isCorrect) cls = 'bg-neon text-ink';
              else if (isPicked) cls = 'bg-[#FFB4A2] text-ink';
              else cls = 'bg-paper opacity-65';
            }
            return (
              <button
                key={opt}
                type="button"
                disabled={!!feedback}
                onClick={() => handlePick(idx)}
                className={`border-[3px] border-ink rounded-2xl p-4 text-left font-bold text-sm sm:text-base shadow-b4 cursor-pointer ${cls}`}
              >
                <span className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <PattyReaction
            mood={feedback.ok ? 'ok' : 'fail'}
            spriteKey={feedback.ok ? 'pattyCelebrate' : stop.failPose}
            line={feedback.line}
            explanation={feedback.explanation}
            onNext={advance}
            nextLabel={qIdx + 1 >= FINAL_TEST_QUESTIONS.length ? 'Claim Youthpass →' : 'Next question →'}
          />
        )}
      </div>
    </div>
  );
}
