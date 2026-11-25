import { useCallback, useEffect, useRef, useState } from 'react';
import { SPRITES } from '../mascot/sprites.js';

const SIZE = 4;

// Harmonious Neo-Brutalist tile colors aligned with the site's palette
const TILE_STYLE = {
  2: 'bg-white text-ink',
  4: 'bg-sun text-ink',
  8: 'bg-[#FF94B8] text-ink',
  16: 'bg-[#FF6E2D] text-ink',
  32: 'bg-hot text-white',
  64: 'bg-neon text-ink',
  128: 'bg-[#B89CFF] text-ink',
  256: 'bg-cobalt text-white',
  512: 'bg-[#00D2FF] text-ink',
  1024: 'bg-[#FF2E93] text-white ring-2 ring-sun',
  2048: 'bg-ink text-sun ring-4 ring-neon',
};

const tileCls = (v) => TILE_STYLE[v] || 'bg-ink text-neon ring-4 ring-hot';
const tileFont = (v) =>
  v >= 1024
    ? 'text-base sm:text-2xl'
    : v >= 128
      ? 'text-xl sm:text-3xl'
      : 'text-2xl sm:text-4xl';

function makeGridFromTiles(tiles) {
  const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  for (const t of tiles) {
    if (!t.dying) g[t.row][t.col] = t;
  }
  return g;
}

function spawnTile(tiles, nextIdRef) {
  const occupied = new Set(tiles.filter((t) => !t.dying).map((t) => `${t.row},${t.col}`));
  const empty = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!occupied.has(`${r},${c}`)) empty.push([r, c]);
    }
  }
  if (!empty.length) return tiles;
  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  return [...tiles, { id: nextIdRef.current++, value, row, col, isNew: true }];
}

function createInitialTiles(nextIdRef) {
  let t = spawnTile([], nextIdRef);
  t = spawnTile(t, nextIdRef);
  return t;
}

function moveTiles(currentTiles, dir, nextIdRef) {
  const active = currentTiles.filter((t) => !t.dying);
  const grid = makeGridFromTiles(active);
  const nextTiles = [];
  let moved = false;
  let gained = 0;

  const coordFor = (lineIdx, pos) => {
    if (dir === 'left') return [lineIdx, pos];
    if (dir === 'right') return [lineIdx, SIZE - 1 - pos];
    if (dir === 'up') return [pos, lineIdx];
    return [SIZE - 1 - pos, lineIdx];
  };

  for (let i = 0; i < SIZE; i++) {
    const line = [];
    for (let j = 0; j < SIZE; j++) {
      const [r, c] = coordFor(i, j);
      if (grid[r][c]) line.push(grid[r][c]);
    }

    let targetPos = 0;
    for (let k = 0; k < line.length; k++) {
      const a = line[k];
      const b = line[k + 1];
      const [row, col] = coordFor(i, targetPos);

      if (b && a.value === b.value) {
        moved = true;
        const val = a.value * 2;
        gained += val;

        nextTiles.push({ ...a, row, col, dying: true, isNew: false, isMerged: false });
        nextTiles.push({ ...b, row, col, dying: true, isNew: false, isMerged: false });
        nextTiles.push({ id: nextIdRef.current++, value: val, row, col, isMerged: true, isNew: false });
        k++;
        targetPos++;
      } else {
        if (a.row !== row || a.col !== col) moved = true;
        nextTiles.push({ ...a, row, col, isNew: false, isMerged: false });
        targetPos++;
      }
    }
  }

  return { nextTiles, moved, gained };
}

function canMoveTiles(tiles) {
  const active = tiles.filter((t) => !t.dying);
  if (active.length < SIZE * SIZE) return true;
  const g = makeGridFromTiles(active);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = g[r][c]?.value;
      if (!v) return true;
      if (r + 1 < SIZE && g[r + 1][c]?.value === v) return true;
      if (c + 1 < SIZE && g[r][c + 1]?.value === v) return true;
    }
  }
  return false;
}

function has2048Tile(tiles) {
  return tiles.some((t) => !t.dying && t.value >= 2048);
}

export default function Game2048({ signedIn, serverBest, onSignIn, onSaveScore }) {
  const nextIdRef = useRef(1);
  const [tiles, setTiles] = useState([]);
  const tilesRef = useRef(tiles);
  tilesRef.current = tiles;

  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [localBest, setLocalBest] = useState(0);
  const [wonAck, setWonAck] = useState(false);
  const [over, setOver] = useState(false);
  const [finishedManually, setFinishedManually] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const touchStart = useRef(null);
  const pointerStart = useRef(null);
  const boardRef = useRef(null);
  const lastSavedRef = useRef(0);
  const cleanupTimerRef = useRef(null);

  const best = Math.max(localBest, serverBest || 0);

  useEffect(() => {
    if (serverBest > localBest) setLocalBest(serverBest);
    if (serverBest > lastSavedRef.current) lastSavedRef.current = serverBest;
  }, [serverBest, localBest]);

  const persistScore = useCallback(async (val, reason = 'saved') => {
    if (!signedIn || val <= 0) return;
    if (val <= lastSavedRef.current) {
      setSavedMsg(`Best record kept: ${lastSavedRef.current.toLocaleString('en-US')}`);
      return;
    }
    setSaving(true);
    try {
      const res = await onSaveScore(val);
      if (res?.saved) {
        lastSavedRef.current = res.bestScore;
        setSavedMsg(`Saved record: ${res.bestScore.toLocaleString('en-US')}`);
      } else if (reason === 'manual') {
        setSavedMsg(`Score ${val.toLocaleString('en-US')} checked — best is ${lastSavedRef.current.toLocaleString('en-US')}`);
      } else {
        setSavedMsg('Score checked — best record kept!');
      }
    } catch {
      /* ignore silent sync errors */
    } finally {
      setSaving(false);
    }
  }, [signedIn, onSaveScore]);

  // Auto-save when game ends naturally (Game Over)
  useEffect(() => {
    if (!over || finishedManually || !signedIn || score <= 0) return;
    persistScore(score, 'over');
  }, [over, finishedManually, score, signedIn, persistScore]);

  // Keep latest run snapshot so navigating away / closing saves the score automatically
  const exitSaveRef = useRef({ started: false, over: false, score: 0, signedIn: false, onSaveScore: null });
  exitSaveRef.current = { started, over, score, signedIn, onSaveScore };

  useEffect(() => {
    const flushOnLeave = () => {
      const cur = exitSaveRef.current;
      if (cur.started && !cur.over && cur.signedIn && cur.score > lastSavedRef.current && cur.onSaveScore) {
        lastSavedRef.current = cur.score;
        cur.onSaveScore(cur.score).catch(() => {});
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushOnLeave();
    };
    window.addEventListener('pagehide', flushOnLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flushOnLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      flushOnLeave();
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  const startGame = () => {
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    const fresh = createInitialTiles(nextIdRef);
    tilesRef.current = fresh;
    setTiles(fresh);
    setScore(0);
    setOver(false);
    setFinishedManually(false);
    setWonAck(false);
    setSavedMsg('');
    setStarted(true);
  };

  const finishAndSave = async () => {
    if (!started || over) return;
    setFinishedManually(true);
    setOver(true);
    if (signedIn && score > 0) {
      await persistScore(score, 'manual');
    } else if (!signedIn) {
      setSavedMsg('Sign in to save your score!');
    }
  };

  const step = useCallback((dir) => {
    if (!started || over) return;

    const { nextTiles, moved, gained } = moveTiles(tilesRef.current, dir, nextIdRef);
    if (!moved) return;

    const withSpawn = spawnTile(nextTiles, nextIdRef);
    const isNowOver = !canMoveTiles(withSpawn);

    tilesRef.current = withSpawn;
    setTiles(withSpawn);

    if (gained > 0) {
      setScore((s) => {
        const ns = s + gained;
        setLocalBest((b) => Math.max(b, ns));
        return ns;
      });
    }
    if (isNowOver) setOver(true);

    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = setTimeout(() => {
      setTiles((cur) => cur.filter((t) => !t.dying));
    }, 145);
  }, [started, over]);

  // Keyboard controls
  useEffect(() => {
    const map = {
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right',
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
    };
    const onKey = (e) => {
      if (!started || over) return;
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      step(dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, over, step]);

  // Reliable non-passive touch swipe on the board
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const triggerSwipe = (dx, dy) => {
      if (Math.abs(dx) > Math.abs(dy)) step(dx > 0 ? 'right' : 'left');
      else step(dy > 0 ? 'down' : 'up');
    };

    const onTouchStart = (e) => {
      if (!started || over || e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, handled: false };
    };

    const onTouchMove = (e) => {
      if (!started || over || !touchStart.current || e.touches.length !== 1) return;
      if (e.cancelable) e.preventDefault();
      if (touchStart.current.handled) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) >= 20) {
        touchStart.current.handled = true;
        triggerSwipe(dx, dy);
      }
    };

    const onTouchEnd = (e) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      if (!touchStart.current.handled && t) {
        const dx = t.clientX - touchStart.current.x;
        const dy = t.clientY - touchStart.current.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) >= 16) {
          triggerSwipe(dx, dy);
        }
      }
      touchStart.current = null;
    };

    const onTouchCancel = () => {
      touchStart.current = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchCancel, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [started, over, step]);

  // Mouse / stylus drag fallback
  const onPointerDown = (e) => {
    if (!started || over || e.pointerType === 'touch') return;
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    if (e.pointerType === 'touch' || !pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) step(dx > 0 ? 'right' : 'left');
    else step(dy > 0 ? 'down' : 'up');
  };

  const won = started && !wonAck && has2048Tile(tiles);
  const mascot = over ? SPRITES.play2048_2 : won ? SPRITES.play2048_3 : score > 200 ? SPRITES.play2048_3 : SPRITES.play2048_1;

  return (
    <div className="box shadow-b8 overflow-hidden max-w-md w-full mx-auto select-none">
      {/* Top Neo-Brutalist bar */}
      <div className="bg-ink text-white px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img src={mascot.src} alt="" draggable={false} className="w-8 h-8 object-contain shrink-0 mascot-breathe" />
          <div className="min-w-0">
            <div className="font-mono text-xs sm:text-sm font-extrabold uppercase text-sun leading-none">RATTIE 2048</div>
            <div className="font-mono text-[10px] text-white/75 truncate">Swipe · Arrow keys · WASD</div>
          </div>
        </div>
        {!signedIn && (
          <button type="button" onClick={onSignIn} className="tag bg-[#B89CFF] text-ink shrink-0">Sign in</button>
        )}
      </div>

      <div className="p-3.5 sm:p-5 bg-white flex flex-col gap-3">
        {/* Score & My Best row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="border-[3px] border-ink rounded-xl bg-ink text-white px-3 py-2 text-center shadow-b2">
            <div className="font-mono text-[10px] font-extrabold uppercase text-white/80">Current score</div>
            <div className="font-mono text-xl sm:text-2xl font-extrabold leading-tight tabular-nums text-white">{score.toLocaleString('en-US')}</div>
          </div>
          <div className="border-[3px] border-ink rounded-xl bg-[#B89CFF] text-ink px-3 py-2 text-center shadow-b2">
            <div className="font-mono text-[10px] font-extrabold uppercase">My best</div>
            <div className="font-mono text-xl sm:text-2xl font-extrabold leading-tight tabular-nums">{best.toLocaleString('en-US')}</div>
          </div>
        </div>

        {/* Action controls above the board */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!started ? (
            <button type="button" onClick={startGame} className="btn bg-[#B89CFF] text-ink text-xs sm:text-sm w-full">
              ▶ Start game
            </button>
          ) : (
            <>
              {!over ? (
                <button
                  type="button"
                  onClick={finishAndSave}
                  disabled={saving}
                  className="btn bg-hot text-white text-xs !px-3 !py-2 flex-1 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : '✓ Finish & save'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startGame}
                  className="btn bg-[#B89CFF] text-ink text-xs !px-3 !py-2 flex-1"
                >
                  ▶ Play again
                </button>
              )}
              <button type="button" onClick={startGame} className="btn bg-white text-ink text-xs !px-3 !py-2">
                ↻ Restart
              </button>
            </>
          )}
        </div>

        {(savedMsg || saving) && (
          <div className="border-2 border-ink rounded-xl bg-paper px-3 py-1.5 font-mono text-[11px] font-bold text-center">
            {saving ? 'Saving your score…' : savedMsg}
          </div>
        )}

        {/* 4x4 Sliding Board — exact 25% × 25% slots so tiles never clip or fall outside */}
        <div className="border-[3px] border-ink rounded-2xl bg-[#E6E1D3] p-1.5 sm:p-2 shadow-b4">
          <div
            ref={boardRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            style={{ touchAction: 'none' }}
            className="relative w-full aspect-square overflow-hidden rounded-xl touch-none overscroll-none select-none"
          >
            {/* Background static 4x4 grid */}
            <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
              {Array.from({ length: SIZE * SIZE }).map((_, idx) => (
                <div key={idx} className="p-1">
                  <div className="w-full h-full rounded-xl bg-[#F7F5EE] border-2 border-ink/25" />
                </div>
              ))}
            </div>

            {/* Animated sliding tiles layer */}
            <div className="absolute inset-0 pointer-events-none">
              {tiles.map((tile) => (
                <div
                  key={tile.id}
                  style={{
                    width: '25%',
                    height: '25%',
                    transform: `translate3d(${tile.col * 100}%, ${tile.row * 100}%, 0)`,
                    transition: 'transform 130ms cubic-bezier(0.22, 1, 0.36, 1)',
                    zIndex: tile.dying ? 10 : tile.isMerged ? 30 : 20,
                  }}
                  className="absolute left-0 top-0 p-1"
                >
                  <div
                    className={`w-full h-full rounded-xl border-2 border-ink flex items-center justify-center font-extrabold shadow-[2px_2px_0_#111] ${tileCls(tile.value)} ${tileFont(tile.value)} ${tile.isNew ? 'tile-pop' : tile.isMerged ? 'tile-merge' : ''}`}
                  >
                    {tile.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Start game overlay before first run */}
            {!started && (
              <div className="absolute inset-0 z-40 bg-ink/60 backdrop-blur-[1px] flex items-center justify-center p-4">
                <div className="bg-white border-[3px] border-ink rounded-2xl shadow-b6 p-5 text-center max-w-[260px] w-full flex flex-col items-center gap-3">
                  <img src={SPRITES.play2048_1.src} alt="" draggable={false} className="w-16 h-16 object-contain mascot-breathe" />
                  <div>
                    <h3 className="text-xl font-extrabold uppercase leading-tight">Ready to play?</h3>
                    <p className="font-mono text-[11px] text-mute mt-1">
                      Merge tiles up to 2048. Your best result saves when you finish or leave!
                    </p>
                  </div>
                  <button type="button" onClick={startGame} className="btn bg-[#B89CFF] text-ink text-sm w-full">
                    ▶ Start game
                  </button>
                </div>
              </div>
            )}

            {/* Game over / Finished / 2048 overlay */}
            {started && (over || won) && (
              <div className="absolute inset-0 z-40 bg-ink/75 flex items-center justify-center p-4">
                <div className="bg-white border-4 border-ink rounded-2xl shadow-b6 p-5 text-center max-w-xs w-full flex flex-col gap-3">
                  <div className="text-3xl">{won ? '🏆' : finishedManually ? '✅' : '🐭'}</div>
                  <h3 className="text-2xl font-extrabold uppercase">
                    {won ? 'You reached 2048!' : finishedManually ? 'Run finished!' : 'Game over!'}
                  </h3>
                  <p className="font-mono text-sm font-bold">Score: {score.toLocaleString('en-US')}</p>
                  {signedIn && (
                    <p className="font-mono text-xs text-mute">
                      {saving ? 'Saving to leaderboard…' : savedMsg || 'Score checked!'}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-2">
                    {won && (
                      <button type="button" onClick={() => setWonAck(true)} className="btn bg-[#B89CFF] text-ink text-xs">
                        Keep playing
                      </button>
                    )}
                    <button type="button" onClick={startGame} className="btn bg-[#B89CFF] text-ink text-xs">
                      ▶ Play again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
