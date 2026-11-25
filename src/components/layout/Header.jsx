import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalShell from '../modals/ModalShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { MEDIA_UPLOAD_URL } from '../../config/settings.js';

const UploadArrow = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 20h16" />
  </svg>
);

export default function Header({ back }) {
  const { isAdmin, profile, openAccount, homeHidden } = useApp();
  const [mediaNotice, setMediaNotice] = useState(false);
  const showAsk = isAdmin || !homeHidden?.ask;

  const chipCls = 'btn !px-2.5 sm:!px-3 !py-1.5 text-[11px] sm:text-xs shrink-0 whitespace-nowrap';

  const mediaButton = MEDIA_UPLOAD_URL ? (
    <a
      href={MEDIA_UPLOAD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Photo & Video"
      title="Photo & Video"
      className={`${chipCls} bg-neon text-ink`}
    >
      <UploadArrow />
      <span className="hidden sm:inline">Photo &amp; Video</span>
    </a>
  ) : (
    <button
      type="button"
      onClick={() => setMediaNotice(true)}
      aria-label="Photo & Video"
      title="Photo & Video"
      className={`${chipCls} bg-neon text-ink`}
    >
      <UploadArrow />
      <span className="hidden sm:inline">Photo &amp; Video</span>
    </button>
  );

  const profileButton = profile ? (
    <button
      onClick={() => openAccount(null)}
      title={`${profile.name} · ${(profile.score ?? 0).toLocaleString('en-US')} PTS`}
      className="btn !px-2.5 sm:!px-3.5 !py-1.5 bg-white text-ink font-mono flex items-center gap-1.5 max-w-[140px] sm:max-w-[260px] min-w-0 !normal-case"
    >
      <span className="shrink-0 text-sm">👤</span>
      <span className="truncate text-[13px] sm:text-sm font-extrabold tracking-tight">{profile.name}</span>
      <span className="hidden sm:inline shrink-0 text-xs font-bold text-mute">· {(profile.score ?? 0).toLocaleString('en-US')}</span>
    </button>
  ) : (
    <button className={`${chipCls} bg-sun text-ink`} onClick={() => openAccount(null)}>
      <span>Sign in</span>
      <span className="hidden sm:inline">/ Register</span>
    </button>
  );

  return (
    <>
      <header className="flex flex-nowrap items-center justify-between gap-2 sm:gap-3 mb-5 sm:mb-7 min-w-0">
        {/* Left side: Back to Home on subpages; Home badge ONLY on Home page */}
        <div className="flex items-center gap-2 shrink-0">
          {back ? (
            <Link to="/" aria-label="Back to Home" className={`${chipCls} bg-white text-ink`}>
              <span>←</span>
              <span className="hidden sm:inline">Home</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 border-[3px] border-ink bg-cobalt text-white rounded-xl px-3 py-1.5 shadow-b4 font-mono font-extrabold uppercase text-xs shrink-0">
              <span className="inline-block w-2 h-2 bg-sun border border-ink" />
              <span>Home</span>
            </span>
          )}
        </div>

        {/* Right side: Help, Photo & Video, and Profile / Sign in */}
        <div className="flex flex-nowrap items-center justify-end gap-1.5 sm:gap-2 min-w-0">
          {showAsk && (
            <Link to="/ask" className={`${chipCls} bg-hot text-white`}>
              Help
            </Link>
          )}
          {mediaButton}
          {profileButton}
        </div>
      </header>

      {mediaNotice && (
        <ModalShell title="Photo & Video Upload" maxW="max-w-md" onClose={() => setMediaNotice(false)}>
          <div className="flex flex-col gap-3 text-center items-center">
            <div className="w-12 h-12 rounded-xl border-[3px] border-ink bg-neon flex items-center justify-center shadow-b4">
              <UploadArrow />
            </div>
            <h3 className="text-xl font-extrabold uppercase">Shared folder coming soon!</h3>
            <p className="text-sm font-medium">
              The organizers will add the shared folder link here soon so everyone can upload their photos and videos from the exchange.
            </p>
            <button type="button" className="btn bg-sun text-xs" onClick={() => setMediaNotice(false)}>Got it</button>
          </div>
        </ModalShell>
      )}
    </>
  );
}
