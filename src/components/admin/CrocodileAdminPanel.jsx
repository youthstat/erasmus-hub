import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CROCODILE_CATEGORIES } from '../../data/crocodileWords.js';
import { addCrocodilePhrase, deleteCrocodilePhrase, subscribeCrocodilePhrases } from '../../firebase/crocodile.js';
import { CROCODILE_STICKERS } from '../../assets/crocodile/index.js';

export default function CrocodileAdminPanel() {
  const { setError } = useApp();
  const [customPhrases, setCustomPhrases] = useState([]);
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState(CROCODILE_CATEGORIES[0].id);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => subscribeCrocodilePhrases(setCustomPhrases, (e) => setError(e.message)), [setError]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setOk('');
    setMsg('');
    try {
      await addCrocodilePhrase({ text, categoryId });
      setText('');
      setOk('Phrase added to the Crocodile deck!');
    } catch (err) {
      setMsg(err.message || 'Could not save phrase.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="box overflow-hidden bg-white">
        <div className="bg-[#00E676] text-ink border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <img src={CROCODILE_STICKERS.actItOut} alt="" className="w-8 h-8 object-contain" draggable={false} />
            <span>Add Custom Crocodile Word / Phrase</span>
          </span>
          <span className="tag bg-white text-ink">{customPhrases.length} custom</span>
        </div>

        <form onSubmit={submit} className="p-4 bg-paper grid sm:grid-cols-12 gap-3 items-end">
          <label className="sm:col-span-6 flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Word or phrase *</span>
            <input
              className="input !shadow-none !py-2"
              placeholder="e.g. Midnight Pancake Challenge"
              maxLength={120}
              value={text}
              onChange={(e) => { setText(e.target.value); setOk(''); setMsg(''); }}
            />
          </label>
          <label className="sm:col-span-4 flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Category</span>
            <select
              className="input !shadow-none !py-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {CROCODILE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy || !text.trim()} className="btn bg-[#FFE600] text-ink w-full !py-2.5 text-xs disabled:opacity-50">
              {busy ? '…' : '+ Add'}
            </button>
          </div>
          {(ok || msg) && (
            <div className="sm:col-span-12">
              {ok && <span className="tag bg-neon text-ink">✓ {ok}</span>}
              {msg && <span className="font-mono text-xs font-bold text-hot">{msg}</span>}
            </div>
          )}
        </form>
      </section>

      <section className="box overflow-hidden bg-white">
        <div className="bg-ink text-white px-4 py-2.5 font-mono text-xs font-bold uppercase">
          Built-in &amp; Custom Deck Overview
        </div>
        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-paper">
          {CROCODILE_CATEGORIES.map((c) => {
            const extra = customPhrases.filter((p) => p.categoryId === c.id).length;
            return (
              <div key={c.id} className="border-[3px] border-ink rounded-xl bg-white p-3 flex items-center justify-between gap-2 shadow-b2">
                <div className="min-w-0">
                  <div className="font-extrabold text-sm uppercase truncate">{c.title}</div>
                  <div className="font-mono text-[11px] text-mute">
                    {c.phrases.length} built-in {extra > 0 ? `+ ${extra} custom` : ''}
                  </div>
                </div>
                <span className="tag bg-[#FFE600] text-ink shrink-0">{c.phrases.length + extra}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="box overflow-hidden bg-white">
        <div className="bg-[#FFE600] text-ink border-b-[3px] border-ink px-4 py-2.5 font-mono text-xs font-extrabold uppercase">
          Custom Phrases ({customPhrases.length})
        </div>
        <div className="divide-y-2 divide-ink/15">
          {customPhrases.map((p) => {
            const cat = CROCODILE_CATEGORIES.find((c) => c.id === p.categoryId);
            return (
              <div key={p.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-bold text-sm uppercase break-words">{p.text}</span>
                  <span className="ml-2 tag bg-paper text-ink !text-[10px]">{cat?.title || p.categoryId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCrocodilePhrase(p.id).catch((e) => setError(e.message))}
                  className="tag bg-hot text-white shrink-0 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            );
          })}
          {customPhrases.length === 0 && (
            <p className="p-4 font-mono text-xs text-mute">No custom phrases yet. All built-in categories already have 24–30 cards each.</p>
          )}
        </div>
      </section>
    </div>
  );
}
