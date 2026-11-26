import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function MediaLinkAdminPanel() {
  const { hubSettings, saveHubSettings } = useApp();
  const [url, setUrl] = useState(hubSettings?.mediaUploadUrl || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    setUrl(hubSettings?.mediaUploadUrl || '');
  }, [hubSettings?.mediaUploadUrl]);

  const cleanHref = (() => {
    const s = String(url || '').trim();
    if (!s) return '';
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
  })();

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    setOk('');
    try {
      const next = cleanHref;
      await saveHubSettings({ mediaUploadUrl: next });
      setUrl(next);
      setOk(next ? 'Photo & Video link saved! Participants can open it from the top bar now.' : 'Link cleared.');
    } catch (err) {
      setMsg(err.message || 'Could not save link.');
    } finally {
      setBusy(false);
    }
  };

  const clearLink = async () => {
    setBusy(true);
    setMsg('');
    setOk('');
    try {
      await saveHubSettings({ mediaUploadUrl: '' });
      setUrl('');
      setOk('Link cleared — participants see the "coming soon" message.');
    } catch (err) {
      setMsg(err.message || 'Could not clear link.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="box overflow-hidden bg-white">
      <div className="bg-neon border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
        <span>📷 Photo &amp; Video upload folder link</span>
        <span className={`tag ${hubSettings?.mediaUploadUrl ? 'bg-ink text-white' : 'bg-white text-ink'}`}>
          {hubSettings?.mediaUploadUrl ? 'ACTIVE LINK' : 'NOT SET YET'}
        </span>
      </div>

      <form onSubmit={save} className="p-4 sm:p-6 bg-paper flex flex-col gap-4">
        <p className="text-sm font-medium">
          Paste the Google Drive, iCloud, Dropbox, OneDrive or Telegram folder link where participants should upload their photos and videos. The <b>Photo &amp; Video</b> button in the top bar will open this link directly.
        </p>

        <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
          <span>Shared folder URL</span>
          <input
            type="text"
            className="input !shadow-none"
            placeholder="https://drive.google.com/drive/folders/..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); setOk(''); setMsg(''); }}
          />
        </label>

        {msg && <p className="font-mono text-xs font-bold text-hot">{msg}</p>}
        {ok && <p className="border-2 border-ink rounded-xl bg-neon px-3 py-2 font-mono text-xs font-bold">{ok}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" disabled={busy} className="btn bg-sun text-ink text-xs disabled:opacity-50">
            {busy ? 'Saving…' : '💾 Save link'}
          </button>
          {cleanHref && (
            <a
              href={cleanHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-ink text-xs"
            >
              Test link ↗
            </a>
          )}
          {hubSettings?.mediaUploadUrl && (
            <button
              type="button"
              disabled={busy}
              onClick={clearLink}
              className="btn bg-hot text-white text-xs disabled:opacity-50"
            >
              ✕ Clear link
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
