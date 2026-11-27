import { useCallback, useEffect, useRef, useState } from 'react';
import { ERASMUS_BGS, ERASMUS_PROPS, ERASMUS_SPRITES, ERASMUS_STICKERS } from '../../assets/erasmus/index.js';
import {
  BOARD_GREEN_SQUARES,
  BOARD_RED_SQUARES,
  CIVIC_CITY_DISTRICTS,
  CIVIC_CITY_PROJECTS,
  CULTURE_QUEST_CARDS,
  FINAL_TEST_QUESTIONS,
  SELF_REFLECTION_PROMPTS,
  STARTUP_BUDGET_ITEMS,
  STARTUP_CONCEPTS,
  STARTUP_ROUND_1,
  STARTUP_ROUND_3,
  STARTUP_SEQUENCE,
  STOP5_BOARD_QUESTIONS,
} from '../../data/erasmusGames.js';
import { GameCompleteCard, PattyReaction, SceneHero } from './PrettyPattyBanner.jsx';

/* ============================================================================
   GAME 5 · EXCHANGE JOURNEY (Compact Top Dice + 60-Sq Board + 10 Question Tiles + Missions)
   ============================================================================ */
export function ExchangeJourneyGame({
  stop,
  attemptsUsed = 0,
  maxAttempts = 3,
  wallet2048 = 0,
  onBeginRun,
  onExtraReward,
  onCompleteChallenge,
  onBack,
  onNextStop,
}) {
  const [pos, setPos] = useState(1);
  const [dice, setDice] = useState(null);
  const [spinFace, setSpinFace] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const [runStarted, setRunStarted] = useState(false);
  const [runAttemptNum, setRunAttemptNum] = useState(attemptsUsed);
  const [runExtraHubPts, setRunExtraHubPts] = useState(0);
  const [runCoins, setRunCoins] = useState(0);

  const [visitedSquares, setVisitedSquares] = useState([]);
  const [usedMissionIds, setUsedMissionIds] = useState([]);

  // Floating pop-up modal: { type: 'mission'|'question', square, data }
  const [modalEvent, setModalEvent] = useState(null);
  const [missionNote, setMissionNote] = useState('');
  const [modalFeedback, setModalFeedback] = useState(null);

  const [bannerMsg, setBannerMsg] = useState(
    'Tap Roll Dice above the map! Reach #60 (8 PTS), hit purple ? for Extra Hub PTS, or yellow ★ for +500 Outfit Coins!',
  );
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [blockedMsg, setBlockedMsg] = useState('');

  const unmountedRef = useRef(false);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    timersRef.current = [];
  }, []);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      clearTimers();
    };
  }, [clearTimers]);

  const scheduleTimeout = (fn, ms) => {
    const id = setTimeout(() => {
      if (!unmountedRef.current) fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  };

  const finishStop5 = async () => {
    setBannerMsg('Finish line reached! Pretty Patty completed all 60 squares (+8 Erasmus+ PTS)!');
    setDone(true);
    if (onCompleteChallenge) {
      const res = await onCompleteChallenge(stop.maxPoints);
      setSaveResult(res);
    }
  };

  const stepAnimated = (fromSq, toSq, onDone) => {
    setIsMoving(true);
    if (fromSq === toSq) {
      setIsMoving(false);
      onDone(toSq);
      return;
    }
    const dir = toSq > fromSq ? 1 : -1;
    let cur = fromSq;
    const hop = () => {
      cur += dir;
      setPos(cur);
      if (cur === toSq) {
        scheduleTimeout(() => {
          setIsMoving(false);
          onDone(cur);
        }, 150);
      } else {
        scheduleTimeout(hop, 120);
      }
    };
    scheduleTimeout(hop, 120);
  };

  const openMissionPopup = (square) => {
    const availM = SELF_REFLECTION_PROMPTS.filter((m) => !usedMissionIds.includes(m.id));
    const poolM = availM.length > 0 ? availM : SELF_REFLECTION_PROMPTS;
    const chosenM = poolM[Math.floor(Math.random() * poolM.length)];
    setUsedMissionIds((prev) => (prev.includes(chosenM.id) ? prev : [...prev, chosenM.id]));
    setMissionNote('');
    setModalEvent({ type: 'mission', square, data: chosenM });
    setModalFeedback(null);
  };

  const handleLanding = async (sq) => {
    if (sq >= 60) {
      await finishStop5();
      return;
    }

    const green = BOARD_GREEN_SQUARES[sq];
    if (green) {
      setBannerMsg(`Square ${sq}: ${green.label}`);
      const boostedSq = Math.min(60, sq + green.stepDelta);
      scheduleTimeout(() => {
        stepAnimated(sq, boostedSq, async (finalSq) => {
          if (finalSq >= 60) {
            await finishStop5();
          } else {
            setBannerMsg(`Boost landed on square #${finalSq} — roll again!`);
          }
        });
      }, 300);
      return;
    }

    const red = BOARD_RED_SQUARES[sq];
    if (red) {
      setBannerMsg(`Square ${sq}: ${red.label}`);
      const detourSq = Math.max(1, sq + red.stepDelta);
      scheduleTimeout(() => {
        stepAnimated(sq, detourSq, (finalSq) => {
          setBannerMsg(`Detour ended on square #${finalSq} — keep rolling!`);
        });
      }, 300);
      return;
    }

    const boardQuestion = STOP5_BOARD_QUESTIONS[sq];
    if (boardQuestion) {
      if (visitedSquares.includes(sq)) {
        setBannerMsg(`Question #${sq} already checked on this run — roll again!`);
        return;
      }
      setVisitedSquares((prev) => [...prev, sq]);
      setBannerMsg(`Square #${sq}: Bonus Question! Answer for +${boardQuestion.extraPts} Extra Hub PTS!`);
      setModalEvent({ type: 'question', square: sq, data: boardQuestion });
      setModalFeedback(null);
      return;
    }

    // Yellow square -> Mission / Self-Reflection (+500 Outfit Coins)
    if (!visitedSquares.includes(sq)) {
      setVisitedSquares((prev) => [...prev, sq]);
    }
    setBannerMsg(`Square #${sq}: Mission! Complete for +500 Outfit Coins (or skip)!`);
    openMissionPopup(sq);
  };

  const rollDice = async () => {
    if (isRolling || isMoving || modalEvent || showGuide || done) return;
    setBlockedMsg('');

    if (!runStarted) {
      if (attemptsUsed >= maxAttempts) {
        setBlockedMsg(`All ${maxAttempts}/${maxAttempts} attempts on this block have been used.`);
        return;
      }
      if (onBeginRun) {
        const res = await onBeginRun();
        if (!res?.allowed) {
          setBlockedMsg(`All ${maxAttempts}/${maxAttempts} attempts on this block have been used.`);
          return;
        }
        setRunAttemptNum(res.attempts || attemptsUsed + 1);
      } else {
        setRunAttemptNum(attemptsUsed + 1);
      }
      setRunStarted(true);
    }

    setIsRolling(true);
    setBannerMsg('Rolling the dice...');

    const spinInterval = setInterval(() => {
      if (unmountedRef.current) return;
      setSpinFace(Math.floor(Math.random() * 6) + 1);
    }, 75);
    timersRef.current.push(spinInterval);

    scheduleTimeout(() => {
      clearInterval(spinInterval);
      const rolled = Math.floor(Math.random() * 6) + 1;
      setSpinFace(rolled);
      setDice(rolled);
      setIsRolling(false);
      setBannerMsg(`Rolled ${rolled}! Moving Pretty Patty...`);

      const target = Math.min(60, pos + rolled);
      stepAnimated(pos, target, handleLanding);
    }, 620);
  };

  const completeMission = () => {
    if (!modalEvent || modalFeedback) return;
    setRunCoins((c) => c + 500);
    onExtraReward?.({
      outfitCoins: 500,
      extraHubPts: 0,
      reason: '',
    }).catch(() => {});

    setModalFeedback({
      ok: true,
      title: '+500 Outfit Coins Added to Wardrobe!',
      text: 'Nice mission! Spend your Outfit Coins on Pretty Patty’s costumes in the Mouse Wardrobe!',
    });
  };

  const answerQuestion = (choiceIdx) => {
    if (!modalEvent || modalFeedback) return;
    const q = modalEvent.data;
    const ok = choiceIdx === q.correct;
    if (ok) {
      setRunExtraHubPts((p) => p + q.extraPts);
      setRunCoins((c) => c + 500);
      onExtraReward?.({
        outfitCoins: 500,
        extraHubPts: q.extraPts,
        reason: `Extra Hub PTS (Map Q#${modalEvent.square})`,
      }).catch(() => {});
    }
    setModalFeedback({
      ok,
      title: ok
        ? `Correct! +${q.extraPts} Extra Hub PTS & +500 Outfit Coins!`
        : 'Not quite — good try!',
      text: ok
        ? `${q.explain} (+500 Outfit Coins added to your Wardrobe, and Extra Hub PTS go to the main leaderboard only — not Erasmus+ Challenge score.)`
        : q.explain,
    });
  };

  const closeModal = () => {
    setModalEvent(null);
    setModalFeedback(null);
    setMissionNote('');
  };

  const replay = () => {
    clearTimers();
    setPos(1);
    setDice(null);
    setSpinFace(1);
    setIsRolling(false);
    setIsMoving(false);
    setRunStarted(false);
    setRunExtraHubPts(0);
    setRunCoins(0);
    setVisitedSquares([]);
    setUsedMissionIds([]);
    setModalEvent(null);
    setModalFeedback(null);
    setMissionNote('');
    setBlockedMsg('');
    setSaveResult(null);
    setDone(false);
    setBannerMsg(
      'Tap Roll Dice above the map! Reach #60 (8 PTS), hit purple ? for Extra Hub PTS, or yellow ★ for +500 Outfit Coins!',
    );
  };

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <SceneHero stop={stop} scoreLabel={`${stop.maxPoints}/${stop.maxPoints} PTS`} onBack={onBack} />
        <GameCompleteCard
          stop={stop}
          earned={stop.maxPoints}
          maxPoints={stop.maxPoints}
          saveResult={saveResult}
          attemptsUsed={saveResult?.attempts ?? runAttemptNum}
          maxAttempts={maxAttempts}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote={`Finished the 60-square trail (+${stop.maxPoints} Erasmus+ PTS)! During this run you also collected +${runExtraHubPts} Extra Hub Rating PTS (main leaderboard only) & +${runCoins.toLocaleString()} Outfit Coins!`}
        />
      </div>
    );
  }

  // Build 6 boustrophedon rows of 10 squares (60 at top down to 1 at bottom-left)
  const rows = [];
  for (let r = 5; r >= 0; r--) {
    const start = r * 10 + 1;
    const rowArr = Array.from({ length: 10 }, (_, c) => start + c);
    if (r % 2 === 1) rowArr.reverse();
    rows.push(rowArr);
  }

  const questionSquaresHit = Object.keys(STOP5_BOARD_QUESTIONS).filter((sq) =>
    visitedSquares.includes(Number(sq)),
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <SceneHero
        stop={stop}
        scoreLabel={`Sq ${pos}/60 · Extra +${runExtraHubPts} PTS · +${runCoins.toLocaleString()} Coins`}
        onBack={onBack}
      />

      {/* Unified Board Card with Compact Dice Roller DIRECTLY ABOVE the Map */}
      <div className="box shadow-b8 overflow-hidden bg-white max-w-5xl w-full mx-auto">
        {/* Top Metadata Bar */}
        <div className="bg-ink text-white px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-ink">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-extrabold uppercase">
            <span className="text-sun">
              Attempt {Math.min(maxAttempts, runStarted ? runAttemptNum : attemptsUsed + 1)}/{maxAttempts}
            </span>
            <span className="text-white/60">·</span>
            <span className="text-[#D8B4FE]">Questions: {questionSquaresHit}/10</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-extrabold uppercase text-neon">
              Wallet: {wallet2048.toLocaleString()} Coins
            </span>
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="border-2 border-white/80 rounded-md px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase text-white hover:bg-white hover:text-ink cursor-pointer"
            >
              ? Rules
            </button>
          </div>
        </div>

        {/* Compact Dice Roller Bar RIGHT ABOVE the 60-Square Map (visible together on phone!) */}
        <div className="bg-[#FFF7D6] border-b-[3px] border-ink px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Compact Spinning Dice */}
              <div
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-[3px] border-ink bg-sun flex items-center justify-center shadow-b2 shrink-0 transition-transform duration-150 ${
                  isRolling ? 'animate-spin scale-105' : ''
                }`}
              >
                <img
                  src={ERASMUS_PROPS.dice}
                  alt=""
                  className="w-7 h-7 object-contain opacity-25"
                  draggable={false}
                />
                <span className="absolute font-mono font-extrabold text-xl sm:text-2xl text-ink tabular-nums">
                  {isRolling ? spinFace : dice ?? '?'}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-xs font-extrabold uppercase">
                  <span className="tag bg-white text-ink !text-[10px]">Sq {pos}/60</span>
                  <span className="tag bg-[#A855F7] text-white !text-[10px]">Extra +{runExtraHubPts} Hub PTS</span>
                  <span className="tag bg-neon text-ink !text-[10px]">+{runCoins} Coins</span>
                </div>
                <p className="text-[11px] sm:text-xs font-bold leading-snug text-ink/90 mt-1 truncate sm:whitespace-normal">
                  {bannerMsg}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isRolling || isMoving || !!modalEvent || showGuide || done}
              onClick={rollDice}
              className="btn bg-sun text-ink !px-3.5 !py-2 sm:!px-5 sm:!py-2.5 text-xs sm:text-sm shrink-0 disabled:opacity-50"
            >
              {isRolling ? 'Rolling...' : isMoving ? 'Moving...' : 'Roll Dice →'}
            </button>
          </div>

          {blockedMsg && (
            <div className="rounded-lg border-2 border-ink bg-[#FFB4A2] px-3 py-1.5 text-xs font-extrabold">
              {blockedMsg}
            </div>
          )}
        </div>

        {/* 60-Square Bright Color Board (ZERO Stickers inside squares) */}
        <div className="p-2 sm:p-4 bg-[#FFFDF4]">
          <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl border-[3px] border-ink bg-ink/5 shadow-inner">
            {rows.flat().map((sq) => {
              const isPatty = sq === pos;
              const green = BOARD_GREEN_SQUARES[sq];
              const red = BOARD_RED_SQUARES[sq];
              const isQuestion = !!STOP5_BOARD_QUESTIONS[sq];
              const isStart = sq === 1;
              const isGoal = sq === 60;
              const isVisited = visitedSquares.includes(sq);

              let tileCls = 'bg-[#FFE200] text-ink';
              if (isGoal) tileCls = 'bg-[#39FF14] text-ink';
              else if (isStart) tileCls = 'bg-[#38BDF8] text-ink';
              else if (green) tileCls = 'bg-[#22C55E] text-white';
              else if (red) tileCls = 'bg-[#EF4444] text-white';
              else if (isQuestion) tileCls = isVisited ? 'bg-[#C084FC] text-white/85' : 'bg-[#9333EA] text-white';
              else if (isVisited) tileCls = 'bg-[#FFF3A1] text-ink/75';

              return (
                <div
                  key={sq}
                  className={`relative aspect-square rounded-lg sm:rounded-xl border-2 border-ink flex flex-col items-center justify-between p-0.5 sm:p-1 transition-transform duration-150 ${tileCls} ${
                    isPatty ? 'ring-4 ring-cobalt scale-110 z-20 shadow-b4' : ''
                  }`}
                >
                  <span className="self-start font-mono font-extrabold text-[8px] sm:text-[10px] leading-none">
                    {sq}
                  </span>

                  {!isPatty ? (
                    <div className="flex flex-col items-center justify-center flex-1 leading-none text-center">
                      {isStart && (
                        <span className="font-mono font-extrabold text-[7px] sm:text-[9px] uppercase">GO</span>
                      )}
                      {isGoal && (
                        <span className="font-mono font-extrabold text-[7px] sm:text-[9px] uppercase">WIN</span>
                      )}
                      {green && (
                        <span className="font-mono font-extrabold text-[9px] sm:text-[11px]">+{green.stepDelta}</span>
                      )}
                      {red && (
                        <span className="font-mono font-extrabold text-[9px] sm:text-[11px]">{red.stepDelta}</span>
                      )}
                      {isQuestion && (
                        <span className="font-mono font-extrabold text-[10px] sm:text-xs">
                          {isVisited ? '✓' : '?'}
                        </span>
                      )}
                      {!isStart && !isGoal && !green && !red && !isQuestion && (
                        <span className="font-mono font-extrabold text-[9px] sm:text-xs opacity-75">
                          {isVisited ? '✓' : '★'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <img
                      src={ERASMUS_SPRITES.trioWalk}
                      alt="Pretty Patty"
                      className="w-6 h-6 sm:w-9 sm:h-9 object-contain absolute inset-0 m-auto drop-shadow-[0_2px_0_rgba(17,17,17,0.45)]"
                      draggable={false}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-[10px] sm:text-xs font-extrabold uppercase">
            <span className="inline-flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded border-2 border-ink bg-[#9333EA]" /> Question (10 tiles = +5 Extra PTS &amp; +500 Coins)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded border-2 border-ink bg-[#FFE200]" /> Mission (★ = +500 Outfit Coins)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded border-2 border-ink bg-[#22C55E]" /> Boost (+Steps)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded border-2 border-ink bg-[#EF4444]" /> Detour (−Steps)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded border-2 border-ink bg-[#39FF14]" /> Finish (8 Erasmus+ PTS)
            </span>
          </div>
        </div>
      </div>

      {/* Rules Pop-Up Modal Explaining Extra Hub Points vs Missions vs Erasmus+ Score */}
      {showGuide && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="box shadow-b8 bg-white max-w-lg w-full overflow-hidden">
            <div className="bg-[#FFE200] border-b-[3px] border-ink px-5 py-3 flex items-center justify-between gap-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold uppercase text-ink">
                How This Map Works · Extra Points vs Missions
              </span>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="font-mono font-extrabold text-sm text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={ERASMUS_SPRITES.trioCurious} alt="Pretty Patty" className="w-14 h-14 object-contain shrink-0" draggable={false} />
                <p className="text-xs sm:text-sm font-bold leading-snug text-ink">
                  Every tile you land on gives you either a <b>Question</b> or a <b>Mission</b> (depending on your dice roll!):
                </p>
              </div>

              <div className="border-[3px] border-ink rounded-xl bg-[#F3E8FF] p-3">
                <div className="font-mono text-xs font-extrabold uppercase text-[#6B21A8]">
                  ❓ 10 Question Squares → +5 Extra Hub PTS &amp; +500 Coins
                </div>
                <p className="text-xs font-medium text-ink mt-1">
                  Answer right to earn <b>+5 Extra Hub Points</b> straight to the <b>Main Hub Rating</b> AND <b>+500 Outfit Coins</b> for the Mouse Wardrobe! Because there are 10 questions placed around the board, which ones you hit depends on your dice rolls. <b>Note: Extra Points do NOT add to your Erasmus+ Challenge score!</b>
                </p>
              </div>

              <div className="border-[3px] border-ink rounded-xl bg-[#FEF9C3] p-3">
                <div className="font-mono text-xs font-extrabold uppercase text-ink">
                  ★ Yellow Mission Squares → +500 Outfit Coins
                </div>
                <p className="text-xs font-medium text-ink mt-1">
                  Missions give kind team challenges &amp; self-reflections that reward <b>+500 Outfit Coins</b> for Pretty Patty’s Mouse Wardrobe (you can skip anytime).
                </p>
              </div>

              <div className="border-[3px] border-ink rounded-xl bg-neon/35 p-3">
                <div className="font-mono text-xs font-extrabold uppercase text-ink">
                  🏁 Square 60 → 8/8 Erasmus+ Challenge PTS
                </div>
                <p className="text-xs font-medium text-ink mt-1">
                  Reach the green Finish tile (#60) to complete Stop 5 and earn your <b>8/8 PTS</b> on the Erasmus+ Competence Trail!
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="btn bg-ink text-[#FFE200] text-xs sm:text-sm w-full mt-1"
              >
                Got It — Let’s Roll! →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tile Pop-Up Modal (Question OR Mission) */}
      {modalEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="box shadow-b8 bg-white max-w-lg w-full overflow-hidden">
            <div
              className={`border-b-[3px] border-ink px-4 sm:px-5 py-3 flex items-center justify-between gap-2 ${
                modalEvent.type === 'question' ? 'bg-[#9333EA] text-white' : 'bg-[#FFE200] text-ink'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="tag bg-white text-ink text-[10px] shrink-0">
                  Sq #{modalEvent.square}
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-extrabold uppercase truncate">
                  {modalEvent.type === 'question'
                    ? `❓ Question · +${modalEvent.data.extraPts} Extra PTS & +500 Coins`
                    : `${modalEvent.data.badge} · +500 Coins`}
                </span>
              </div>
              {!modalFeedback && (
                <button
                  type="button"
                  onClick={closeModal}
                  className="font-mono text-xs font-extrabold uppercase underline shrink-0 cursor-pointer"
                >
                  Skip
                </button>
              )}
            </div>

            <div className="p-4 sm:p-6 flex flex-col gap-3.5">
              <div className="flex items-start gap-3">
                <img
                  src={
                    modalFeedback
                      ? modalFeedback.ok
                        ? ERASMUS_SPRITES.pattyHeart
                        : ERASMUS_SPRITES.pattyReading
                      : ERASMUS_SPRITES.trioCurious
                  }
                  alt="Pretty Patty"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0"
                  draggable={false}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] font-extrabold uppercase text-cobalt mb-1">
                    {modalEvent.type === 'question'
                      ? 'Extra Hub PTS (Main Rating only) + 500 Wardrobe Coins'
                      : 'Board Mission (Rewards +500 Wardrobe Outfit Coins)'}
                  </div>
                  <h3 className="text-sm sm:text-lg font-extrabold leading-snug text-ink">
                    {modalEvent.type === 'question' ? modalEvent.data.q : modalEvent.data.prompt}
                  </h3>
                  {modalEvent.type === 'mission' && !modalFeedback && (
                    <p className="text-xs font-medium text-mute mt-1">{modalEvent.data.hint}</p>
                  )}
                </div>
              </div>

              {!modalFeedback && modalEvent.type === 'mission' && (
                <>
                  <textarea
                    rows={2}
                    value={missionNote}
                    onChange={(e) => setMissionNote(e.target.value)}
                    placeholder="Optional reflection note for yourself..."
                    className="w-full rounded-xl border-[3px] border-ink bg-paper p-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={completeMission}
                      className="btn bg-sun text-ink text-xs flex-1"
                    >
                      Complete Mission (+500 Outfit Coins) ✓
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn bg-paper text-ink text-xs"
                    >
                      Skip
                    </button>
                  </div>
                </>
              )}

              {!modalFeedback && modalEvent.type === 'question' && (
                <>
                  <div className="flex flex-col gap-2">
                    {modalEvent.data.options.map((opt, idx) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => answerQuestion(idx)}
                        className="border-[3px] border-ink rounded-xl bg-paper hover:bg-sun/45 p-3 text-left text-xs sm:text-sm font-bold cursor-pointer"
                      >
                        <span className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn bg-paper text-ink text-xs w-full"
                  >
                    Skip Question (0 Extra PTS)
                  </button>
                </>
              )}

              {modalFeedback && (
                <div
                  className={`rounded-2xl border-[3px] border-ink p-4 flex flex-col gap-2 ${
                    modalFeedback.ok ? 'bg-neon/40' : 'bg-[#FFB4A2]/45'
                  }`}
                >
                  <div className="font-extrabold text-sm sm:text-base">{modalFeedback.title}</div>
                  <p className="text-xs sm:text-sm font-medium text-ink/90">{modalFeedback.text}</p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn bg-ink text-white text-xs self-end mt-1"
                  >
                    Back to Map →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   GAME 6 · CIVIC CITY BUILDER (Stop 6 · Citizenship · 8 projects = 8 pts)
   ============================================================================ */
export function PriorityTetrisGame({ stop, attemptsUsed = 0, maxAttempts = 3, onFinish, onBack, onNextStop }) {
  const [projIdx, setProjIdx] = useState(0);
  const [builtByDistrict, setBuiltByDistrict] = useState({
    inclusion: [],
    digital: [],
    green: [],
    participation: [],
  });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const project = CIVIC_CITY_PROJECTS[projIdx];

  const placeIntoDistrict = useCallback(
    (district) => {
      if (feedback || done || !project) return;
      const ok = district.id === project.target;
      if (ok) {
        setScore((s) => s + 1);
      }
      setBuiltByDistrict((prev) => ({
        ...prev,
        [project.target]: [...prev[project.target], { id: project.id, title: project.title, iconKey: project.iconKey, matched: ok }],
      }));
      setFeedback({
        ok,
        line: ok
          ? `Built in ${district.districtName} (${district.short})! (+1 PT)`
          : `${stop.failLine} Placed correctly into ${CIVIC_CITY_DISTRICTS.find((d) => d.id === project.target)?.short}.`,
        explanation: project.reason,
      });
    },
    [done, feedback, project, stop.failLine],
  );

  // Number key shortcuts 1..4 for speed
  useEffect(() => {
    if (done || feedback) return undefined;
    const onKey = (e) => {
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < CIVIC_CITY_DISTRICTS.length) {
        placeIntoDistrict(CIVIC_CITY_DISTRICTS[idx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [done, feedback, placeIntoDistrict]);

  const advance = async () => {
    if (projIdx + 1 >= CIVIC_CITY_PROJECTS.length) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setProjIdx((i) => i + 1);
      setFeedback(null);
    }
  };

  const replay = () => {
    setProjIdx(0);
    setBuiltByDistrict({ inclusion: [], digital: [], green: [], participation: [] });
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
          attemptsUsed={saveResult?.attempts ?? attemptsUsed}
          maxAttempts={maxAttempts}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote="Your Town Square now shines across all 4 Erasmus+ Horizontal Priorities: Inclusion, Digital, Climate & Democracy!"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Blueprint ${projIdx + 1}/${CIVIC_CITY_PROJECTS.length} · ${score}/${stop.maxPoints} PTS`}
        onBack={onBack}
      />

      <div className="box shadow-b8 overflow-hidden bg-white">
        {/* Top Illustrated Construction Blueprint Header */}
        <div className="relative p-4 sm:p-6 border-b-[3px] border-ink bg-[#FFF7D6]">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <img src={ERASMUS_STICKERS.crane} alt="" className="w-16 h-16 object-contain" draggable={false} />
              <img src={ERASMUS_SPRITES.pattyHardhat} alt="Builder Patty" className="w-16 h-16 object-contain" draggable={false} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="font-mono text-[11px] font-extrabold uppercase text-cobalt flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span>Active Youth Blueprint #{project.id} of {CIVIC_CITY_PROJECTS.length}</span>
                <span className="tag bg-white text-ink !text-[10px]">Press 1–4 or tap a district below</span>
              </div>
              <div className="mt-1.5 flex items-center justify-center md:justify-start gap-3">
                <img
                  src={ERASMUS_STICKERS[project.iconKey] || ERASMUS_STICKERS.crates}
                  alt=""
                  className="w-10 h-10 object-contain shrink-0"
                  draggable={false}
                />
                <h3 className="text-lg sm:text-2xl font-extrabold leading-tight text-ink">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Priority Districts in Town Square */}
        <div className="p-4 sm:p-6 bg-paper flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CIVIC_CITY_DISTRICTS.map((dist, idx) => {
              const built = builtByDistrict[dist.id] || [];
              return (
                <button
                  key={dist.id}
                  type="button"
                  disabled={!!feedback}
                  onClick={() => placeIntoDistrict(dist)}
                  className={`border-[3px] border-ink rounded-2xl p-4 text-left flex flex-col justify-between gap-3 shadow-b6 transition-all cursor-pointer disabled:cursor-default ${
                    !feedback ? 'hover:-translate-y-1 hover:shadow-b8' : ''
                  } bg-white`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`tag text-[10px] ${dist.bg} text-ink`}>
                        [{idx + 1}] {dist.short}
                      </span>
                      <img
                        src={ERASMUS_STICKERS[dist.stickerKey]}
                        alt={dist.districtName}
                        className="w-11 h-11 object-contain shrink-0"
                        draggable={false}
                      />
                    </div>
                    <h4 className="font-extrabold text-base uppercase leading-tight">{dist.districtName}</h4>
                    <p className="text-[11px] font-bold text-ink/75 mt-0.5">{dist.label}</p>
                    <p className="text-[11px] font-medium text-mute mt-1">{dist.motto}</p>
                  </div>

                  {/* 2 Visual Landmark Slots per District */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-ink/15">
                    {[0, 1].map((slotIdx) => {
                      const item = built[slotIdx];
                      return (
                        <div
                          key={slotIdx}
                          className={`h-11 rounded-xl border-2 border-ink flex items-center justify-center gap-1 px-1.5 ${
                            item
                              ? item.matched
                                ? 'bg-neon/45'
                                : 'bg-[#FFB4A2]/50'
                              : 'bg-paper border-dashed border-ink/35'
                          }`}
                        >
                          {item ? (
                            <>
                              <img src={ERASMUS_STICKERS[item.iconKey]} alt="" className="w-5 h-5 object-contain shrink-0" draggable={false} />
                              <span className="font-mono text-[10px] font-extrabold">
                                {item.matched ? '✓' : '★'} #{item.id}
                              </span>
                            </>
                          ) : (
                            <span className="font-mono text-[10px] font-bold text-mute">Slot {slotIdx + 1}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!feedback && (
                    <div className={`w-full py-1.5 rounded-lg border-2 border-ink font-mono text-[11px] font-extrabold uppercase text-center ${dist.bg}`}>
                      Build Here →
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {feedback && (
            <PattyReaction
              mood={feedback.ok ? 'ok' : 'fail'}
              spriteKey={feedback.ok ? 'trioCheer' : stop.failPose}
              line={feedback.line}
              explanation={feedback.explanation}
              onNext={advance}
              nextLabel={projIdx + 1 >= CIVIC_CITY_PROJECTS.length ? 'Open Town Square →' : 'Next Blueprint →'}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 7 · STARTUP MOUSE LAUNCHPAD (Entrepreneurship · Mouse Only · 8 pts)
   ============================================================================ */
export function PitchLabGame({ stop, attemptsUsed = 0, maxAttempts = 3, onFinish, onBack, onNextStop }) {
  const [concept, setConcept] = useState(STARTUP_CONCEPTS[0]);
  const [mission, setMission] = useState(1); // 1: Aim, 2: Budget Coins, 3: Crisis, 4: Launch Steps
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  // Mission 2 state: 8 Grant Star Coins
  const [coins, setCoins] = useState({ access: 2, green: 2, tools: 2, followup: 1, vip: 1 });
  // Mission 4 state: Tap 3 launch milestones in order
  const [pickedOrder, setPickedOrder] = useState([]);

  const spentCoins = Object.values(coins).reduce((a, b) => a + b, 0);
  const remainingCoins = 8 - spentCoins;

  const adjustCoin = (id, delta) => {
    if (feedback) return;
    setCoins((prev) => {
      const nextVal = (prev[id] || 0) + delta;
      if (nextVal < 0) return prev;
      if (delta > 0 && remainingCoins <= 0) return prev;
      return { ...prev, [id]: nextVal };
    });
  };

  const awardMission = (pts, ok, line, explain) => {
    setScore((s) => s + pts);
    setFeedback({ ok, line, explanation: explain });
  };

  const checkBudgetCoins = () => {
    if (spentCoins !== 8) return;
    const trapFree = coins.vip === 0;
    const strongPillars = coins.access >= 2 && coins.green >= 2 && coins.tools >= 2 && coins.followup >= 1;
    const pts = trapFree && strongPillars ? 2 : trapFree ? 1 : 0;
    awardMission(
      pts,
      pts === 2,
      pts === 2
        ? 'Smart Grant Budget! Every coin fuels real youth impact! (+2 PTS)'
        : pts === 1
          ? 'No coins wasted on VIP perks, though one priority pillar needed slightly more support! (+1 PT)'
          : 'Oops! Watch out — VIP limos eat funds meant for accessibility and green travel! (+0 PTS)',
      'Balanced Youth Initiatives fund Accessibility (2+), Green Travel (2+), Hands-on Tools (2+), and Follow-Up Impact (1+).',
    );
  };

  const toggleSequenceStep = (stepItem) => {
    if (feedback) return;
    if (pickedOrder.some((s) => s.id === stepItem.id)) {
      setPickedOrder((prev) => prev.filter((s) => s.id !== stepItem.id));
    } else if (pickedOrder.length < 3) {
      setPickedOrder((prev) => [...prev, stepItem]);
    }
  };

  const checkSequence = () => {
    if (pickedOrder.length < 3) return;
    const exact = pickedOrder.every((item, idx) => item.order === idx + 1);
    const pts = exact ? 2 : 1;
    awardMission(
      pts,
      exact,
      exact
        ? 'Launch sequence locked! Pretty Patty is ready to take the stage! (+2 PTS)'
        : 'Close! Remember: start from real Youth Need → Co-design & Budget → Share Open Results! (+1 PT)',
      '1) Listen to local youth → 2) Co-design inclusive budget & workshops → 3) Share results & log Youthpass growth.',
    );
  };

  const nextMission = async () => {
    setFeedback(null);
    if (mission >= 4) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setMission((m) => m + 1);
    }
  };

  const replay = () => {
    setConcept(STARTUP_CONCEPTS[0]);
    setMission(1);
    setScore(0);
    setFeedback(null);
    setDone(false);
    setSaveResult(null);
    setCoins({ access: 2, green: 2, tools: 2, followup: 1, vip: 1 });
    setPickedOrder([]);
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
          attemptsUsed={saveResult?.attempts ?? attemptsUsed}
          maxAttempts={maxAttempts}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote={`Project "${concept.name}" launched smoothly with Pretty Patty at the helm!`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Mission ${mission}/4 · ${score}/${stop.maxPoints} PTS`}
        onBack={onBack}
      />

      {/* Choose Your Mouse Startup Brief (Mouse Only!) */}
      <div className="box shadow-b6 p-4 sm:p-5 bg-white flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={ERASMUS_SPRITES.trioWalk} alt="Pretty Patty" className="w-10 h-10 object-contain" draggable={false} />
            <div>
              <div className="font-mono text-[10px] font-extrabold uppercase text-cobalt">
                Pretty Patty’s Youth Project Theme
              </div>
              <div className="font-extrabold text-sm sm:text-base">{concept.name} — <span className="font-medium text-ink/80">{concept.goal}</span></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STARTUP_CONCEPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setConcept(c)}
                className={`px-2.5 py-1 rounded-lg border-2 border-ink font-mono text-[10px] font-extrabold uppercase cursor-pointer ${
                  concept.id === c.id ? 'bg-sun text-ink shadow-b2' : 'bg-paper text-ink/75'
                }`}
              >
                {c.name.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Mission Card */}
      <div className="box shadow-b8 p-5 sm:p-6 bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink/15 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold uppercase text-cobalt">
            <img src={ERASMUS_STICKERS.megaphone} alt="" className="w-6 h-6 object-contain" draggable={false} />
            <span>Mission {mission} of 4 · Startup Mouse Launchpad</span>
          </div>
          <img
            src={feedback ? (feedback.ok ? ERASMUS_SPRITES.trioCheer : ERASMUS_SPRITES.pattyCry) : ERASMUS_SPRITES.pattyGlasses}
            alt="Pretty Patty"
            className="w-14 h-14 object-contain shrink-0"
            draggable={false}
          />
        </div>

        {/* MISSION 1: Impact Aim */}
        {mission === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold uppercase">{STARTUP_ROUND_1.title}</h3>
              <p className="text-sm font-medium mt-1">{STARTUP_ROUND_1.prompt}</p>
            </div>
            {!feedback && (
              <div className="grid grid-cols-1 gap-3">
                {STARTUP_ROUND_1.options.map((o) => (
                  <button
                    key={o.text}
                    type="button"
                    onClick={() =>
                      awardMission(
                        o.ok ? 2 : 0,
                        o.ok,
                        o.ok ? 'Spot-on startup aim! (+2 PTS)' : stop.failLine,
                        o.feedback,
                      )
                    }
                    className="border-[3px] border-ink rounded-2xl p-4 bg-paper hover:bg-sun/35 text-left font-bold text-sm shadow-b4 cursor-pointer"
                  >
                    {o.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MISSION 2: Interactive 8-Coin Grant Budget Balancer */}
        {mission === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-extrabold uppercase">Mission 2 · Balance Your 8 Startup Grant Coins</h3>
                <p className="text-sm font-medium mt-1">
                  Invest all 8 Gold Coins wisely! Fund accessibility, green travel, tools &amp; follow-up — avoid trap perks!
                </p>
              </div>
              <div className="tag bg-sun text-ink flex items-center gap-1.5 text-xs">
                <img src={ERASMUS_STICKERS.coin} alt="" className="w-4 h-4 object-contain" />
                <span>Remaining: {remainingCoins} / 8</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STARTUP_BUDGET_ITEMS.map((item) => {
                const count = coins[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className={`border-[3px] border-ink rounded-2xl p-3.5 flex items-center justify-between gap-3 ${
                      item.isTrap && count > 0 ? 'bg-[#FFB4A2]/45' : 'bg-paper'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm">{item.label}</div>
                      <div className="font-mono text-[10px] font-bold uppercase text-ink/70 mt-0.5">
                        {item.hint}
                      </div>
                      <div className="flex items-center gap-1 mt-2 min-h-[20px]">
                        {Array.from({ length: count }).map((_, i) => (
                          <img key={i} src={ERASMUS_STICKERS.coin} alt="" className="w-5 h-5 object-contain" draggable={false} />
                        ))}
                        {count === 0 && <span className="font-mono text-[10px] text-mute">0 coins</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={!!feedback || count <= 0}
                        onClick={() => adjustCoin(item.id, -1)}
                        className="w-9 h-9 rounded-xl border-2 border-ink bg-white font-mono font-extrabold text-base disabled:opacity-40 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-mono font-extrabold text-sm tabular-nums">{count}</span>
                      <button
                        type="button"
                        disabled={!!feedback || remainingCoins <= 0}
                        onClick={() => adjustCoin(item.id, 1)}
                        className="w-9 h-9 rounded-xl border-2 border-ink bg-sun font-mono font-extrabold text-base disabled:opacity-40 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {!feedback && (
              <button
                type="button"
                disabled={spentCoins !== 8}
                onClick={checkBudgetCoins}
                className="btn bg-neon text-ink self-start disabled:opacity-50"
              >
                Lock 8-Coin Startup Budget ({spentCoins}/8) →
              </button>
            )}
          </div>
        )}

        {/* MISSION 3: Live Crisis Fix */}
        {mission === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <img src={ERASMUS_STICKERS.lifebuoy} alt="" className="w-10 h-10 object-contain shrink-0" draggable={false} />
              <div>
                <h3 className="text-xl font-extrabold uppercase">{STARTUP_ROUND_3.title}</h3>
                <p className="text-sm font-medium mt-1">{STARTUP_ROUND_3.prompt}</p>
              </div>
            </div>
            {!feedback && (
              <div className="grid grid-cols-1 gap-3">
                {STARTUP_ROUND_3.options.map((o) => (
                  <button
                    key={o.text}
                    type="button"
                    onClick={() =>
                      awardMission(
                        o.ok ? 2 : 0,
                        o.ok,
                        o.ok ? 'Crisis turned into inclusive teamwork! (+2 PTS)' : stop.failLine,
                        o.feedback,
                      )
                    }
                    className="border-[3px] border-ink rounded-2xl p-4 bg-paper hover:bg-sun/35 text-left font-bold text-sm shadow-b4 cursor-pointer"
                  >
                    {o.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MISSION 4: Order the 3 Launch Steps */}
        {mission === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold uppercase">Mission 4 · Put the 3 Launch Steps in Order</h3>
              <p className="text-sm font-medium mt-1">
                Tap the three Youth Project milestones in the logical order (Start → Action → Lasting Impact).
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[STARTUP_SEQUENCE[2], STARTUP_SEQUENCE[0], STARTUP_SEQUENCE[1]].map((stepItem) => {
                const posIdx = pickedOrder.findIndex((s) => s.id === stepItem.id);
                const cleanTitle = stepItem.label.replace(/^\d+\.\s*/, '');
                return (
                  <button
                    key={stepItem.id}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => toggleSequenceStep(stepItem)}
                    className={`border-[3px] border-ink rounded-2xl p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer ${
                      posIdx >= 0 ? 'bg-sun shadow-b4' : 'bg-paper hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm sm:text-base">{cleanTitle}</span>
                    <span className="tag bg-white text-ink font-mono text-xs shrink-0">
                      {posIdx >= 0 ? `Step #${posIdx + 1}` : 'Tap to place'}
                    </span>
                  </button>
                );
              })}
            </div>

            {!feedback && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pickedOrder.length < 3}
                  onClick={checkSequence}
                  className="btn bg-neon text-ink disabled:opacity-50"
                >
                  🚀 Launch Startup Project →
                </button>
                {pickedOrder.length > 0 && (
                  <button type="button" onClick={() => setPickedOrder([])} className="btn bg-paper text-ink text-xs">
                    Reset Order
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {feedback && (
          <PattyReaction
            mood={feedback.ok ? 'ok' : 'fail'}
            spriteKey={feedback.ok ? 'trioCheer' : stop.failPose}
            line={feedback.line}
            explanation={feedback.explanation}
            onNext={nextMission}
            nextLabel={mission >= 4 ? 'See Launch Result →' : `Start Mission ${mission + 1} →`}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 8 · CULTURE QUEST DECODER (Stop 8 · Cultural Awareness · 8 pts)
   ============================================================================ */
export function CultureIcebergGame({ stop, attemptsUsed = 0, maxAttempts = 3, onFinish, onBack, onNextStop }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const card = CULTURE_QUEST_CARDS[idx];

  const handleOption = (opt) => {
    if (feedback || done) return;
    if (opt.ok) setScore((s) => s + 1);
    setFeedback({
      ok: opt.ok,
      line: opt.ok
        ? `Decoded! Hidden value: ${card.hiddenValue} (+1 PT)`
        : `${stop.failLine}`,
      explanation: card.explain,
    });
  };

  const advance = async () => {
    if (idx + 1 >= CULTURE_QUEST_CARDS.length) {
      setDone(true);
      const res = await onFinish(score);
      setSaveResult(res);
    } else {
      setIdx((i) => i + 1);
      setFeedback(null);
    }
  };

  const replay = () => {
    setIdx(0);
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
          attemptsUsed={saveResult?.attempts ?? attemptsUsed}
          maxAttempts={maxAttempts}
          onReplay={replay}
          onBackToMap={onBack}
          onNextStop={onNextStop}
          extraNote="Food and music are just the visible tip — real intercultural friendship grows when we stay curious about hidden unspoken values!"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SceneHero
        stop={stop}
        scoreLabel={`Encounter ${idx + 1}/${CULTURE_QUEST_CARDS.length} · ${score}/${stop.maxPoints} PTS`}
        onBack={onBack}
      />

      <div className="box shadow-b8 overflow-hidden bg-white max-w-3xl w-full mx-auto">
        <div className="relative h-28 sm:h-36 w-full border-b-[3px] border-ink overflow-hidden bg-ink">
          <img src={ERASMUS_BGS.iceberg} alt="Intercultural Horizon" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 sm:p-4 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src={ERASMUS_STICKERS.lantern} alt="" className="w-8 h-8 object-contain" draggable={false} />
              <span className="tag bg-sun text-ink text-[10px] sm:text-xs">{card.tag}</span>
            </div>
            <span className="tag bg-white text-ink text-[10px] sm:text-xs font-mono">
              {idx + 1} / {CULTURE_QUEST_CARDS.length}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-7 flex flex-col gap-4">
          <div className="border-[3px] border-ink rounded-2xl bg-[#E0F4FF] p-4 flex items-start gap-3">
            <img src={ERASMUS_STICKERS.treasureMap} alt="" className="w-9 h-9 object-contain shrink-0 mt-0.5" draggable={false} />
            <div>
              <div className="font-mono text-[10px] font-extrabold uppercase text-cobalt">What Patty Notices on Exchange:</div>
              <p className="text-sm sm:text-base font-bold text-ink mt-1 leading-snug">{card.clue}</p>
            </div>
          </div>

          <div className="font-extrabold text-base sm:text-lg leading-snug">{card.question}</div>

          {!feedback ? (
            <div className="grid grid-cols-1 gap-2.5">
              {card.options.map((opt) => (
                <button
                  key={opt.text}
                  type="button"
                  onClick={() => handleOption(opt)}
                  className="border-[3px] border-ink rounded-2xl p-3.5 bg-paper hover:bg-sun/35 text-left font-bold text-sm shadow-b4 cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          ) : (
            <PattyReaction
              mood={feedback.ok ? 'ok' : 'fail'}
              spriteKey={feedback.ok ? 'pattyHeart' : stop.failPose}
              line={feedback.line}
              explanation={feedback.explanation}
              onNext={advance}
              nextLabel={idx + 1 >= CULTURE_QUEST_CARDS.length ? 'Finish Culture Quest →' : 'Next Encounter →'}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   GAME 9 · FINAL TEST & YOUTHPASS CEREMONY (10 MCQs × 3 pts = 30 pts)
   ============================================================================ */
export function FinalTestGame({ stop, attemptsUsed = 0, maxAttempts = 3, onFinish, onBack, onOpenResults }) {
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
          attemptsUsed={saveResult?.attempts ?? attemptsUsed}
          maxAttempts={maxAttempts}
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
