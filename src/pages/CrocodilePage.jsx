import { useEffect, useMemo, useState } from 'react';
import Marquee from '../components/layout/Marquee.jsx';
import Header from '../components/layout/Header.jsx';
import MouseAvatar from '../components/ui/MouseAvatar.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CROCODILE_CATEGORIES, CROCODILE_CAT_MAP } from '../data/crocodileWords.js';
import {
  awardCrocodileTeamBonus,
  CROCODILE_TEAM_BONUS_COINS,
  CROCODILE_TEAM_BONUS_PTS,
  subscribeCrocodilePhrases,
} from '../firebase/crocodile.js';
import { CROCODILE_STICKERS } from '../assets/crocodile/index.js';
import { HUB_STICKERS } from '../assets/stickers/index.js';
import kawaiiDragon from '../assets/costumes/kawaii_dragon.png';

function shuffleList(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function CrocodilePage() {
  const { users, profile, setError } = useApp();

  const [customPhrases, setCustomPhrases] = useState([]);
  const [phase, setPhase] = useState('setup'); // 'setup' | 'play' | 'summary'
  const [selectedCat, setSelectedCat] = useState('all'); // 'all' | categoryId
  const [teamIds, setTeamIds] = useState([]);
  const [rosterFilter, setRosterFilter] = useState('');
  const [showRules, setShowRules] = useState(false);

  // Active game / round state
  const [deck, setDeck] = useState([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [concealed, setConcealed] = useState(true);
  const [roundNumber, setRoundNumber] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [handoffBanner, setHandoffBanner] = useState('');
  const [history, setHistory] = useState([]); // [{ text, categoryId, categoryTitle, status, actorId, actorName, round }]
  const [bonusState, setBonusState] = useState({ claimed: false, busy: false, msg: '', info: '', err: '' });

  useEffect(() => subscribeCrocodilePhrases(setCustomPhrases, (e) => setError(e.message)), [setError]);

  // Seed signed-in user into team roster once when loaded
  useEffect(() => {
    if (profile?.id) {
      setTeamIds((prev) => (prev.length === 0 ? [profile.id] : prev));
    }
  }, [profile?.id]);

  const participants = useMemo(
    () => users.filter((u) => !u.isDemo || u.id === profile?.id),
    [users, profile?.id],
  );

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const teamMembers = useMemo(
    () => teamIds.map((id) => userMap.get(id)).filter(Boolean),
    [teamIds, userMap],
  );

  const filteredParticipants = useMemo(() => {
    const q = rosterFilter.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.country || '').toLowerCase().includes(q),
    );
  }, [participants, rosterFilter]);

  const toggleTeamMember = (uid) => {
    setTeamIds((prev) => (prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]));
  };

  const moveTeamMember = (idx, dir) => {
    setTeamIds((prev) => {
      const next = [...prev];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  const decksByCategory = useMemo(() => {
    const map = new Map();
    CROCODILE_CATEGORIES.forEach((cat) => {
      const extras = customPhrases
        .filter((p) => p.categoryId === cat.id)
        .map((p) => p.text);
      const unique = [...new Set([...cat.phrases, ...extras])];
      map.set(
        cat.id,
        unique.map((text) => ({
          text,
          categoryId: cat.id,
          categoryTitle: cat.title,
        })),
      );
    });
    return map;
  }, [customPhrases]);

  const activePool = useMemo(() => {
    if (selectedCat === 'all') {
      return CROCODILE_CATEGORIES.flatMap((c) => decksByCategory.get(c.id) || []);
    }
    return decksByCategory.get(selectedCat) || [];
  }, [selectedCat, decksByCategory]);

  const unclaimedTeamCount = useMemo(
    () => teamMembers.filter((m) => !m.crocodileBonusClaimed).length,
    [teamMembers],
  );

  const startRound = async () => {
    const shuffled = shuffleList(activePool);
    setDeck(shuffled);
    setDeckIndex(0);
    setHistory([]);
    setRoundNumber(1);
    setTurnIndex(0);
    setConcealed(true);
    setHandoffBanner('');
    setBonusState({ claimed: false, busy: false, msg: '', info: '', err: '' });
    setPhase('play');

    const idsToCredit = teamMembers.map((m) => m.id);
    if (idsToCredit.length > 0) {
      setBonusState({ claimed: false, busy: true, msg: '', info: '', err: '' });
      try {
        const res = await awardCrocodileTeamBonus(idsToCredit);
        const newMsg = res.count > 0
          ? `+${res.pts} Hub PTS & +${res.coins.toLocaleString('en-US')} Outfit Coins awarded (one-time) to: ${res.names.join(', ')}!`
          : '';
        const infoMsg = res.alreadyCount > 0
          ? `Already received Crocodile points earlier (one-time only): ${res.alreadyClaimedNames.join(', ')}.`
          : '';
        setBonusState({
          claimed: true,
          busy: false,
          msg: newMsg,
          info: infoMsg,
          err: '',
        });
      } catch (err) {
        setBonusState({
          claimed: false,
          busy: false,
          msg: '',
          info: '',
          err: err.message || 'Could not credit team points.',
        });
      }
    }
  };

  const currentActor = teamMembers.length > 0 ? teamMembers[turnIndex % teamMembers.length] : null;
  const nextTurnInfo = useMemo(() => {
    if (teamMembers.length <= 1) return null;
    const nextIdx = (turnIndex + 1) % teamMembers.length;
    const nextRound = nextIdx === 0 ? roundNumber + 1 : roundNumber;
    return {
      actor: teamMembers[nextIdx],
      index: nextIdx,
      round: nextRound,
    };
  }, [teamMembers, turnIndex, roundNumber]);

  const currentCard = deck[deckIndex % Math.max(1, deck.length)] || null;
  const currentCatMeta = currentCard ? CROCODILE_CAT_MAP.get(currentCard.categoryId) : null;

  const advanceDeckCard = () => {
    const nextIdx = deckIndex + 1;
    if (nextIdx >= deck.length) {
      setDeck(shuffleList(activePool));
      setDeckIndex(0);
    } else {
      setDeckIndex(nextIdx);
    }
  };

  const recordOutcome = (status) => {
    if (!currentCard) return;

    setHistory((prev) => [
      ...prev,
      {
        text: currentCard.text,
        categoryId: currentCard.categoryId,
        categoryTitle: currentCard.categoryTitle,
        status,
        actorId: currentActor?.id || null,
        actorName: currentActor?.name || 'Team',
        round: roundNumber,
      },
    ]);

    advanceDeckCard();

    if (status === 'guessed') {
      if (teamMembers.length > 1) {
        const nextIdx = (turnIndex + 1) % teamMembers.length;
        const nextRound = nextIdx === 0 ? roundNumber + 1 : roundNumber;
        const nextPlayer = teamMembers[nextIdx];
        setTurnIndex(nextIdx);
        setRoundNumber(nextRound);
        setConcealed(true);
        setHandoffBanner(
          `Guessed! Turn passes to ${nextPlayer.name} — Round ${nextRound} (Turn ${nextIdx + 1}/${teamMembers.length})`,
        );
      } else {
        setRoundNumber((r) => r + 1);
        setConcealed(true);
        setHandoffBanner('Guessed! Tap the card for the next round.');
      }
    } else {
      // PASS / SKIP keeps the same player's turn with a fresh card
      setHandoffBanner('');
      setConcealed(false);
    }
  };

  const skipPlayerTurn = () => {
    if (teamMembers.length <= 1) return;
    const nextIdx = (turnIndex + 1) % teamMembers.length;
    const nextRound = nextIdx === 0 ? roundNumber + 1 : roundNumber;
    const nextPlayer = teamMembers[nextIdx];
    setTurnIndex(nextIdx);
    setRoundNumber(nextRound);
    setConcealed(true);
    setHandoffBanner(
      `Turn passed to ${nextPlayer.name} — Round ${nextRound} (Turn ${nextIdx + 1}/${teamMembers.length})`,
    );
  };

  const finishRound = () => {
    setPhase('summary');
  };

  const toggleHistoryItem = (idx) => {
    setHistory((prev) =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, status: item.status === 'guessed' ? 'passed' : 'guessed' }
          : item,
      ),
    );
  };

  const guessedCount = history.filter((h) => h.status === 'guessed').length;
  const passedCount = history.filter((h) => h.status === 'passed').length;

  return (
    <>
      <Marquee
        className="bg-[#00E676] text-ink"
        items={['CROCODILE CHARADES', 'TEAM PLAY · +8 PTS FOR EVERY TEAM MEMBER', 'TURN PASSES WHEN GUESSED · NO TIMER']}
      />

      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-5">
        <Header back />

        {/* SETUP SCREEN */}
        {phase === 'setup' && (
          <div className="flex flex-col gap-4">
            {/* Hero Banner */}
            <section className="border-[3px] border-ink rounded-2xl bg-[#00E676] shadow-b6 p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <img src={HUB_STICKERS.crocodileBanner} alt="Crocodile" draggable={false} className="h-9 sm:h-11 w-auto object-contain" />
                  <span className="border-2 border-ink bg-white text-ink px-2.5 py-0.5 rounded font-mono text-[11px] font-extrabold uppercase whitespace-nowrap">
                    No Timer · Team Rotation
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight leading-none text-ink">
                  Crocodile Charades
                </h1>
                <p className="text-xs sm:text-sm font-bold text-ink/90 mt-1.5 leading-snug">
                  Add everyone playing on your team below: each participant automatically earns a <b>one-time +{CROCODILE_TEAM_BONUS_PTS} Hub PTS</b> &amp; <b>+{CROCODILE_TEAM_BONUS_COINS} Outfit Coins</b> bonus on their first game!{' '}
                  <b>When a word is guessed, the turn automatically passes to the next participant.</b>
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center">
                <div className="flex items-end -space-x-3">
                  <img
                    src={kawaiiDragon}
                    alt="Dragon Mouse"
                    draggable={false}
                    className="w-16 h-16 sm:w-22 sm:h-22 object-contain mascot-breathe drop-shadow-[0_3px_0_rgba(17,17,17,0.22)]"
                  />
                  <img
                    src={HUB_STICKERS.crocodileMascot}
                    alt="Crocodile"
                    draggable={false}
                    className="w-16 h-16 sm:w-22 sm:h-22 object-contain drop-shadow-[0_3px_0_rgba(17,17,17,0.22)]"
                  />
                </div>
              </div>
            </section>

            {/* Step 1: Team Roster + Auto Round Order */}
            <section className="box shadow-b6 bg-white overflow-hidden">
              <div className="bg-[#FFE600] border-b-[3px] border-ink px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono text-xs font-extrabold uppercase text-ink flex items-center gap-2">
                  <img src={CROCODILE_STICKERS.yourTurn} alt="" className="h-6 w-auto object-contain" draggable={false} />
                  <span>1 · Team Participants ({teamMembers.length})</span>
                </span>
                <span className="tag bg-ink text-[#FFE600] !text-[10px] whitespace-nowrap">
                  +{CROCODILE_TEAM_BONUS_PTS} PTS · +{CROCODILE_TEAM_BONUS_COINS} Coins (ONCE)
                </span>
              </div>

              <div className="p-4 bg-paper flex flex-col gap-3">
                {/* Personal one-time points status */}
                {profile && (
                  <div
                    className={`border-2 border-ink rounded-xl px-3 py-2 flex items-center gap-2 font-mono text-xs font-extrabold ${
                      profile.crocodileBonusClaimed ? 'bg-white text-ink' : 'bg-neon text-ink'
                    }`}
                  >
                    <img
                      src={profile.crocodileBonusClaimed ? HUB_STICKERS.badgeCheck : HUB_STICKERS.badgeTrophy}
                      alt=""
                      className="w-5 h-5 object-contain shrink-0"
                      draggable={false}
                    />
                    <span>
                      {profile.crocodileBonusClaimed
                        ? `You already received your Crocodile points (+${CROCODILE_TEAM_BONUS_PTS} PTS is awarded once per participant). Keep playing for fun!`
                        : `First-time bonus ready: you will receive +${CROCODILE_TEAM_BONUS_PTS} Hub PTS & +${CROCODILE_TEAM_BONUS_COINS} Outfit Coins (one-time).`}
                    </span>
                  </div>
                )}
                {/* Active Team Turn Order */}
                {teamMembers.length > 0 ? (
                  <div className="border-[2.5px] border-ink rounded-xl bg-white p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-extrabold uppercase text-ink flex items-center gap-1.5">
                        <img src={HUB_STICKERS.badgeStar} alt="" className="w-4 h-4 object-contain" draggable={false} />
                        Round 1 Turn Order (auto-rotates on guess)
                      </span>
                      <button
                        type="button"
                        onClick={() => setTeamIds([])}
                        className="font-mono text-[10px] font-bold uppercase underline text-hot cursor-pointer"
                      >
                        Clear team
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {teamMembers.map((member, idx) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between gap-2 border-2 border-ink rounded-lg bg-paper px-2.5 py-1.5"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-md bg-ink text-[#FFE600] font-mono text-[11px] font-extrabold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <MouseAvatar user={member} size="w-7 h-7" rounded="rounded-md" border="border-2 border-ink" />
                            <span className="font-bold text-xs sm:text-sm truncate">{member.name}</span>
                            {member.id === profile?.id && (
                              <span className="font-mono text-[10px] font-bold uppercase text-cobalt shrink-0">You</span>
                            )}
                            <span
                              className={`font-mono text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-ink shrink-0 ${
                                member.crocodileBonusClaimed ? 'bg-white text-mute' : 'bg-neon text-ink'
                              }`}
                            >
                              {member.crocodileBonusClaimed ? 'PTS received' : `+${CROCODILE_TEAM_BONUS_PTS} PTS`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveTeamMember(idx, -1)}
                              aria-label="Move up"
                              className="w-6 h-6 border-2 border-ink rounded bg-white font-mono text-xs font-black disabled:opacity-30 cursor-pointer"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === teamMembers.length - 1}
                              onClick={() => moveTeamMember(idx, 1)}
                              aria-label="Move down"
                              className="w-6 h-6 border-2 border-ink rounded bg-white font-mono text-xs font-black disabled:opacity-30 cursor-pointer"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleTeamMember(member.id)}
                              aria-label={`Remove ${member.name}`}
                              className="w-6 h-6 border-2 border-ink rounded bg-hot text-white font-mono text-xs font-black cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-ink/80 bg-[#00E676]/25 border border-ink rounded-lg px-2.5 py-1.5">
                      Round 1: {teamMembers.map((m, i) => `${i + 1}. ${m.name}`).join(' → ')} → then Round 2 repeats! Every guess passes the turn to the next participant.
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-ink rounded-xl bg-white p-3 font-mono text-xs font-bold text-mute">
                    Select everyone playing in your team below so all participants automatically receive +{CROCODILE_TEAM_BONUS_PTS} Hub PTS &amp; +{CROCODILE_TEAM_BONUS_COINS} Outfit Coins and see their live Round &amp; Turn schedule!
                  </div>
                )}

                {/* Participant Picker */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="input flex-1 !py-1.5 text-xs sm:text-sm"
                    placeholder="Search participants by name or country…"
                    value={rosterFilter}
                    onChange={(e) => setRosterFilter(e.target.value)}
                  />
                  {profile && !teamIds.includes(profile.id) && (
                    <button
                      type="button"
                      onClick={() => setTeamIds((prev) => [profile.id, ...prev])}
                      className="btn bg-sun text-ink !py-1.5 text-xs whitespace-nowrap"
                    >
                      + Add me ({profile.name})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {filteredParticipants.map((u) => {
                    const selected = teamIds.includes(u.id);
                    const orderIdx = teamIds.indexOf(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleTeamMember(u.id)}
                        className={`text-left border-2 border-ink rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2 transition cursor-pointer ${
                          selected ? 'bg-[#00E676] text-ink shadow-b2' : 'bg-white text-ink hover:bg-sun/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MouseAvatar user={u} size="w-6 h-6" rounded="rounded-md" border="border border-ink" />
                          <span className="font-bold text-xs truncate">{u.name}</span>
                          {u.crocodileBonusClaimed && (
                            <span className="font-mono text-[9px] font-bold uppercase text-mute shrink-0">
                              · received
                            </span>
                          )}
                        </div>
                        <span className={`font-mono text-[10px] font-extrabold uppercase shrink-0 px-1.5 py-0.5 rounded border border-ink ${selected ? 'bg-ink text-[#FFE600]' : 'bg-paper text-ink'}`}>
                          {selected ? `#${orderIdx + 1} IN TEAM` : '+ ADD'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Step 2: Category Picker */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight">
                  2 · Choose Category Pack
                </h2>
                <span className="font-mono text-xs font-bold text-mute">
                  {activePool.length} cards ready
                </span>
              </div>

              {/* All Categories Option */}
              <button
                type="button"
                onClick={() => setSelectedCat('all')}
                className={`text-left border-[3px] border-ink rounded-2xl p-4 transition-all cursor-pointer ${
                  selectedCat === 'all'
                    ? 'bg-[#FFE600] shadow-b6 ring-2 ring-ink'
                    : 'bg-white shadow-b4 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={CROCODILE_STICKERS.confetti} alt="" className="w-10 h-10 object-contain shrink-0" draggable={false} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="tag bg-ink text-[#FFE600] !text-[10px]">PARTY MIX</span>
                        <span className="font-mono text-[11px] font-bold text-ink/75">
                          {CROCODILE_CATEGORIES.reduce((sum, c) => sum + (decksByCategory.get(c.id)?.length || 0), 0)} cards
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold uppercase mt-0.5">All Categories Mix</div>
                      <p className="text-xs sm:text-sm font-medium text-ink/85">
                        Random blend of Erasmus+ inside jokes, simple single words, movies, actions &amp; tricky phrases.
                      </p>
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-md border-2 border-ink flex items-center justify-center shrink-0 font-black ${selectedCat === 'all' ? 'bg-ink text-[#FFE600]' : 'bg-paper text-transparent'}`}>
                    ✓
                  </div>
                </div>
              </button>

              {/* Individual 5 Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CROCODILE_CATEGORIES.map((cat) => {
                  const pool = decksByCategory.get(cat.id) || [];
                  const active = selectedCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`text-left border-[3px] border-ink rounded-2xl p-3.5 sm:p-4 transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        active
                          ? `${cat.accent} shadow-b6 ring-2 ring-ink`
                          : 'bg-white shadow-b4 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="tag bg-white text-ink !text-[10px]">{cat.badge}</span>
                            <span className="font-mono text-[11px] font-bold text-ink/75">{pool.length} cards</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold uppercase leading-tight mt-1.5">{cat.title}</h3>
                        </div>
                        <img src={cat.sticker} alt="" className="h-12 w-auto object-contain shrink-0 drop-shadow-[0_2px_0_rgba(17,17,17,0.18)]" draggable={false} />
                      </div>
                      <p className="text-xs font-medium text-ink/85 leading-snug">{cat.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-ink/15">
                        {pool.slice(0, 3).map((item) => (
                          <span key={item.text} className="px-2 py-0.5 bg-paper border border-ink rounded font-mono text-[10px] font-bold text-ink truncate max-w-[140px]">
                            {item.text}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Start Round CTA */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={startRound}
                className="w-full py-4 px-5 bg-[#FFE600] text-ink border-[3px] border-ink rounded-2xl shadow-b6 hover:-translate-y-0.5 active:translate-y-0 active:shadow-b2 transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img src={CROCODILE_STICKERS.btnPlay} alt="" className="w-10 h-10 object-contain shrink-0" draggable={false} />
                  <div className="text-left">
                    <div className="text-xl sm:text-2xl font-extrabold uppercase leading-none">
                      Start Round 1
                    </div>
                    <div className="font-mono text-[11px] font-bold uppercase text-ink/80 mt-0.5">
                      {teamMembers.length === 0
                        ? 'Casual play (select team members above)'
                        : unclaimedTeamCount > 0
                          ? `Starts with ${teamMembers[0].name} · +${CROCODILE_TEAM_BONUS_PTS} PTS (once) for ${unclaimedTeamCount} player${unclaimedTeamCount === 1 ? '' : 's'}`
                          : `Starts with ${teamMembers[0].name} · All team members already received points`}
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-black">→</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRules(true)}
                className="btn bg-white text-ink self-center text-xs"
              >
                <img src={CROCODILE_STICKERS.noSound} alt="" className="w-4 h-4 object-contain" draggable={false} />
                <span>House Rules</span>
              </button>
            </div>
          </div>
        )}

        {/* PLAY SCREEN */}
        {phase === 'play' && (
          <div className="flex flex-col gap-3.5">
            {/* Top Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="border-[3px] border-ink rounded-xl bg-[#FFE600] px-3 py-1.5 shadow-b4 flex items-center gap-2">
                <img src={HUB_STICKERS.badgeStar} alt="" className="w-5 h-5 object-contain" draggable={false} />
                <span className="font-mono text-xs font-extrabold uppercase text-ink">
                  ROUND {roundNumber}
                  {teamMembers.length > 0 ? ` · TURN ${(turnIndex % teamMembers.length) + 1}/${teamMembers.length}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="border-[3px] border-ink rounded-xl bg-[#00E676] px-3 py-1.5 shadow-b4 font-mono text-xs font-extrabold uppercase tabular-nums">
                  CARD #{history.length + 1}
                </span>
                <button
                  type="button"
                  onClick={finishRound}
                  className="border-[3px] border-ink rounded-xl bg-white px-3 py-1.5 shadow-b4 font-mono text-xs font-extrabold uppercase hover:bg-paper cursor-pointer whitespace-nowrap"
                >
                  Finish Game
                </button>
              </div>
            </div>

            {/* Automatic Live Round & Turn Roster Tracker */}
            {teamMembers.length > 0 && (
              <section className="border-[3px] border-ink rounded-2xl bg-white shadow-b4 overflow-hidden">
                <div className="bg-ink text-white px-3.5 py-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {currentActor && (
                      <MouseAvatar user={currentActor} size="w-7 h-7" rounded="rounded-md" border="border-2 border-[#FFE600]" />
                    )}
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] font-bold uppercase text-[#FFE600] leading-none">
                        NOW ACTING · ROUND {roundNumber}
                      </div>
                      <div className="font-extrabold text-sm sm:text-base uppercase truncate">
                        {currentActor?.name}
                      </div>
                    </div>
                  </div>
                  {nextTurnInfo && (
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1">
                      <span className="font-mono text-[10px] font-bold uppercase text-white/80">
                        Next on guess: <b className="text-[#00E676]">{nextTurnInfo.actor.name}</b> (Rd {nextTurnInfo.round})
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-paper flex flex-wrap gap-1.5">
                  {teamMembers.map((member, idx) => {
                    const isCurrent = idx === turnIndex;
                    const isDoneThisRound = idx < turnIndex;
                    return (
                      <div
                        key={member.id}
                        className={`border-2 border-ink rounded-lg px-2 py-1 flex items-center gap-1.5 font-mono text-[11px] font-extrabold ${
                          isCurrent
                            ? 'bg-[#FFE600] text-ink shadow-b2'
                            : isDoneThisRound
                              ? 'bg-[#00E676]/45 text-ink'
                              : 'bg-white text-ink/75'
                        }`}
                      >
                        <MouseAvatar user={member} size="w-5 h-5" rounded="rounded" border="border border-ink" />
                        <span>{member.name}</span>
                        <span className="text-[9px] uppercase px-1 rounded bg-white/80 border border-ink/40">
                          {isCurrent
                            ? `Rd ${roundNumber} · NOW`
                            : isDoneThisRound
                              ? `Rd ${roundNumber} ✓`
                              : `Rd ${roundNumber} · #${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Handoff Banner when turn passed after guess */}
            {handoffBanner && (
              <div className="border-[3px] border-ink rounded-xl bg-[#FFE600] px-3.5 py-2 shadow-b4 flex items-center gap-2 font-mono text-xs font-extrabold text-ink">
                <img src={HUB_STICKERS.badgeCheck} alt="" className="w-5 h-5 object-contain shrink-0" draggable={false} />
                <span>{handoffBanner}</span>
              </div>
            )}

            {/* Team Bonus Confirmation / Already Claimed Banners */}
            {bonusState.msg && (
              <div className="border-[3px] border-ink rounded-xl bg-neon px-3.5 py-2 shadow-b4 flex items-center gap-2 font-mono text-xs font-extrabold text-ink">
                <img src={HUB_STICKERS.badgeTrophy} alt="" className="w-5 h-5 object-contain shrink-0" draggable={false} />
                <span>{bonusState.msg}</span>
              </div>
            )}
            {bonusState.info && (
              <div className="border-[3px] border-ink rounded-xl bg-white px-3.5 py-2 shadow-b4 flex items-center gap-2 font-mono text-xs font-extrabold text-ink">
                <img src={HUB_STICKERS.badgeCheck} alt="" className="w-5 h-5 object-contain shrink-0" draggable={false} />
                <span>{bonusState.info}</span>
              </div>
            )}
            {bonusState.err && (
              <div className="border-[3px] border-ink rounded-xl bg-hot px-3.5 py-2 font-mono text-xs font-bold text-white">
                {bonusState.err}
              </div>
            )}

            {/* Giant Hero Word Card (Tap to Conceal / Reveal) */}
            <button
              type="button"
              onClick={() => setConcealed((c) => !c)}
              className="w-full min-h-[260px] sm:min-h-[320px] bg-white border-[4px] border-ink rounded-2xl p-5 sm:p-7 shadow-b8 active:translate-x-[2px] active:translate-y-[2px] active:shadow-b4 transition-all flex flex-col items-center justify-between text-center select-none cursor-pointer"
            >
              <div className="w-full flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 border-2 border-ink rounded-lg bg-[#FFE600] px-2.5 py-1 shadow-b2">
                  {currentCatMeta && (
                    <img src={currentCatMeta.sticker} alt="" className="h-6 w-auto object-contain" draggable={false} />
                  )}
                  <span className="font-mono text-[11px] font-extrabold uppercase text-ink">
                    {currentCard?.categoryTitle || 'Charades'}
                  </span>
                </div>
                <span className="border-2 border-ink rounded-lg bg-[#00E676] px-2.5 py-1 font-mono text-[10px] font-extrabold uppercase text-ink">
                  {currentActor ? `${currentActor.name} · Round ${roundNumber}` : `Round ${roundNumber}`}
                </span>
              </div>

              <div className="w-full flex-1 flex flex-col items-center justify-center py-5 px-2">
                {concealed ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={kawaiiDragon} alt="" className="w-12 h-12 object-contain" draggable={false} />
                      <img src={CROCODILE_STICKERS.guess} alt="" className="h-11 w-auto object-contain" draggable={false} />
                    </div>
                    <p className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-mute">
                      ••• CONCEALED •••
                    </p>
                    <p className="font-mono text-xs font-bold text-ink/80 mt-2">
                      {currentActor
                        ? `Only ${currentActor.name} may look! Tap card to reveal.`
                        : 'Only the actor may look! Tap card to reveal.'}
                    </p>
                  </>
                ) : (
                  <p className="text-3xl sm:text-5xl font-extrabold uppercase leading-[1.08] tracking-tight text-ink break-words max-w-full">
                    {currentCard?.text}
                  </p>
                )}
              </div>

              <div className="inline-flex items-center gap-2 border-2 border-ink rounded-lg bg-paper px-3 py-1 font-mono text-[11px] font-extrabold uppercase text-ink">
                <span>{concealed ? '👁️ TAP TO REVEAL' : '🙈 TAP TO CONCEAL'}</span>
              </div>
            </button>

            {/* Rule Reminder Strip */}
            <div className="flex justify-center">
              <div className="border-[3px] border-ink rounded-xl bg-white px-3.5 py-1.5 shadow-b4 inline-flex items-center gap-2 text-center">
                <img src={CROCODILE_STICKERS.noSound} alt="" className="w-5 h-5 object-contain shrink-0" draggable={false} />
                <span className="font-mono text-[11px] sm:text-xs font-extrabold uppercase tracking-wide">
                  Gestures Only • When guessed, turn passes to the next participant!
                </span>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => recordOutcome('guessed')}
                className="w-full bg-[#FFE600] text-ink border-[4px] border-ink rounded-2xl py-4 px-5 shadow-b6 active:translate-x-[2px] active:translate-y-[2px] active:shadow-b2 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <img src={HUB_STICKERS.badgeCheck} alt="" className="w-7 h-7 object-contain shrink-0" draggable={false} />
                <span className="text-lg sm:text-2xl font-extrabold uppercase tracking-wide">
                  {nextTurnInfo
                    ? `GOT IT! → Pass Turn to ${nextTurnInfo.actor.name}`
                    : 'GOT IT! (Next Round)'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => recordOutcome('passed')}
                  className="bg-[#FF4B72] text-white border-[3px] border-ink rounded-xl py-3 px-4 shadow-b4 active:translate-y-0.5 active:shadow-b2 transition-all flex items-center justify-center gap-2 font-extrabold uppercase text-sm sm:text-base cursor-pointer"
                >
                  <img src={HUB_STICKERS.badgeCross} alt="" className="w-5 h-5 object-contain" draggable={false} />
                  <span>PASS / SKIP</span>
                </button>
                {teamMembers.length > 1 ? (
                  <button
                    type="button"
                    onClick={skipPlayerTurn}
                    className="bg-white text-ink border-[3px] border-ink rounded-xl py-3 px-4 shadow-b4 active:translate-y-0.5 active:shadow-b2 transition-all flex items-center justify-center gap-2 font-extrabold uppercase text-sm sm:text-base cursor-pointer"
                  >
                    <img src={CROCODILE_STICKERS.nextPlayer} alt="" className="h-5 w-auto object-contain" draggable={false} />
                    <span>NEXT PLAYER</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishRound}
                    className="bg-white text-ink border-[3px] border-ink rounded-xl py-3 px-4 shadow-b4 active:translate-y-0.5 active:shadow-b2 transition-all flex items-center justify-center gap-2 font-extrabold uppercase text-sm sm:text-base cursor-pointer"
                  >
                    <img src={CROCODILE_STICKERS.clapping} alt="" className="w-6 h-6 object-contain" draggable={false} />
                    <span>FINISH</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY SCREEN */}
        {phase === 'summary' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="border-[3px] border-ink rounded-xl bg-white px-3 py-1.5 shadow-b4 font-mono text-xs font-extrabold uppercase">
                GAME COMPLETE // {roundNumber} ROUND{roundNumber === 1 ? '' : 'S'}
              </div>
              <div className="border-2 border-ink rounded-xl bg-[#00E676] px-3 py-1 font-mono text-xs font-extrabold uppercase">
                No Timer
              </div>
            </div>

            {/* Hero Summary Card */}
            <section className="border-[4px] border-ink rounded-2xl bg-white shadow-b8 p-5 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <img src={HUB_STICKERS.badgeTrophy} alt="" className="w-7 h-7 object-contain shrink-0" draggable={false} />
                  <span className="font-mono text-xs font-extrabold uppercase text-mute">Team Summary</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mt-1">
                  GREAT GAME!
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="tag bg-paper text-ink !text-[11px]">
                    {selectedCat === 'all' ? 'All Categories' : CROCODILE_CAT_MAP.get(selectedCat)?.title}
                  </span>
                  {teamMembers.length > 0 && (
                    <span className="tag bg-[#FFE600] text-ink !text-[11px]">
                      {teamMembers.length} player{teamMembers.length === 1 ? '' : 's'} · one-time +{CROCODILE_TEAM_BONUS_PTS} PTS bonus
                    </span>
                  )}
                </div>
                {teamMembers.length > 0 && (
                  <div className="font-mono text-[11px] font-bold text-ink/80 mt-2">
                    Team: {teamMembers.map((m) => m.name).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center shrink-0">
                <img src={HUB_STICKERS.crocodileMascot} alt="Crocodile" className="w-20 h-20 object-contain" draggable={false} />
                <div className="bg-[#FFE600] border-[3px] border-ink rounded-xl px-3 py-1 shadow-b2 text-center -mt-2">
                  <div className="font-mono text-[10px] font-extrabold uppercase">Played</div>
                  <div className="text-2xl font-extrabold tabular-nums leading-none">{history.length}</div>
                </div>
              </div>
            </section>

            {/* Quick 3-column Stats */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="border-[3px] border-ink rounded-xl bg-[#00E676] p-3 text-center shadow-b4">
                <div className="font-mono text-[11px] font-extrabold uppercase">Guessed</div>
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums mt-0.5">{guessedCount}</div>
              </div>
              <div className="border-[3px] border-ink rounded-xl bg-[#FF4B72] text-white p-3 text-center shadow-b4">
                <div className="font-mono text-[11px] font-extrabold uppercase">Passed</div>
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums mt-0.5">{passedCount}</div>
              </div>
              <div className="border-[3px] border-ink rounded-xl bg-white p-3 text-center shadow-b4">
                <div className="font-mono text-[11px] font-extrabold uppercase">Rounds</div>
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums mt-0.5">{roundNumber}</div>
              </div>
            </div>

            {/* Word & Round Breakdown */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-base sm:text-lg uppercase">Round-by-Round Log</h3>
                <span className="font-mono text-[11px] font-bold text-mute">Tap any card to toggle</span>
              </div>
              {history.length === 0 ? (
                <div className="box p-4 bg-white font-mono text-xs text-mute">
                  No cards were completed this session.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {history.map((item, idx) => {
                    const isGuessed = item.status === 'guessed';
                    return (
                      <button
                        key={`${item.text}-${idx}`}
                        type="button"
                        onClick={() => toggleHistoryItem(idx)}
                        className="w-full text-left flex items-center justify-between gap-3 p-3 bg-white border-[3px] border-ink rounded-xl shadow-b4 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="font-extrabold uppercase text-sm sm:text-base truncate">{item.text}</div>
                          <div className="font-mono text-[11px] font-bold text-mute">
                            Round {item.round} · {item.actorName} · {item.categoryTitle}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 border-2 border-ink rounded-lg font-mono text-xs font-extrabold uppercase shrink-0 ${
                            isGuessed ? 'bg-[#00E676] text-ink' : 'bg-[#FF4B72] text-white'
                          }`}
                        >
                          {isGuessed ? 'GUESSED' : 'PASSED'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Bottom CTAs */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="w-full flex items-center justify-between px-5 py-4 bg-[#FFE600] text-ink border-[4px] border-ink rounded-2xl shadow-b6 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img src={CROCODILE_STICKERS.nextPlayer} alt="" className="h-9 w-auto object-contain shrink-0" draggable={false} />
                  <div className="text-left">
                    <div className="text-lg sm:text-xl font-extrabold uppercase leading-none">New Team / Change Setup</div>
                    <div className="font-mono text-[11px] font-bold uppercase text-ink/80 mt-0.5">
                      Pick participants &amp; category (+{CROCODILE_TEAM_BONUS_PTS} PTS once per player)
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-black">→</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={startRound}
                  className="btn bg-white text-ink justify-center py-3 text-xs sm:text-sm"
                >
                  <img src={CROCODILE_STICKERS.btnRefresh} alt="" className="w-5 h-5 object-contain" draggable={false} />
                  <span>Play Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('setup')}
                  className="btn bg-white text-ink justify-center py-3 text-xs sm:text-sm"
                >
                  <span>Change Category</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Marquee
        className="bg-ink text-white"
        items={['CROCODILE CHARADES', 'WHOLE TEAM +8 PTS', 'WHEN GUESSED, TURN PASSES TO NEXT PLAYER']}
      />

      {showRules && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4"
          onClick={() => setShowRules(false)}
        >
          <div
            className="max-w-md w-full border-[4px] border-ink rounded-2xl bg-white shadow-b8 p-5 sm:p-6 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src={CROCODILE_STICKERS.noSound} alt="" className="w-7 h-7 object-contain" draggable={false} />
                <h2 className="text-xl font-extrabold uppercase">Crocodile House Rules</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowRules(false)}
                className="w-8 h-8 border-2 border-ink rounded-lg bg-hot text-white font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-2 text-sm font-medium">
              <li><b>1 · No speaking or sounds:</b> Show the word or phrase using only gestures, facial expressions, and movement.</li>
              <li><b>2 · Automatic turn rotation on guess:</b> When your team guesses the word and you tap <b>GOT IT!</b>, the turn automatically passes to the next participant and updates the live Round tracker!</li>
              <li><b>3 · No timer pressure:</b> Take your time — tap <b>GOT IT!</b> when guessed, or <b>PASS / SKIP</b> to draw another word for the current actor.</li>
              <li><b>4 · One-Time Team Reward (+{CROCODILE_TEAM_BONUS_PTS} PTS &amp; +{CROCODILE_TEAM_BONUS_COINS} Coins):</b> Each participant receives +{CROCODILE_TEAM_BONUS_PTS} Hub PTS and +{CROCODILE_TEAM_BONUS_COINS} Outfit Coins only ONCE for playing Crocodile. If you already received these points earlier, you won&apos;t receive them again.</li>
            </ul>
            <button type="button" onClick={() => setShowRules(false)} className="btn bg-[#FFE600] text-ink self-end mt-1">
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
