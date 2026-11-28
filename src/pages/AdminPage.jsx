import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import MissionsSection from '../components/missions/MissionsSection.jsx';
import GossipsPanel from '../components/admin/GossipsPanel.jsx';
import HelpAdminPanel from '../components/admin/HelpAdminPanel.jsx';
import OscarAdminPanel from '../components/admin/OscarAdminPanel.jsx';
import ManualPoints from '../components/admin/ManualPoints.jsx';
import GamesAdminPanel from '../components/admin/GamesAdminPanel.jsx';
import PunishmentAdminPanel from '../components/admin/PunishmentAdminPanel.jsx';
import HomeControlPanel from '../components/admin/HomeControlPanel.jsx';
import HeistAdminPanel from '../components/admin/HeistAdminPanel.jsx';
import Game2048AdminPanel from '../components/admin/Game2048AdminPanel.jsx';
import ReflectionAdminPanel from '../components/admin/ReflectionAdminPanel.jsx';
import ActivityCenterPanel from '../components/admin/ActivityCenterPanel.jsx';
import MediaLinkAdminPanel from '../components/admin/MediaLinkAdminPanel.jsx';
import ErasmusAdminPanel from '../components/admin/ErasmusAdminPanel.jsx';
import CrocodileAdminPanel from '../components/admin/CrocodileAdminPanel.jsx';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function AdminPage() {
  const {
    isAdmin,
    logoutAdmin,
    allMissions,
    seedMissions,
    users,
    submissions,
    stealRequests,
    reflectionLogs,
    syncDemoAccounts,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const [syncFlash, setSyncFlash] = useState('');

  const pendingMissions = submissions.filter((s) => s.status === 'pending');
  const pendingSteals = stealRequests.filter((r) => r.status === 'pending');
  const totalPending = pendingMissions.length + pendingSteals.length;

  const activeId = searchParams.get('w') || null;
  const openWindow = (id) => {
    if (!id) {
      setSearchParams({});
    } else {
      setSearchParams({ w: id });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    if (!activeId) return undefined;
    const esc = (e) => e.key === 'Escape' && openWindow(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [activeId]);

  if (!isAdmin) return <Navigate to="/" replace />;

  const SECTIONS = [
    {
      group: 'Submissions, Points & Management',
      items: [
        { id: 'activity', label: 'Submissions & All Activity', badge: totalPending, cls: 'bg-sun text-ink', node: <ActivityCenterPanel /> },
        { id: 'points', label: 'Batch & Manual Points', cls: 'bg-neon text-ink', node: <ManualPoints /> },
        {
          id: 'missions',
          label: 'Missions',
          badge: allMissions.length,
          cls: 'bg-[#FFE200] text-ink',
          node: (
            <div className="flex flex-col gap-4">
              <MissionsSection />
              {allMissions.length === 0 && (
                <button className="btn bg-white self-start" onClick={seedMissions}>Load demo missions</button>
              )}
            </div>
          ),
        },
        { id: 'leaderboard', label: 'Participants & Leaderboard', badge: users.length, cls: 'bg-white text-ink', node: <LeaderboardTable /> },
        { id: 'media', label: 'Photo & Video Link', cls: 'bg-[#00E676] text-ink', node: <MediaLinkAdminPanel /> },
        { id: 'help', label: 'Ask the Team & Contacts', cls: 'bg-hot text-white', node: <HelpAdminPanel /> },
        { id: 'home', label: 'Home Screen', cls: 'bg-[#B89CFF] text-ink', node: <HomeControlPanel /> },
      ],
    },
    {
      group: 'Games & Activities (open window)',
      items: [
        { id: 'sf', label: 'Secret Friend', cls: 'bg-neon text-ink', node: <GamesAdminPanel mode="sf" /> },
        { id: 'kg', label: 'Killer Game', cls: 'bg-hot text-white', node: <GamesAdminPanel mode="kg" /> },
        { id: 'oscar', label: 'Oscar Night', cls: 'bg-ink text-white', node: <OscarAdminPanel /> },
        { id: 'punishment', label: 'Punishment Box', cls: 'bg-[#FF94B8] text-ink', node: <PunishmentAdminPanel /> },
        { id: 'game2048', label: 'Rattie 2048', cls: 'bg-[#B89CFF] text-ink', node: <Game2048AdminPanel /> },
        { id: 'heists', label: 'Rattie Heists', badge: pendingSteals.length, cls: 'bg-[#FF4B72] text-white', node: <HeistAdminPanel /> },
        { id: 'reflection', label: 'Daily Reflection', badge: reflectionLogs.length, cls: 'bg-cobalt text-white', node: <ReflectionAdminPanel /> },
        { id: 'crocodile', label: 'Crocodile Phrases', cls: 'bg-[#00E676] text-ink', node: <CrocodileAdminPanel /> },
        { id: 'erasmus', label: 'Erasmus+ Claims', cls: 'bg-[#FFE200] text-ink', node: <ErasmusAdminPanel /> },
        { id: 'gossips', label: 'Gossips & Board', cls: 'bg-[#FF6E2D] text-ink', node: <GossipsPanel /> },
      ],
    },
  ];

  const allItems = SECTIONS.flatMap((g) => g.items);
  const current = allItems.find((i) => i.id === activeId) || null;

  const handleSyncDemo = async () => {
    await syncDemoAccounts();
    setSyncFlash('Rattie Patty & Admin demo accounts synced (pw: 1234)!');
    setTimeout(() => setSyncFlash(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
      <Header back />

      {/* Top Bar */}
      <div className="box shadow-b8 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase">Admin panel</h1>
          <p className="font-mono text-xs text-mute mt-0.5">
            {current
              ? `Open window: ${current.label}`
              : 'Click any colored button below to open its own full window.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm font-bold">
          <span className="tag bg-sun">{users.length} participants</span>
          <span className="tag bg-neon">{allMissions.length} missions</span>
          {totalPending > 0 && <span className="tag bg-hot text-white">{totalPending} waiting</span>}
          <button type="button" className="tag bg-[#B89CFF] text-ink" onClick={handleSyncDemo}>
            🐭 Sync Demo Accounts
          </button>
          <button type="button" className="tag bg-hot text-white" onClick={logoutAdmin}>Exit admin</button>
        </div>
      </div>

      {syncFlash && (
        <div className="border-[3px] border-ink rounded-xl bg-neon px-4 py-2.5 font-mono text-xs font-bold shadow-b4">
          ✓ {syncFlash}
        </div>
      )}

      {/* Dedicated Full-Page Window View (normal page scroll on laptop — no cramped modal trap) */}
      {current ? (
        <div className="flex flex-col gap-4">
          {/* Window Switcher Bar */}
          <div className="box p-2.5 sm:p-3 bg-white flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openWindow(null)}
              className="btn bg-ink text-white !px-3 !py-1.5 text-xs shrink-0"
            >
              ← All windows
            </button>
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {allItems.map((item) => {
                const isActive = item.id === current.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openWindow(item.id)}
                    className={`border-2 border-ink rounded-lg px-2.5 py-1 font-mono text-[11px] font-extrabold uppercase flex items-center gap-1.5 transition cursor-pointer ${
                      isActive ? `${item.cls} shadow-b2 ring-2 ring-ink ring-offset-1` : 'bg-paper text-ink hover:bg-sun/35'
                    }`}
                  >
                    <span>{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="tag bg-white text-ink !text-[10px] !px-1 !py-0">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Open Window Container */}
          <section className="box shadow-b8 overflow-hidden bg-white">
            <div className="bg-[#FFE200] px-4 sm:px-6 py-3 border-b-[3px] border-ink flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-block w-3 h-3 bg-ink shrink-0" />
                <h2 className="font-mono font-extrabold text-sm sm:text-base tracking-wider uppercase truncate">
                  {current.label}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => openWindow(null)}
                aria-label="Close window"
                className="w-8 h-8 shrink-0 bg-[#FF4766] border-2 border-ink rounded-md text-white font-black text-sm flex items-center justify-center shadow-b2 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6 bg-paper">
              {current.node}
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* Pending Action Alert */}
          {totalPending > 0 && (
            <div className="border-[3px] border-ink rounded-2xl bg-hot text-white shadow-b6 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-xs sm:text-sm font-bold uppercase">
                ⚠ Waiting review: {pendingMissions.length} mission submission(s) · {pendingSteals.length} heist request(s)
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => openWindow('activity')} className="btn bg-sun text-ink !py-1.5 !px-3 text-xs">
                  Open Submissions &amp; Activity →
                </button>
                {pendingSteals.length > 0 && (
                  <button type="button" onClick={() => openWindow('heists')} className="btn bg-white text-ink !py-1.5 !px-3 text-xs">
                    Review Heists →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Colored Window Launcher Buttons (Submissions FIRST) */}
          {SECTIONS.map((section) => (
            <section key={section.group} className="box shadow-b6 overflow-hidden">
              <div className="bg-ink text-white px-4 py-2.5 font-mono text-xs font-bold uppercase">
                {section.group}
              </div>
              <div className="p-4 sm:p-5 bg-paper grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openWindow(item.id)}
                    className={`border-[3px] border-ink rounded-2xl px-4 py-4 shadow-b4 hover:-translate-y-0.5 hover:shadow-b6 active:translate-y-0 active:shadow-b2 transition-all flex items-center justify-between gap-2 text-left cursor-pointer ${item.cls}`}
                  >
                    <span className="font-extrabold uppercase text-sm sm:text-base leading-tight">{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="tag bg-white text-ink !text-[11px] shrink-0">{item.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
