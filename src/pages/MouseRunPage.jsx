import { useEffect, useState } from 'react';
import Marquee from '../components/layout/Marquee.jsx';
import Header from '../components/layout/Header.jsx';
import { Banner } from '../components/games/RulesBits.jsx';
import Game2048 from '../components/games/Game2048.jsx';
import { useApp } from '../context/AppContext.jsx';
import { PRIZES_2048, save2048Score, subscribe2048Config, subscribe2048Scores } from '../firebase/game2048.js';
import { countryOf } from '../hooks/useGame.js';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function MouseRunPage() {
  const { profile, openAccount, setError } = useApp();
  const [scores, setScores] = useState([]);
  const [config, setConfig] = useState({ awarded: false, winners: [] });

  useEffect(() => {
    const onErr = (e) => setError(e.message);
    const offs = [subscribe2048Scores(setScores, onErr), subscribe2048Config(setConfig, onErr)];
    return () => offs.forEach((o) => o());
  }, [setError]);

  const top3 = scores.slice(0, 3);
  const myRank = profile ? scores.findIndex((s) => s.userId === profile.id) + 1 : 0;
  const myEntry = profile ? scores.find((s) => s.userId === profile.id) : null;
  const hasMore = scores.length > 3;
  const meOutsideTop3 = !!profile && myRank > 3;
  const meUnranked = !!profile && !myEntry;

  const renderRow = (entry, rankNum, isMe, medal = null) => (
    <div
      key={entry.userId}
      className={`px-3.5 py-1.5 flex items-center justify-between gap-2 text-xs sm:text-sm ${
        isMe ? 'bg-sun/45 font-extrabold' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-mono font-extrabold text-xs shrink-0 w-9">
          {medal ? `${medal} #${rankNum}` : `#${rankNum}`}
        </span>
        <span className="font-bold uppercase truncate">{entry.userName}</span>
        {isMe && <span className="font-mono text-[10px] font-extrabold uppercase text-cobalt shrink-0">· You</span>}
      </div>
      <span className="font-mono font-extrabold tabular-nums shrink-0 text-xs sm:text-sm">
        {entry.bestScore.toLocaleString('en-US')}
      </span>
    </div>
  );

  return (
    <>
      <Marquee className="bg-neon text-ink" items={['RATTIE 2048', 'MERGE TILES · BEAT THE RECORD', 'TOP 3 WIN +500 / +200 / +100 PTS']} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col gap-5">
        <Header back />

        {/* 1. Intro Banner with animated mouse at the top */}
        <Banner title="Rattie 2048" cls="bg-[#B89CFF] text-ink" frames={['play2048_1', 'play2048_2', 'play2048_3', 'play2048_4']}>
          Slide &amp; merge matching tiles to reach 2048! Your best score counts — Top 3 win +{PRIZES_2048.join(' / +')} PTS.
        </Banner>

        {!profile && (
          <div className="box px-4 py-2.5 max-w-md w-full mx-auto flex items-center justify-between gap-3">
            <p className="font-medium text-xs sm:text-sm">Sign in to save your best score for Top 3!</p>
            <button className="btn bg-[#B89CFF] text-ink text-xs shrink-0 px-3 py-1.5" onClick={() => openAccount(null)}>Sign in</button>
          </div>
        )}

        {/* 2. The 2048 Game */}
        <Game2048
          signedIn={!!profile}
          serverBest={myEntry?.bestScore || 0}
          onSignIn={() => openAccount(null)}
          onSaveScore={(score) => save2048Score(profile, score, countryOf(profile))}
        />

        {/* 3. Compact Top Runners list at the bottom (max 5 lines: Top 3 + ... + current player's place) */}
        <section className="box shadow-b6 overflow-hidden max-w-md w-full mx-auto">
          <div className="bg-[#B89CFF] text-ink border-b-[3px] border-ink px-3.5 py-2 flex items-center justify-between gap-2 font-mono text-xs font-extrabold uppercase">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">🏆</span>
              <span>Top runners</span>
            </span>
            {config.awarded ? (
              <span className="tag bg-white text-ink !text-[10px]">PRIZES AWARDED ✓</span>
            ) : (
              <span className="text-[10px] font-bold text-ink/85">+{PRIZES_2048.join(' / +')} PTS</span>
            )}
          </div>

          <div className="divide-y-2 divide-ink/15 bg-white">
            {top3.length === 0 && (
              <div className="px-3.5 py-2 font-mono text-xs text-mute">No scores yet — play to be #1!</div>
            )}

            {top3.map((entry, idx) =>
              renderRow(entry, idx + 1, !!(profile && entry.userId === profile.id), MEDALS[idx]),
            )}

            {/* If current player is #4, show them right after #3 and ellipsis if there are #5+ */}
            {meOutsideTop3 && myRank === 4 && (
              <>
                {renderRow(myEntry, 4, true)}
                {scores.length > 4 && (
                  <div className="px-3.5 py-1 text-center font-mono text-xs font-extrabold text-mute tracking-widest leading-none bg-paper">
                    •••
                  </div>
                )}
              </>
            )}

            {/* If current player is #5+, show ellipsis on line 4 and player's place on line 5 */}
            {meOutsideTop3 && myRank > 4 && (
              <>
                <div className="px-3.5 py-1 text-center font-mono text-xs font-extrabold text-mute tracking-widest leading-none bg-paper">
                  •••
                </div>
                {renderRow(myEntry, myRank, true)}
              </>
            )}

            {/* If current player is in Top 3 or guest, and there are more than 3 players, show ellipsis */}
            {!meOutsideTop3 && !meUnranked && hasMore && (
              <div className="px-3.5 py-1 text-center font-mono text-xs font-extrabold text-mute tracking-widest leading-none bg-paper">
                •••
              </div>
            )}

            {/* If signed in with no score yet, show ellipsis (if >3) and their unranked line */}
            {meUnranked && (
              <>
                {hasMore && (
                  <div className="px-3.5 py-1 text-center font-mono text-xs font-extrabold text-mute tracking-widest leading-none bg-paper">
                    •••
                  </div>
                )}
                <div className="px-3.5 py-1.5 flex items-center justify-between gap-2 text-xs sm:text-sm bg-sun/35 font-extrabold">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-extrabold text-xs shrink-0 w-9 text-mute">—</span>
                    <span className="font-bold uppercase truncate">{profile.name}</span>
                    <span className="font-mono text-[10px] font-extrabold uppercase text-cobalt shrink-0">· You</span>
                  </div>
                  <span className="font-mono font-extrabold tabular-nums shrink-0 text-xs sm:text-sm text-mute">0</span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
