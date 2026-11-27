import Marquee from '../components/layout/Marquee.jsx';
import Header from '../components/layout/Header.jsx';
import MissionsSection from '../components/missions/MissionsSection.jsx';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable.jsx';
import { useApp } from '../context/AppContext.jsx';
import { ERASMUS_STICKERS } from '../assets/erasmus/index.js';

export default function LeaderboardPage() {
  const { isAdmin, users } = useApp();
  return (
    <>
      <Marquee items={['LEADERBOARD', 'EARN POINTS IN MISSIONS & GAMES', `${users.length} PARTICIPANTS REGISTERED`]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        <Header back />
        <div className="box p-6 md:p-8 bg-[#f6f3f2]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight flex items-center gap-3">
            <img src={ERASMUS_STICKERS.diamond} alt="" className="w-8 h-8 object-contain shrink-0" draggable={false} />
            <span>Leaderboard</span>
          </h1>
          {isAdmin && <p className="tag bg-sun mt-3">ADMIN MODE: you can adjust scores and manage missions</p>}
        </div>
        <MissionsSection />
        <LeaderboardTable />
      </div>
    </>
  );
}
