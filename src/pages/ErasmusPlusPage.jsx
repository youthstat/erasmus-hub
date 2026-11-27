import { useEffect, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import Marquee from '../components/layout/Marquee.jsx';
import { useApp } from '../context/AppContext.jsx';
import { ERASMUS_SPRITES, ERASMUS_STICKERS } from '../assets/erasmus/index.js';
import { JOURNEY_STOPS } from '../data/erasmusGames.js';
import {
  claimErasmusPointsToRating,
  EMPTY_ERASMUS_PROGRESS,
  recordErasmusGameScore,
  subscribeErasmusProgress,
  subscribeErasmusSettings,
} from '../firebase/erasmus.js';
import JourneyMap from '../components/erasmus/JourneyMap.jsx';
import ErasmusEssentials from '../components/erasmus/ErasmusEssentials.jsx';
import ErasmusResults from '../components/erasmus/ErasmusResults.jsx';
import {
  ErasmusMemoryGame,
  GrantEscapeGame,
  HackedExchangeGame,
  MythBustersGame,
} from '../components/erasmus/GamesBatchA.jsx';
import {
  CultureIcebergGame,
  ExchangeJourneyGame,
  FinalTestGame,
  PitchLabGame,
  PriorityTetrisGame,
} from '../components/erasmus/GamesBatchB.jsx';

export default function ErasmusPlusPage() {
  const { accountId, profile, openAccount, setError } = useApp();
  const [tab, setTab] = useState('map'); // 'map' | 'essentials' | 'results'
  const [activeStopId, setActiveStopId] = useState(null);
  const [progress, setProgress] = useState(EMPTY_ERASMUS_PROGRESS);
  const [erasmusSettings, setErasmusSettings] = useState({ claimOpen: false });
  const [claimBusy, setClaimBusy] = useState(false);
  const [claimFlash, setClaimFlash] = useState('');

  useEffect(() => {
    const onErr = (e) => setError(e.message);
    const offs = [
      subscribeErasmusProgress(accountId, setProgress, onErr),
      subscribeErasmusSettings(setErasmusSettings, onErr),
    ];
    return () => offs.forEach((o) => o());
  }, [accountId, setError]);

  const totalEarned = Math.min(
    100,
    JOURNEY_STOPS.reduce((sum, s) => sum + (Number(progress?.games?.[s.id]?.best) || 0), 0),
  );

  const openStop = (id) => {
    setActiveStopId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeStop = () => {
    setActiveStopId(null);
    setTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameFinish = async (stop, earnedScore) => {
    try {
      return await recordErasmusGameScore({
        userId: accountId,
        stopId: stop.id,
        title: stop.title,
        competenceKey: stop.competenceKey,
        score: earnedScore,
        maxPoints: stop.maxPoints,
      });
    } catch (e) {
      setError(e.message);
      return { saved: false, improved: 0, best: earnedScore, totalEarned };
    }
  };

  const handleClaimToRating = async () => {
    if (!accountId) {
      openAccount(null);
      return;
    }
    setClaimBusy(true);
    setClaimFlash('');
    try {
      const res = await claimErasmusPointsToRating(accountId);
      setClaimFlash(`+${res.claimedPoints} PTS sent to your Hub rating!`);
    } catch (e) {
      setError(e.message);
    } finally {
      setClaimBusy(false);
    }
  };

  const activeStop = JOURNEY_STOPS.find((s) => s.id === activeStopId) || null;

  const renderActiveGame = () => {
    if (!activeStop) return null;
    const nextId = activeStop.id < 9 ? activeStop.id + 1 : null;
    const commonProps = {
      stop: activeStop,
      onFinish: (sc) => handleGameFinish(activeStop, sc),
      onBack: closeStop,
      onNextStop: nextId ? () => openStop(nextId) : null,
    };

    switch (activeStop.id) {
      case 1:
        return <MythBustersGame {...commonProps} />;
      case 2:
        return <ErasmusMemoryGame {...commonProps} />;
      case 3:
        return <GrantEscapeGame {...commonProps} />;
      case 4:
        return <HackedExchangeGame {...commonProps} />;
      case 5:
        return <ExchangeJourneyGame {...commonProps} />;
      case 6:
        return <PriorityTetrisGame {...commonProps} />;
      case 7:
        return <PitchLabGame {...commonProps} />;
      case 8:
        return <CultureIcebergGame {...commonProps} />;
      case 9:
        return (
          <FinalTestGame
            {...commonProps}
            onOpenResults={() => {
              setActiveStopId(null);
              setTab('results');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Marquee
        className="bg-[#FFE200] text-ink"
        items={['ERASMUS+ COMPETENCE GAMES', '9 INTERACTIVE STOPS', 'SCORE UP TO 100/100', 'YOUTHPASS RADAR']}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        <Header back />

        {/* Illustrated Title Hero + Navigation Tabs */}
        {!activeStop && (
          <>
            <div className="box shadow-b8 p-5 sm:p-8 bg-[#FFE200] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1 flex flex-col gap-3">
                <div className="font-mono text-xs font-extrabold uppercase text-ink/80 flex items-center gap-2">
                  <img src={ERASMUS_STICKERS.mapPins} alt="" className="w-5 h-5 object-contain" draggable={false} />
                  <span>Interactive Learning Module · 8 Key Competences</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold uppercase leading-none tracking-tight text-ink">
                  Erasmus+
                </h1>
                <p className="text-sm sm:text-base font-bold text-ink/90 max-w-xl leading-snug">
                  Master Erasmus+ rules, grants, digital safety, priorities, and Youthpass competences with Pretty Patty across 9 interactive mini-games!
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setTab('map')}
                    className={`btn text-xs ${tab === 'map' ? 'bg-ink text-[#FFE200]' : 'bg-white text-ink'}`}
                  >
                    Journey Map (9 Games)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('essentials')}
                    className={`btn text-xs ${tab === 'essentials' ? 'bg-neon text-ink' : 'bg-white text-ink'}`}
                  >
                    Essentials &amp; Useful Links
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('results')}
                    className={`btn text-xs ${tab === 'results' ? 'bg-[#B89CFF] text-ink' : 'bg-white text-ink'}`}
                  >
                    Youthpass Radar ({totalEarned}/100)
                  </button>
                </div>
              </div>

              <div className="flex items-end gap-2 sm:gap-3 shrink-0">
                <img
                  src={ERASMUS_SPRITES.trioWalk}
                  alt="Pretty Patty explorer walking with backpack"
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-[0_3px_0_rgba(17,17,17,0.22)] mascot-breathe"
                  draggable={false}
                />
                <img
                  src={ERASMUS_SPRITES.trioCurious}
                  alt="Pretty Patty explorer looking forward"
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-[0_3px_0_rgba(17,17,17,0.22)] hidden md:block"
                  draggable={false}
                />
                <img
                  src={ERASMUS_SPRITES.trioCheer}
                  alt="Pretty Patty explorer cheering"
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-[0_3px_0_rgba(17,17,17,0.22)]"
                  draggable={false}
                />
              </div>
            </div>

            {!profile && (
              <div className="box px-4 py-3 bg-sun/35 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-bold">
                  Sign in with your participant name to track your 0–100 score and send it to your Hub rating once unlocked!
                </span>
                <button type="button" onClick={() => openAccount(null)} className="btn bg-ink text-sun text-xs">
                  Sign in / Register
                </button>
              </div>
            )}

            {claimFlash && (
              <div className="border-[3px] border-ink rounded-xl bg-neon px-4 py-3 font-mono text-xs sm:text-sm font-extrabold shadow-b4">
                ✓ {claimFlash}
              </div>
            )}
          </>
        )}

        {/* Active Game Stage OR Tab View */}
        {activeStop ? (
          renderActiveGame()
        ) : tab === 'essentials' ? (
          <ErasmusEssentials onStartJourney={() => setTab('map')} />
        ) : tab === 'results' ? (
          <ErasmusResults
            progress={progress}
            claimOpen={erasmusSettings.claimOpen}
            profile={profile}
            claimBusy={claimBusy}
            onClaimToRating={handleClaimToRating}
            onSignIn={() => openAccount(null)}
            onOpenStop={openStop}
            onBackToMap={() => setTab('map')}
          />
        ) : (
          <JourneyMap
            progress={progress}
            claimOpen={erasmusSettings.claimOpen}
            profile={profile}
            claimBusy={claimBusy}
            onClaimToRating={handleClaimToRating}
            onSignIn={() => openAccount(null)}
            onOpenStop={openStop}
            onOpenEssentials={() => setTab('essentials')}
            onOpenResults={() => setTab('results')}
          />
        )}
      </div>
    </>
  );
}
