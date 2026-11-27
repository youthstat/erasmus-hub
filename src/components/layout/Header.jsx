import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalShell from '../modals/ModalShell.jsx';
import MouseAvatar from '../ui/MouseAvatar.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { formatScore } from '../../utils/format.js';
import { ERASMUS_STICKERS } from '../../assets/erasmus/index.js';

function normalizeExternalUrl(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

const UploadCamera = () => (
  <img src={ERASMUS_STICKERS.camera} alt="" className="w-4 h-4 sm:w-5 sm:h-5 object-contain shrink-0" draggable={false} />
);

const MsgIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Header({ back }) {
  const { isAdmin, profile, openAccount, homeHidden, hubSettings, unreadSfMessages } = useApp();
  const [mediaNotice, setMediaNotice] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const msgWrapRef = useRef(null);
  const navigate = useNavigate();

  const showAsk = isAdmin || !homeHidden?.ask;
  const mediaUrl = normalizeExternalUrl(hubSettings?.mediaUploadUrl);
  const unread = unreadSfMessages || [];

  useEffect(() => {
    if (!msgOpen) return undefined;
    const onDown = (e) => {
      if (msgWrapRef.current && !msgWrapRef.current.contains(e.target)) setMsgOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMsgOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [msgOpen]);

  useEffect(() => {
    if (unread.length === 0 && msgOpen) setMsgOpen(false);
  }, [unread.length, msgOpen]);

  const chipCls = 'btn !px-2.5 sm:!px-3 !py-1.5 text-[11px] sm:text-xs shrink-0 whitespace-nowrap';

  const mediaButton = mediaUrl ? (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Photo & Video"
      title="Photo & Video"
      className={`${chipCls} bg-neon text-ink`}
    >
      <UploadCamera />
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
      <UploadCamera />
      <span className="hidden sm:inline">Photo &amp; Video</span>
    </button>
  );

  const messageButton = profile && unread.length > 0 ? (
    <div ref={msgWrapRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setMsgOpen((v) => !v)}
        aria-label={`${unread.length} unread message${unread.length === 1 ? '' : 's'}`}
        title="Unread messages"
        className="btn !px-2 sm:!px-2.5 !py-1.5 bg-sun text-ink relative shrink-0"
      >
        <MsgIcon />
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-hot text-white border-2 border-ink font-mono text-[10px] font-extrabold leading-none">
          {unread.length}
        </span>
      </button>

      {msgOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] border-[3px] border-ink rounded-2xl bg-white shadow-b6 overflow-hidden z-50">
          <div className="bg-sun border-b-[3px] border-ink px-3.5 py-2 flex items-center justify-between gap-2 font-mono text-xs font-extrabold uppercase">
            <span>New messages ({unread.length})</span>
            <button type="button" onClick={() => setMsgOpen(false)} aria-label="Close messages" className="text-ink hover:opacity-70">✕</button>
          </div>
          <div className="divide-y-2 divide-ink/15 max-h-72 overflow-y-auto bg-paper">
            {unread.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMsgOpen(false);
                  navigate(m.to);
                }}
                className="w-full text-left px-3.5 py-2.5 bg-white hover:bg-sun/25 transition-colors flex flex-col gap-1 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-extrabold uppercase text-ink flex items-center gap-1">
                    <span aria-hidden="true">{m.icon}</span>
                    <span>{m.from}</span>
                  </span>
                  <span className="font-mono text-[10px] font-extrabold uppercase text-cobalt shrink-0">Open chat →</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-ink line-clamp-2">“{m.text}”</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : null;

  const profileButton = profile ? (
    <button
      onClick={() => openAccount(null)}
      title={`${profile.name} · ${formatScore(profile.score)} PTS`}
      className="btn !px-2.5 sm:!px-3.5 !py-1.5 bg-white text-ink font-mono flex items-center gap-1.5 max-w-[145px] sm:max-w-[260px] min-w-0 !normal-case"
    >
      <MouseAvatar user={profile} size="w-5 h-5" rounded="rounded-md" border="border-[1.5px] border-ink" />
      <span className="truncate text-[13px] sm:text-sm font-extrabold tracking-tight">{profile.name}</span>
      <span className="hidden sm:inline shrink-0 text-xs font-bold text-mute">· {formatScore(profile.score)}</span>
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

        {/* Right side: Help, Photo & Video, Unread Messages, and Profile / Sign in */}
        <div className="flex flex-nowrap items-center justify-end gap-1.5 sm:gap-2 min-w-0">
          {showAsk && (
            <Link to="/ask" className={`${chipCls} bg-hot text-white flex items-center gap-1`}>
              <img src={ERASMUS_STICKERS.lifebuoy} alt="" className="w-4 h-4 object-contain shrink-0" draggable={false} />
              <span>Help</span>
            </Link>
          )}
          {mediaButton}
          {messageButton}
          {profileButton}
        </div>
      </header>

      {mediaNotice && (
        <ModalShell title="Photo & Video Upload" maxW="max-w-md" onClose={() => setMediaNotice(false)}>
          <div className="flex flex-col gap-3 text-center items-center">
            <div className="w-12 h-12 rounded-xl border-[3px] border-ink bg-neon flex items-center justify-center shadow-b4">
              <UploadCamera />
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
