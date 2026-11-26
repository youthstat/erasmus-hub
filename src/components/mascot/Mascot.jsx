import { useEffect, useReducer, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { SPRITES } from './sprites.js';
import { countWords, pts } from '../../firebase/services.js';
import { GOSSIP_POINTS, GOSSIP_MIN_WORDS, MAX_GOSSIP_LENGTH } from '../../config/settings.js';
import { fileToCover } from '../../utils/image.js';
import { countryOf } from '../../hooks/useGame.js';
import { formatScore } from '../../utils/format.js';

/*
  Rattie Patty lives ON the page. She climbs onto the blocks (boxes, cards), sits and sleeps on them,
  nibbles a corner, hides behind a block (only her head sticks out above its edge) and peeks in from the
  screen edge. From time to time she says "Don't click me!" (of course, everybody clicks).

  Depending on the page she wears a matching outfit/props:
  - /punishment      -> guilty sign
  - /secret-friend*  -> gift box
  - /killer-game     -> mafia suit & fedora
  - /oscar*          -> golden Oscar statuette
  And inside her talk panel she offers 3 deals: Gossip (+1 pt), Gift points (to someone from your own stash),
  or Steal points (complete an admin heist task + attach photo proof -> sent for admin approval).
*/
const S = 0.38;                                  // sprite scale (small mouse)
const BOX_W = 54, BOX_H = 50, EDGE_W = 30;       // fixed box she lives in, so the position does not jump between poses
const RUN = ['run1', 'jump', 'run2', 'jump'];
const WARNING = "Don't click me! 🙈";

const JOKES_GENERAL = [
  'Why did the mouse bring a ladder to the snack table? Because the cheese was on a higher tier! 🧀',
  'Careful — I have tiny paws, big ears, and zero impulse control. 👂✨',
];

const JOKES_PAGE = {
  punishment: [
    'Who, me? Guilty of eating all the festival cookies? Never! 🍪👀',
    'Look at this sign… I promise I was framed by a very suspicious pigeon! 🪧🐭',
  ],
  gift: [
    'Secret Friend mode activated! My wrapping skills are 90% tape and 10% luck. 🎁',
    'I hid a gift so well once even I forgot where it was. Happy hunting! 🎀',
  ],
  mafia: [
    'Keep your friends close, and your Secret Weapon closer… capiche? 🕶️🎩',
    'Don’t worry, I’m a certified mouse-fioso. Zero violence, 100% drama! 🕵️',
  ],
  oscar: [
    'And the Oscar for Best Dramatic Cheese-Eating goes to… ME! 🏆✨',
    'I’m ready for my close-up! Just don’t film my tail, it gets stage fright. 🎬',
  ],
  schedule: [
    'Tick-tock! ⌚ Checking my tiny watch so we don’t miss the next session!',
    'Am I early or fashionably late? Let’s check the timeline! ⏰🐭',
  ],
  game2048: [
    'Just one more swipe… I’m SO close to the 2048 tile! 🎮✨',
    'My paws are warmed up and ready to beat the leaderboard! ⌨️🐭',
  ],
  gossip: [
    'I want more gossip! Tell me everything — my notebook is ready! 📝🤫',
    'Ooh, juicy whispers! Keep ’em coming, nobody will ever know it was you! 💋',
  ],
  reflect: [
    'Taking a quiet moment to reflect on today’s memories… 🌱🪞',
    'Mirror, mirror on the wall, who had the best Erasmus+ day of all? ✨',
  ],
};

const JOKES_THANKS_GOSSIP = [
  'Mmm, delicious! 😻 My ears just grew 2 cm. Got another one?',
  'Ooh, juicy! 🤭 If gossip were cheese, I’d be a billionaire mouse!',
  'Wow, plot twist! 👀 Keep ’em coming — something fresh!',
];

const JOKES_DEAL_GIFT = [
  'My lips are sealed tighter than a cheese vault! 🧀🔒',
  'Delivered like a stealth ninja in tiny slippers! 🎁💨',
  'So generous! Don’t worry, I erased my footprints from the leaderboard. 🐾',
];

const JOKES_DEAL_STEAL = [
  'Heist logged! Remember: if anyone asks, you were just admiring the wallpaper. 🕶️',
  'Smooth operation, partner! Now act natural and eat a snack. 🍿🕵️',
  'Mission proof sent to the bosses! Even Sherlock Holmes wouldn’t suspect a mouse. 🐭💼',
];

const SEL = '.box, [class*="border-[3px]"][class*="rounded-xl"]';

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const vwidth = () => document.documentElement.clientWidth;

function themeForPath(pathname) {
  if (pathname.startsWith('/punishment')) {
    return {
      key: 'punishment',
      sit: ['guilty1', 'guilty2', 'guilty3', 'guilty4'],
      peek: ['guilty1', 'guilty3'],
      edge: 'guilty2',
      hello: 'guilty1',
    };
  }
  if (pathname.startsWith('/secret-friend')) {
    return {
      key: 'gift',
      sit: ['gift1', 'gift2', 'gift3', 'gift4'],
      peek: ['gift2', 'gift4'],
      edge: 'gift2',
      hello: 'gift3',
    };
  }
  if (pathname.startsWith('/killer-game')) {
    return {
      key: 'mafia',
      sit: ['mafia1', 'mafia2', 'mafia3', 'mafia4'],
      peek: ['mafia2', 'mafia3'],
      edge: 'mafia3',
      hello: 'mafia2',
    };
  }
  if (pathname.startsWith('/oscar')) {
    return {
      key: 'oscar',
      sit: ['oscar1', 'oscar2', 'oscar3', 'oscar4'],
      peek: ['oscar1', 'oscar2'],
      edge: 'oscar2',
      hello: 'oscar3',
    };
  }
  if (pathname.startsWith('/schedule')) {
    return {
      key: 'schedule',
      sit: ['watch1', 'watch2', 'watch3', 'watch4'],
      peek: ['watch3', 'watch4'],
      edge: 'watch2',
      hello: 'watch1',
    };
  }
  if (pathname.startsWith('/mouse-run')) {
    return {
      key: 'game2048',
      sit: ['play2048_1', 'play2048_2', 'play2048_3', 'play2048_4'],
      peek: ['play2048_1', 'play2048_3'],
      edge: 'play2048_2',
      hello: 'play2048_3',
    };
  }
  if (pathname.startsWith('/gossips')) {
    return {
      key: 'gossip',
      sit: ['gossip1', 'gossip2', 'gossip3', 'gossip4'],
      peek: ['gossip2', 'gossip4'],
      edge: 'gossip2',
      hello: 'gossip2',
    };
  }
  if (pathname.startsWith('/reflection')) {
    return {
      key: 'reflect',
      sit: ['reflect1', 'reflect2', 'reflect3', 'reflect4'],
      peek: ['reflect1', 'reflect2'],
      edge: 'reflect2',
      hello: 'reflect4',
    };
  }
  return {
    key: 'default',
    sit: ['idle', 'side', 'sit2', 'sit3', 'think'],
    peek: ['alert', 'idle'],
    edge: 'alert',
    hello: 'hello',
  };
}

// blocks whose top edge is currently on screen
const visibleBlocks = () => [...document.querySelectorAll(SEL)].filter((el) => {
  if (el.closest('.fixed')) return false;       // modals / the talk panel
  const r = el.getBoundingClientRect();
  return r.width > 150 && r.height > 50 && r.top > 70 && r.top < innerHeight - 40;
});

// where (document coordinates) the box of a scene is
function place(sc) {
  if (!sc) return null;
  const sx = window.scrollX, sy = window.scrollY;
  if (sc.kind === 'edge') return { left: sx + (sc.side === 'l' ? 0 : vwidth() - EDGE_W), top: sc.y, cw: EDGE_W };
  if (!sc.el?.isConnected) return null;
  const r = sc.el.getBoundingClientRect();
  return { left: r.left + sx + sc.dx, top: r.top + sy + 3 - BOX_H, cw: BOX_W };
}

function build(act, el, theme) {
  const r = el.getBoundingClientRect();
  const minDx = Math.max(4, 4 - r.left);
  const maxDx = Math.max(minDx, Math.min(r.width - BOX_W - 4, vwidth() - r.left - BOX_W - 4));
  const dx = rand(minDx, maxDx);
  const base = { kind: 'stand', act, el, dx, dive: 0, flip: pick([1, -1]) };
  switch (act) {
    case 'sleep':
      return theme.key === 'default'
        ? { ...base, pose: 'sleep', extra: 'zzz' }
        : { ...base, pose: pick(theme.sit), extra: 'zzz' };
    case 'gnaw':
      return {
        ...base,
        pose: theme.key === 'default' ? 'idle' : theme.sit[0],
        extra: 'gnaw',
        flip: 1,
        dx: clamp(r.width - BOX_W + 2, minDx, vwidth() - r.left - BOX_W - 2),
      };
    case 'peek':
      return { ...base, pose: pick(theme.peek), dive: 0.45 };
    case 'edge': {
      const side = pick(['l', 'r']);
      return { kind: 'edge', act, side, y: window.scrollY + rand(110, Math.max(130, innerHeight - 150)), pose: theme.edge, dive: 0, flip: side === 'l' ? 1 : -1 };
    }
    default:
      return { ...base, pose: pick(theme.sit) };
  }
}

export default function Mascot() {
  const {
    users,
    profile,
    heistTasks,
    sendGossip,
    giftPoints,
    submitStealRequest,
    openAccount,
  } = useApp();
  const { pathname } = useLocation();
  const theme = themeForPath(pathname);

  const [scene, setScene] = useState(null);
  const [frame, setFrame] = useState(0);
  const [open, setOpen] = useState(false);
  // login | hello | write | gift | steal-task | steal-form | deal-done
  const [phase, setPhase] = useState('hello');
  const [joke, setJoke] = useState('');

  // Gossip state
  const [text, setText] = useState('');
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(0);
  const [happy, setHappy] = useState(false);

  // Gift state
  const [targetFilter, setTargetFilter] = useState('');
  const [giftTargetId, setGiftTargetId] = useState('');
  const [giftAmount, setGiftAmount] = useState('10');
  const [giftComment, setGiftComment] = useState('');

  // Steal state
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [stealPhoto, setStealPhoto] = useState('');
  const [stealDesc, setStealDesc] = useState('');
  const [stealComment, setStealComment] = useState('');
  const [stealVictimId, setStealVictimId] = useState('');
  const [stealAmount, setStealAmount] = useState('10');

  // Deal completion state
  const [dealDoneInfo, setDealDoneInfo] = useState(null); // { kind: 'gift' | 'steal', targetName, joke }

  const [, relayout] = useReducer((n) => n + 1, 0);
  const ref = useRef(null);
  const show = (sc) => { ref.current = sc; setScene(sc); };

  // blocks move when the window is resized or content loads -> re-read their positions
  useEffect(() => {
    window.addEventListener('resize', relayout);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(relayout) : null;
    ro?.observe(document.body);
    return () => { window.removeEventListener('resize', relayout); ro?.disconnect(); };
  }, []);

  // running frames
  useEffect(() => {
    if (!scene?.walking) return;
    const i = setInterval(() => setFrame((f) => f + 1), 120);
    return () => clearInterval(i);
  }, [scene?.walking]);

  // the life of the mouse
  useEffect(() => {
    if (open) return;
    let dead = false;
    show(null);
    const wait = (ms) => new Promise((res) => setTimeout(() => res(!dead), ms));
    const patch = (o) => { if (ref.current) show({ ...ref.current, ...o }); };
    const pageTheme = themeForPath(pathname);

    // hide behind the current block, reappear (rise) at the next place
    const reveal = async (next) => {
      if (ref.current) { patch({ dive: 1, walking: false, say: null, extra: null }); if (!(await wait(500))) return false; }
      show({ ...next, dive: 1, instant: true });
      if (!(await wait(80))) return false;
      show({ ...next, instant: false });
      return wait(550);
    };
    // run over the blocks to the next place
    const walk = async (next) => {
      const a = place(ref.current), b = place(next);
      const ms = clamp(350 + Math.hypot(b.left - a.left, b.top - a.top) * 3, 500, 2200);
      const flip = b.left >= a.left ? 1 : -1;
      show({ ...next, dive: 0, walking: true, flip, ms, extra: null, pose: 'run1' });
      if (!(await wait(ms))) return false;
      show({ ...next, flip: next.act === 'gnaw' ? 1 : flip, walking: false });
      return true;
    };
    const gossip = async (ms) => {
      if (!(await wait(900))) return false;
      patch({ say: WARNING });
      if (!(await wait(2600))) return false;
      patch({ say: null });
      return wait(ms);
    };

    (async () => {
      if (!(await wait(1500))) return;
      if (reduced()) { const l = visibleBlocks(); if (l[0]) show(build('sit', l[0], pageTheme)); return; }
      while (!dead) {
        const list = visibleBlocks();
        if (!list.length) { if (!(await wait(2500))) return; continue; }
        const others = list.filter((b) => b !== ref.current?.el);
        const act = pick(['sit', 'sit', 'sleep', 'gnaw', 'peek', 'peek', 'edge']);
        const next = build(act, pick(others.length ? others : list), pageTheme);
        const cur = ref.current;
        const smooth = cur && place(cur) && cur.kind === 'stand' && cur.dive === 0 && next.kind === 'stand' && next.dive === 0;
        if (!(await (smooth ? walk(next) : reveal(next)))) return;

        let ok = true;
        if (act === 'sleep') ok = await wait(rand(7000, 10000));
        else if (act === 'gnaw') ok = await wait(rand(5000, 7000));
        else if (Math.random() < 0.5) ok = await gossip(800);
        else ok = await wait(rand(3500, 5500));
        if (!ok) return;
      }
    })();
    return () => { dead = true; };
  }, [open, pathname]);

  const resetForms = () => {
    setText('');
    setNote(null);
    setHappy(false);
    setSent(0);
    setTargetFilter('');
    setGiftTargetId('');
    setGiftAmount('10');
    setGiftComment('');
    setSelectedTaskId(heistTasks[0]?.id || '');
    setStealPhoto('');
    setStealDesc('');
    setStealComment('');
    setStealVictimId('');
    setStealAmount('10');
    setDealDoneInfo(null);
  };

  const onClick = () => {
    resetForms();
    const pool = JOKES_PAGE[theme.key] ? [...JOKES_PAGE[theme.key], ...JOKES_GENERAL] : JOKES_GENERAL;
    setJoke(pick(pool));
    setPhase(profile ? 'hello' : 'login');
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setPhase('hello');
    resetForms();
  };

  const others = users
    .filter((u) => u.id !== profile?.id && (!u.isDemo || profile?.isDemo))
    .filter((u) => !targetFilter.trim() || u.name.toLowerCase().includes(targetFilter.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const submitGossip = async () => {
    if (busy) return;
    if (countWords(text) < GOSSIP_MIN_WORDS) {
      return setNote({ kind: 'warn', text: `Hmm, that’s too short! Tell me more than ${GOSSIP_MIN_WORDS - 1} words and I’ll pay you ${pts(GOSSIP_POINTS)}.` });
    }
    setBusy(true);
    try {
      await sendGossip(text, false);
      setText(''); setSent((n) => n + 1); setHappy(true);
      setNote({ kind: 'ok', text: JOKES_THANKS_GOSSIP[sent % JOKES_THANKS_GOSSIP.length] });
      setTimeout(() => setHappy(false), 2600);
    } catch (e) {
      if (e.code === 'duplicate') setNote({ kind: 'warn', text: 'I already know this one! 😼 Tell me something new.' });
      else if (e.code === 'short') setNote({ kind: 'warn', text: 'Tell me a bit more!' });
      else setNote({ kind: 'err', text: e.message || 'Something went wrong.' });
    } finally { setBusy(false); }
  };

  const submitGift = async (e) => {
    e.preventDefault();
    if (busy) return;
    setNote(null);
    const amt = Math.floor(Number(giftAmount));
    const rawScore = Number(profile?.score);
    const myScore = Number.isFinite(rawScore) ? rawScore : 0;
    if (!giftTargetId) return setNote({ kind: 'warn', text: 'Pick someone to gift points to first!' });
    if (!Number.isFinite(amt) || amt <= 0) return setNote({ kind: 'warn', text: 'Enter at least 1 point to gift.' });
    if (myScore <= 0 || amt > myScore) return setNote({ kind: 'warn', text: `You only have ${formatScore(profile?.score)} PTS! Can’t gift more than you’ve got.` });

    const recipient = users.find((u) => u.id === giftTargetId);
    setBusy(true);
    try {
      await giftPoints(giftTargetId, amt, giftComment);
      setDealDoneInfo({ kind: 'gift', targetName: recipient?.name || 'them', joke: pick(JOKES_DEAL_GIFT) });
      setPhase('deal-done');
    } catch (err) {
      setNote({ kind: 'err', text: err.message || 'Could not send gift.' });
    } finally {
      setBusy(false);
    }
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNote(null);
    try {
      const dataUrl = await fileToCover(file, 640);
      setStealPhoto(dataUrl);
    } catch (err) {
      setNote({ kind: 'err', text: err.message });
    }
  };

  const submitSteal = async (e) => {
    e.preventDefault();
    if (busy) return;
    setNote(null);
    const task = heistTasks.find((t) => t.id === selectedTaskId) || heistTasks[0];
    const victim = users.find((u) => u.id === stealVictimId);
    const amt = Math.floor(Number(stealAmount));
    if (!task) return setNote({ kind: 'warn', text: 'No active heist task selected.' });
    if (!stealPhoto) return setNote({ kind: 'warn', text: 'Attach a photo showing you completed the task!' });
    if (stealDesc.trim().length < 5) return setNote({ kind: 'warn', text: 'Write a short description of what you did (at least 5 characters).' });
    if (!victim) return setNote({ kind: 'warn', text: 'Choose who you want to steal points from!' });
    const rawVictimScore = Number(victim.score);
    const victimScore = Number.isFinite(rawVictimScore) ? rawVictimScore : 0;
    if (victimScore <= 0) return setNote({ kind: 'warn', text: `${victim.name} has ${formatScore(victim.score)} PTS — nothing to steal!` });
    if (!Number.isFinite(amt) || amt <= 0 || amt > victimScore) {
      return setNote({ kind: 'warn', text: `Choose between 1 and ${victimScore} PTS.` });
    }

    setBusy(true);
    try {
      await submitStealRequest({
        victimId: victim.id,
        victimName: victim.name,
        amount: amt,
        taskId: task.id,
        taskTitle: task.title,
        description: stealDesc,
        comment: stealComment,
        photo: stealPhoto,
      });
      setDealDoneInfo({ kind: 'steal', targetName: victim.name, joke: pick(JOKES_DEAL_STEAL) });
      setPhase('deal-done');
    } catch (err) {
      setNote({ kind: 'err', text: err.message || 'Could not submit heist.' });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- talk panel (after a click) ---------- */
  if (open) {
    const wide = phase === 'write' || phase === 'gift' || phase === 'steal-task' || phase === 'steal-form' || phase === 'deal-done';
    let pose = theme.hello;
    if (phase === 'login') pose = theme.key === 'default' ? 'love' : theme.hello;
    else if (phase === 'write') pose = happy ? 'thanks' : text.trim() ? 'secret' : 'wait';
    else if (phase === 'gift') pose = giftTargetId ? 'gift2' : 'gift1';
    else if (phase === 'steal-task') pose = 'thief3';
    else if (phase === 'steal-form') pose = stealPhoto ? 'thief1' : 'thief4';
    else if (phase === 'deal-done') pose = dealDoneInfo?.kind === 'gift' ? 'gift3' : 'thief2';

    const s = SPRITES[pose] || SPRITES.hello;
    const words = countWords(text);
    const rawMyScore = Number(profile?.score);
    const myScore = Number.isFinite(rawMyScore) ? rawMyScore : 0;
    const myScoreText = formatScore(profile?.score);
    const selectedTask = heistTasks.find((t) => t.id === selectedTaskId) || heistTasks[0] || null;
    const stealVictim = users.find((u) => u.id === stealVictimId) || null;
    const rawVictimScore = Number(stealVictim?.score);
    const stealVictimScore = Number.isFinite(rawVictimScore) ? rawVictimScore : 0;
    const giftTarget = users.find((u) => u.id === giftTargetId) || null;

    const panelBadge = (() => {
      if (phase === 'write') return '🔒 Anonymous';
      if (phase === 'gift') return `🎁 Gift · You: ${myScoreText} PTS`;
      if (phase === 'steal-task' || phase === 'steal-form') return '🕵️ Heist';
      if (phase === 'deal-done') return '🤝 Deal Closed';
      return null;
    })();

    return (
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4"
        onClick={close}
      >
        <div
          aria-labelledby="rattie-modal-title"
          aria-modal="true"
          role="dialog"
          className={`mascot-pop relative w-full ${wide ? 'max-w-[400px]' : 'max-w-[348px]'} bg-white border-4 border-ink rounded-[20px] shadow-[8px_8px_0_#111] flex flex-col overflow-visible`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Neo-Brutalist Top Window Frame */}
          <header className="bg-[#FFE200] border-b-[3px] border-ink px-4 py-2.5 rounded-t-[16px] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block w-3 h-3 bg-ink shrink-0" />
              <span id="rattie-modal-title" className="font-mono font-black text-sm tracking-wider text-ink uppercase truncate">
                RATTIE PATTY
              </span>
              {panelBadge && (
                <span className="tag bg-white text-ink text-[10px] truncate max-w-[130px]">{panelBadge}</span>
              )}
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="w-7 h-7 shrink-0 bg-[#FF4766] border-2 border-ink rounded-md flex items-center justify-center text-white font-black text-sm shadow-b2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            >
              ✕
            </button>
          </header>

          {/* Modal Body */}
          <div className="p-4 sm:p-5 pb-7 flex flex-col gap-3.5 text-sm font-bold overflow-y-auto max-h-[76vh]">
            {phase === 'login' && (<>
              <div className="border-2 border-ink rounded-xl p-3.5 bg-white space-y-2">
                <h2 className="text-[19px] leading-tight font-extrabold text-ink flex items-center gap-1.5">
                  Hi, I’m Rattie Patty! <span className="text-hot">❤</span>
                </h2>
                {joke && (
                  <div className="bg-[#ECEBE4] border-2 border-ink rounded-xl p-3 shadow-inner">
                    <p className="font-sans font-bold italic text-[13px] leading-snug text-ink">“{joke}”</p>
                  </div>
                )}
                <p className="font-medium text-xs leading-snug">
                  Sign in or register — then we can gossip, gift points, or pull off a cheeky heist!
                </p>
              </div>
              <button className="btn bg-neon text-ink text-xs w-full" onClick={() => { close(); openAccount(null); }}>
                Register / Sign in
              </button>
            </>)}

            {phase === 'hello' && (<>
              <div className="border-2 border-ink rounded-xl p-3 bg-white space-y-1.5">
                <h2 className="text-lg leading-tight font-extrabold text-ink tracking-tight flex items-center gap-1.5">
                  Hi, I’m Rattie Patty! <span className="text-hot">❤</span>
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-bold text-ink">
                  <span>Nice to see you, <b className="break-words">{profile?.name}</b>! You have</span>
                  <span className="inline-block bg-[#FFE200] border-2 border-ink font-mono font-black text-xs px-2 py-0.5 rounded shadow-[1.5px_1.5px_0_#111]">
                    {myScoreText} PTS
                  </span>
                </div>
              </div>

              <div className="pt-0.5">
                <h3 className="font-mono font-black text-[11px] tracking-widest text-[#4B4B4B] uppercase">
                  PICK YOUR DEAL:
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="btn w-full bg-neon text-ink !px-3 !py-2 justify-between rounded-xl whitespace-nowrap"
                  onClick={() => { setNote(null); setPhase('write'); }}
                >
                  <span className="font-mono font-black text-xs tracking-wide uppercase">Tell a gossip</span>
                  <span className="bg-white border-2 border-ink rounded-md px-2 py-0.5 font-mono font-black text-[11px] text-ink shadow-[1px_1px_0_#111] shrink-0">
                    +{GOSSIP_POINTS} {GOSSIP_POINTS === 1 ? 'PT' : 'PTS'}
                  </span>
                </button>

                <button
                  type="button"
                  className="btn w-full bg-[#FFE600] text-ink !px-3 !py-2 justify-between rounded-xl whitespace-nowrap"
                  onClick={() => { setNote(null); setTargetFilter(''); setPhase('gift'); }}
                >
                  <span className="font-mono font-black text-xs tracking-wide uppercase">Gift points</span>
                  <span className="bg-white border-2 border-ink rounded-md px-2 py-0.5 font-mono font-black text-[11px] text-ink shadow-[1px_1px_0_#111] shrink-0">
                    SECRET
                  </span>
                </button>

                <button
                  type="button"
                  className="btn w-full bg-[#FF4B72] text-white !px-3 !py-2 justify-between rounded-xl whitespace-nowrap"
                  onClick={() => { setNote(null); setSelectedTaskId(heistTasks[0]?.id || ''); setPhase('steal-task'); }}
                >
                  <span className="font-mono font-black text-xs tracking-wide uppercase">Steal points</span>
                  <span className="bg-ink border-2 border-ink rounded-md px-2 py-0.5 font-mono font-black text-[11px] text-white shadow-[1px_1px_0_#111] shrink-0">
                    HEIST
                  </span>
                </button>
              </div>
            </>)}

            {phase === 'write' && (<>
              <button type="button" onClick={() => { setNote(null); setPhase('hello'); }} className="self-start font-mono text-xs underline text-mute">
                ← Back to deals
              </button>
              <div className="bg-[#ECEBE4] border-2 border-ink rounded-xl px-3 py-2.5 shadow-inner">
                <p className="font-bold text-xs sm:text-sm">
                  {note ? (
                    <span className={note.kind === 'ok' ? 'text-[#15803D]' : note.kind === 'err' ? 'text-hot font-mono text-xs' : 'text-[#c4263f]'}>
                      {note.text}
                    </span>
                  ) : (
                    <>I’m all ears… tell me a juicy gossip for <span className="text-[#c4263f]">{pts(GOSSIP_POINTS)}</span>! 👂</>
                  )}
                </p>
              </div>
              <textarea
                autoFocus
                rows={4}
                maxLength={MAX_GOSSIP_LENGTH}
                value={text}
                disabled={busy}
                onChange={(e) => { setText(e.target.value); if (note?.kind !== 'ok') setNote(null); }}
                onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === 'Enter' && submitGossip()}
                placeholder="Write your gossip here…"
                className="w-full resize-none border-[3px] border-ink rounded-xl px-3 py-2 font-sans text-sm font-medium bg-white shadow-b2 focus:outline-none focus:bg-sun/20"
              />
              <div className="flex items-center justify-between gap-2">
                <span className={`font-mono text-[11px] font-bold ${words >= GOSSIP_MIN_WORDS ? 'text-[#15803D]' : 'text-mute'}`}>
                  {words} {words === 1 ? 'word' : 'words'} · {GOSSIP_MIN_WORDS}+ = {GOSSIP_POINTS} pt
                </span>
                <button className="btn bg-neon text-ink text-xs py-1.5" disabled={busy} onClick={submitGossip}>
                  {busy ? '…' : 'Send anonymously'}
                </button>
              </div>
              <p className="font-mono text-[11px] font-normal text-mute leading-snug">
                🤫 <b className="font-bold text-ink">100% anonymous!</b> Your name is never stored — nobody will ever know who sent it.
              </p>
            </>)}

            {phase === 'gift' && (
              <form onSubmit={submitGift} className="flex flex-col gap-2.5">
                <button type="button" onClick={() => { setNote(null); setPhase('hello'); }} className="self-start font-mono text-xs underline text-mute">
                  ← Back to deals
                </button>
                <div className="bg-[#ECEBE4] border-2 border-ink rounded-xl p-2.5 text-xs font-medium leading-snug shadow-inner">
                  🎁 <b>How gifting works:</b> Pick a participant you want to reward. Your gift arrives anonymously — they will never know it was from you!
                </div>
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>1 · Choose recipient</span>
                  <input
                    type="text"
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    placeholder="Filter by name…"
                    className="border-2 border-ink rounded-lg px-2.5 py-1.5 font-sans text-xs font-medium bg-white"
                  />
                  <select
                    className="border-[3px] border-ink rounded-xl px-2.5 py-2 font-mono text-xs bg-white"
                    value={giftTargetId}
                    onChange={(e) => { setGiftTargetId(e.target.value); setNote(null); }}
                  >
                    <option value="">Select a participant…</option>
                    {others.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}{countryOf(u) ? ` (${countryOf(u)})` : ''}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>2 · Points to gift (you have {myScoreText} PTS)</span>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, myScore)}
                    value={giftAmount}
                    onChange={(e) => { setGiftAmount(e.target.value); setNote(null); }}
                    className="border-[3px] border-ink rounded-xl px-3 py-1.5 font-mono text-sm bg-white"
                  />
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[5, 10, 25, 50].filter((n) => n <= myScore).map((n) => (
                    <button type="button" key={n} onClick={() => setGiftAmount(String(n))} className="tag bg-white hover:bg-sun">+{n}</button>
                  ))}
                </div>
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>3 · Anonymous note (optional)</span>
                  <textarea
                    rows={2}
                    maxLength={200}
                    value={giftComment}
                    onChange={(e) => setGiftComment(e.target.value)}
                    placeholder="Leave a kind message for them (they won’t know it’s you)…"
                    className="w-full resize-none border-[3px] border-ink rounded-xl px-2.5 py-1.5 font-sans text-xs font-medium bg-white"
                  />
                </label>
                {giftTarget && Number(giftAmount) > 0 && Number(giftAmount) <= myScore && (
                  <div className="font-mono text-[11px] text-[#15803D]">
                    Ready to deliver secretly to {giftTarget.name}!
                  </div>
                )}
                {note && <p className="font-mono text-xs text-hot">{note.text}</p>}
                <button type="submit" disabled={busy || myScore <= 0} className="btn bg-neon text-ink text-xs disabled:opacity-50">
                  {busy ? 'Sending…' : myScore <= 0 ? 'Insufficient PTS' : '🎁 Gift points now'}
                </button>
              </form>
            )}

            {phase === 'steal-task' && (<>
              <button type="button" onClick={() => { setNote(null); setPhase('hello'); }} className="self-start font-mono text-xs underline text-mute">
                ← Back to deals
              </button>
              <p className="font-medium text-xs bg-[#ECEBE4] border-2 border-ink rounded-xl px-3 py-2 italic shadow-inner">
                “Psst… want to pull off a heist? First, prove you’ve got what it takes by finishing one of the organizers’ secret tasks!”
              </p>
              {heistTasks.length === 0 ? (
                <div className="border-2 border-ink rounded-xl bg-white p-3 text-xs font-medium shadow-b2">
                  No heist tasks are posted yet! Ask an organizer to add tasks in <b>Admin panel → Rattie Patty: heists</b>.
                </div>
              ) : (
                <>
                  <div className="font-mono text-[11px] uppercase text-mute">Choose a heist task to complete:</div>
                  <div className="flex flex-col gap-2">
                    {heistTasks.map((t) => {
                      const active = (selectedTask?.id === t.id);
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setSelectedTaskId(t.id)}
                          className={`text-left border-[3px] border-ink rounded-xl p-2.5 transition ${active ? 'bg-sun shadow-b2' : 'bg-white'}`}
                        >
                          <div className="font-extrabold uppercase text-xs">{active ? '✓ ' : ''}{t.title}</div>
                          {t.details && <div className="text-xs font-medium mt-0.5 text-[#3b3728]">{t.details}</div>}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" className="btn bg-[#FF4B72] text-white text-xs mt-1" onClick={() => { setNote(null); setPhase('steal-form'); }}>
                    I’ve done this — attach proof →
                  </button>
                </>
              )}
            </>)}

            {phase === 'steal-form' && (
              <form onSubmit={submitSteal} className="flex flex-col gap-2.5">
                <button type="button" onClick={() => { setNote(null); setPhase('steal-task'); }} className="self-start font-mono text-xs underline text-mute">
                  ← Change task
                </button>
                <div className="border-2 border-ink rounded-xl bg-sun px-2.5 py-1.5 text-xs shadow-b2">
                  <b>Task:</b> {selectedTask?.title}
                </div>
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>1 · Photo proof *</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="text-xs font-sans file:mr-2 file:border-2 file:border-ink file:rounded-lg file:bg-sun file:px-2 file:py-1 file:font-mono file:text-[11px] file:font-bold"
                  />
                </label>
                {stealPhoto && (
                  <img src={stealPhoto} alt="Task proof preview" className="w-full h-28 object-cover border-[3px] border-ink rounded-xl" />
                )}
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>2 · What did you do? *</span>
                  <textarea
                    rows={2}
                    maxLength={500}
                    value={stealDesc}
                    onChange={(e) => { setStealDesc(e.target.value); setNote(null); }}
                    placeholder="Describe how you completed the task…"
                    className="w-full resize-none border-[3px] border-ink rounded-xl px-2.5 py-1.5 font-sans text-xs font-medium bg-white"
                  />
                </label>
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>3 · Who do you want to rob? *</span>
                  <input
                    type="text"
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                    placeholder="Filter by name…"
                    className="border-2 border-ink rounded-lg px-2.5 py-1 font-sans text-xs font-medium bg-white"
                  />
                  <select
                    className="border-[3px] border-ink rounded-xl px-2.5 py-1.5 font-mono text-xs bg-white"
                    value={stealVictimId}
                    onChange={(e) => { setStealVictimId(e.target.value); setNote(null); }}
                  >
                    <option value="">Choose target…</option>
                    {others.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} — {formatScore(u.score)} PTS</option>
                    ))}
                  </select>
                </label>
                {stealVictim && (
                  <div className="bg-white border-2 border-ink rounded-lg px-2.5 py-1.5 font-mono text-xs flex justify-between shadow-b2">
                    <span>{stealVictim.name} has:</span>
                    <b>{formatScore(stealVictim.score)} PTS</b>
                  </div>
                )}
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>4 · Points to steal *</span>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, stealVictimScore)}
                    value={stealAmount}
                    onChange={(e) => { setStealAmount(e.target.value); setNote(null); }}
                    className="border-[3px] border-ink rounded-xl px-3 py-1.5 font-mono text-sm bg-white"
                  />
                </label>
                <label className="flex flex-col gap-1 font-mono text-[11px] uppercase">
                  <span>5 · Secret note to target (optional)</span>
                  <input
                    type="text"
                    maxLength={200}
                    value={stealComment}
                    onChange={(e) => setStealComment(e.target.value)}
                    placeholder="Optional anonymous message they see when robbed…"
                    className="border-[3px] border-ink rounded-xl px-2.5 py-1.5 font-sans text-xs font-medium bg-white"
                  />
                </label>
                {note && <p className="font-mono text-xs text-hot">{note.text}</p>}
                <button type="submit" disabled={busy || (!!stealVictim && stealVictimScore <= 0)} className="btn bg-[#FF4B72] text-white text-xs disabled:opacity-50">
                  {busy ? 'Sending…' : '🕵️ Submit for approval'}
                </button>
              </form>
            )}

            {phase === 'deal-done' && (<>
              <div className="tag bg-neon self-start">Deal sealed</div>
              <div className="border-2 border-ink rounded-xl px-3 py-2.5 bg-white space-y-2">
                <p className="text-base font-extrabold uppercase">Thank you for the deal, my friend! — Rattie Patty 🐭🤝</p>
                <p className="font-medium text-xs">
                  {dealDoneInfo?.kind === 'gift'
                    ? `Your secret gift has been delivered anonymously to ${dealDoneInfo.targetName}! Nobody will ever know it was you!`
                    : `Your heist request on ${dealDoneInfo?.targetName || 'them'} has been sent to the organizers for approval. Once approved, they’ll never know who robbed them!`}
                </p>
                <div className="bg-[#ECEBE4] border-2 border-ink rounded-xl p-2.5 shadow-inner">
                  <p className="font-sans font-bold italic text-xs text-ink">“{dealDoneInfo?.joke}”</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button className="btn bg-sun text-ink text-xs flex-1" onClick={() => { resetForms(); setPhase('hello'); }}>Another deal</button>
                <button className="btn bg-white text-ink text-xs flex-1" onClick={close}>Bye, Rattie!</button>
              </div>
            </>)}
          </div>

          {/* User's own Rattie Patty sprite peeking on the corner */}
          <div aria-hidden="true" className="absolute -right-4 -bottom-9 sm:-right-6 sm:-bottom-9 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none z-30">
            {happy && (
              <span key={sent} className="mascot-float absolute left-1/2 -top-3 -translate-x-1/2 border-2 border-ink bg-neon rounded px-2 py-0.5 font-mono font-bold text-sm shadow-b2">
                +{GOSSIP_POINTS}
              </span>
            )}
            <img
              src={s.src}
              alt=""
              draggable={false}
              decoding="async"
              className="w-full h-full object-contain mascot-breathe"
              style={{
                filter: 'drop-shadow(2px 3px 0 rgba(17,17,17,0.85))',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- roaming on the page ---------- */
  const p = place(scene);
  if (!scene || !p) return null;
  const pose = scene.walking ? RUN[frame % RUN.length] : scene.pose;
  const sp = SPRITES[pose] || SPRITES.idle;
  const w = sp.w * S, h = sp.h * S;
  const edge = scene.kind === 'edge';
  const ty = edge ? 0 : scene.dive * BOX_H;
  const tx = !edge ? 0 : scene.side === 'l' ? -(w - EDGE_W) - EDGE_W * scene.dive : EDGE_W * scene.dive;
  const anim = scene.walking ? 'mascot-hop' : scene.extra === 'gnaw' ? 'mascot-nibble' : !edge && (pose === 'idle' || pose === 'alert') && !scene.dive ? 'mascot-breathe' : '';
  const bubbleRight = p.left > vwidth() * 0.55;

  return (
    <div className="absolute left-0 top-0 w-full h-0 z-40 pointer-events-none" style={{ overflowX: 'clip' }}>
      <div role="button" tabIndex={0} title="Don’t click me!" aria-label="Rattie Patty — please don’t click"
        onClick={onClick} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        className="absolute cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:rounded-xl hover:scale-110 transition-transform duration-150"
        style={{
          left: p.left, top: p.top, width: p.cw, height: BOX_H,
          pointerEvents: scene.dive >= 0.95 ? 'none' : 'auto',
          transition: scene.instant ? 'transform 150ms ease' : scene.walking ? `left ${scene.ms}ms linear, top ${scene.ms}ms linear, transform 150ms ease` : 'transform 150ms ease',
        }}>
        <div className={anim}>
          <div style={{ width: p.cw, height: BOX_H, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: edge ? 'flex-start' : 'center' }}>
            <img src={sp.src} alt="" draggable={false} decoding="async"
              style={{ width: w, height: h, objectFit: 'contain', flexShrink: 0, userSelect: 'none', filter: 'drop-shadow(0 2px 1px rgba(17,17,17,0.18))', transform: `translate(${tx}px, ${ty}px) scaleX(${scene.flip})`, transition: 'transform .45s ease' }} />
          </div>
        </div>

        {scene.say && (
          <span className="mascot-pop absolute whitespace-nowrap border-2 border-ink bg-white rounded px-2 py-1 font-mono text-[11px] font-bold shadow-b2"
            style={{ bottom: `calc(100% - ${Math.round(ty)}px + 4px)`, ...(bubbleRight ? { right: 0 } : { left: 0 }) }}>{WARNING}</span>
        )}
        {scene.extra === 'zzz' && !scene.walking && scene.dive < 0.5 && (<>
          <span className="mascot-zzz absolute font-mono font-bold text-[11px]" style={{ right: -2, top: 8 }}>z</span>
          <span className="mascot-zzz absolute font-mono font-bold text-[9px]" style={{ right: -9, top: 2, animationDelay: '.8s' }}>z</span>
        </>)}
        {scene.extra === 'gnaw' && !scene.walking && [0, 1, 2].map((i) => (
          <span key={i} className="mascot-crumb absolute w-1 h-1 bg-ink" style={{ left: BOX_W - 3 + i * 3, top: BOX_H - 12, animationDelay: `${i * 0.3}s`, '--dx': `${4 + i * 3}px` }} />
        ))}
      </div>
    </div>
  );
}
