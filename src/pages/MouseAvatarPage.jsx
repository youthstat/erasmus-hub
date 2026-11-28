import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from '../components/layout/Marquee.jsx';
import Header from '../components/layout/Header.jsx';
import MouseAvatar from '../components/ui/MouseAvatar.jsx';
import { useApp } from '../context/AppContext.jsx';
import {
  COSTUMES,
  COSTUME_BY_ID,
  COSTUME_CATEGORIES,
  FREE_COSTUME_COUNT,
  MOUSE_BACKGROUNDS,
  nextCostumePrice,
} from '../config/costumes.js';
import { isCostumeUnlocked } from '../firebase/mouseAvatar.js';
import { formatScore } from '../utils/format.js';
import { HUB_STICKERS } from '../assets/stickers/index.js';

export default function MouseAvatarPage() {
  const { profile, wallet2048, openAccount, saveMouseLook, buyMouseCostume } = useApp();

  const savedCostume = profile?.avatarCostume || 'plain';
  const savedBg = profile?.avatarBg || '#FFE600';
  const ownedList = useMemo(
    () => (Array.isArray(profile?.ownedCostumes) ? profile.ownedCostumes : []),
    [profile?.ownedCostumes],
  );
  const ownedPaidCount = useMemo(
    () => ownedList.filter((id) => {
      const c = COSTUME_BY_ID.get(id);
      return c && !c.free;
    }).length,
    [ownedList],
  );

  const [selectedId, setSelectedId] = useState(savedCostume);
  const [bgColor, setBgColor] = useState(savedBg);
  const [cat, setCat] = useState('all');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    setSelectedId(savedCostume);
    setBgColor(savedBg);
  }, [savedCostume, savedBg]);

  const selected = COSTUME_BY_ID.get(selectedId) || COSTUMES[0];
  const unlocked = isCostumeUnlocked(selected.id, ownedList);
  const isEquipped = !!profile && savedCostume === selected.id && savedBg.toLowerCase() === bgColor.toLowerCase();

  const nextPrice = nextCostumePrice(ownedPaidCount);
  const hubScore = typeof profile?.score === 'number' && Number.isFinite(profile.score) ? profile.score : 0;
  const canAffordHub = !!profile && hubScore >= nextPrice.pts;
  const canAfford2048 = !!profile && wallet2048 >= nextPrice.game2048;

  const filteredCostumes = useMemo(() => {
    if (cat === 'all') return COSTUMES;
    if (cat === 'owned') return COSTUMES.filter((c) => isCostumeUnlocked(c.id, ownedList));
    return COSTUMES.filter((c) => c.cat === cat);
  }, [cat, ownedList]);

  const selectCostume = (id) => {
    setSelectedId(id);
    setMsg('');
    setOk('');
  };

  const handleSaveLook = async (targetCostumeId = selected.id) => {
    if (!profile) return openAccount(null);
    setBusy(true);
    setMsg('');
    setOk('');
    try {
      await saveMouseLook({ costumeId: targetCostumeId, bgColor });
      const label = COSTUME_BY_ID.get(targetCostumeId)?.name || 'Mouse';
      setSelectedId(targetCostumeId);
      setOk(`Saved "${label}"!`);
    } catch (err) {
      setMsg(err.message || 'Could not save avatar.');
    }
    setBusy(false);
  };

  const handleBuy = async (currency) => {
    if (!profile) return openAccount(null);
    setBusy(true);
    setMsg('');
    setOk('');
    try {
      const res = await buyMouseCostume({
        costumeId: selected.id,
        currency,
        bgColor,
      });
      if (res.price === 0) {
        setOk(`Unlocked "${res.costume.name}"!`);
      } else {
        const spent =
          res.currency === 'game2048'
            ? ` (${res.price.toLocaleString('en-US')} Outfit Coins)`
            : ` (${res.price} PTS)`;
        setOk(`Unlocked "${res.costume.name}"${spent}!`);
      }
    } catch (err) {
      setMsg(err.message || 'Could not unlock outfit.');
    }
    setBusy(false);
  };

  return (
    <>
      <Marquee
        className="bg-[#FF94B8] text-ink"
        items={['CUSTOMIZE YOUR MOUSE', 'PICK OUTFIT & BACKGROUND', 'BUY WITH HUB PTS OR OUTFIT COINS']}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
        <Header back />

        {/* Compact header + balances */}
        <section className="box p-3 sm:p-4 bg-[#FF94B8] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={HUB_STICKERS.wardrobeBanner}
              alt="Wardrobe"
              draggable={false}
              className="h-12 sm:h-14 w-auto object-contain shrink-0 drop-shadow-[0_2px_0_rgba(17,17,17,0.2)]"
            />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-extrabold uppercase leading-none tracking-tight">Customize my mouse</h1>
              <p className="font-mono text-[11px] sm:text-xs font-bold mt-1">
                {FREE_COSTUME_COUNT} classic looks free · {COSTUMES.length - FREE_COSTUME_COUNT} outfits to unlock · earn 100 Outfit Coins for every +1 Hub PT!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            <div className="border-[2.5px] border-ink rounded-xl bg-sun px-2.5 py-1.5 sm:px-3.5 sm:py-2">
              <div className="font-mono text-[9px] sm:text-[10px] font-extrabold uppercase text-ink/75">Hub PTS</div>
              <div className="text-sm sm:text-lg font-extrabold tabular-nums leading-tight">
                {profile ? formatScore(profile.score) : '—'}
              </div>
            </div>
            <div className="border-[2.5px] border-ink rounded-xl bg-[#B89CFF] px-2.5 py-1.5 sm:px-3.5 sm:py-2">
              <div className="font-mono text-[9px] sm:text-[10px] font-extrabold uppercase text-ink/80">Outfit Coins</div>
              <div className="text-sm sm:text-lg font-extrabold tabular-nums leading-tight">
                {profile ? wallet2048.toLocaleString('en-US') : '—'}
              </div>
            </div>
            <div className="border-[2.5px] border-ink rounded-xl bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2">
              <div className="font-mono text-[9px] sm:text-[10px] font-extrabold uppercase text-mute">Next price</div>
              <div className="text-xs sm:text-sm font-extrabold tabular-nums leading-tight">
                {nextPrice.pts} / {nextPrice.game2048.toLocaleString('en-US')}
              </div>
            </div>
          </div>
        </section>

        {!profile && (
          <div className="box p-3 sm:p-4 bg-white flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium text-xs sm:text-sm">Sign in or register to save your mouse look and unlock new costumes.</p>
            <button type="button" className="btn bg-neon text-ink text-xs" onClick={() => openAccount(null)}>
              Sign in / Register
            </button>
          </div>
        )}

        {/* Side-by-side at ALL breakpoints so the live mouse preview stays pinned beside the outfits */}
        <div className="grid grid-cols-12 gap-2.5 sm:gap-5 items-start">
          {/* Left: Sticky Live Preview Studio */}
          <aside className="col-span-5 md:col-span-5 lg:col-span-4 sticky top-2 sm:top-4 box shadow-b6 sm:shadow-b8 overflow-hidden bg-white">
            <div className="bg-ink text-white px-2.5 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs font-extrabold uppercase flex items-center justify-between gap-1.5">
              <span className="truncate">Preview</span>
              {isEquipped ? (
                <span className="tag bg-neon text-ink !text-[9px] sm:!text-[10px] !px-1.5 !py-0.5 shrink-0">EQUIPPED ✓</span>
              ) : unlocked ? (
                <span className="tag bg-sun text-ink !text-[9px] sm:!text-[10px] !px-1.5 !py-0.5 shrink-0">{selected.free ? 'FREE' : 'OWNED'}</span>
              ) : (
                <span className="tag bg-[#FF94B8] text-ink !text-[9px] sm:!text-[10px] !px-1.5 !py-0.5 shrink-0">LOCKED</span>
              )}
            </div>

            <div className="p-2.5 sm:p-5 bg-paper flex flex-col items-center text-center gap-2.5 sm:gap-3.5">
              <MouseAvatar
                costumeId={selected.id}
                bgColor={bgColor}
                name={profile?.name || selected.name}
                size="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44"
                rounded="rounded-xl sm:rounded-2xl"
                className="shadow-b4 sm:shadow-b6"
              />

              <div className="w-full min-w-0">
                <h2 className="text-xs sm:text-xl md:text-2xl font-extrabold uppercase leading-tight break-words">{selected.name}</h2>
                <p className="font-mono text-[10px] sm:text-xs font-bold text-mute mt-0.5 leading-snug">
                  {unlocked
                    ? 'Ready as your avatar'
                    : `${nextPrice.pts} PTS or ${nextPrice.game2048.toLocaleString('en-US')} Coins`}
                </p>
              </div>

              {/* Background swatches + custom color picker */}
              <div className="w-full border-[2.5px] sm:border-[3px] border-ink rounded-xl bg-white p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
                <div className="font-mono text-[9px] sm:text-[11px] font-extrabold uppercase text-left flex items-center justify-between gap-1">
                  <span className="truncate">Background</span>
                  <span className="text-mute hidden sm:inline truncate">
                    {MOUSE_BACKGROUNDS.find((b) => b.hex.toLowerCase() === bgColor.toLowerCase())?.label || bgColor.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {MOUSE_BACKGROUNDS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      title={b.label}
                      aria-label={b.label}
                      onClick={() => { setBgColor(b.hex); setMsg(''); setOk(''); }}
                      className={`w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg border-2 border-ink transition-transform ${
                        bgColor.toLowerCase() === b.hex.toLowerCase() ? 'scale-110 ring-2 ring-ink ring-offset-1' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: b.hex }}
                    />
                  ))}
                  <label
                    title="Pick any custom background color"
                    className="h-5 sm:h-7 px-1.5 sm:px-2 rounded-md sm:rounded-lg border-2 border-ink bg-paper hover:bg-sun/40 font-mono text-[9px] sm:text-[10px] font-extrabold uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="color"
                      aria-label="Custom background color"
                      value={/^#[0-9a-fA-F]{6}$/.test(bgColor) ? bgColor : '#FFE600'}
                      onChange={(e) => { setBgColor(e.target.value.toUpperCase()); setMsg(''); setOk(''); }}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 p-0 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="hidden sm:inline">Custom</span>
                  </label>
                </div>
              </div>

              {msg && (
                <div className="w-full border-2 border-ink rounded-lg bg-hot text-white px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-left break-words">
                  {msg}
                </div>
              )}
              {ok && (
                <div className="w-full border-2 border-ink rounded-lg bg-neon text-ink px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-left break-words">
                  {ok}
                </div>
              )}

              {/* Actions */}
              <div className="w-full flex flex-col gap-1.5 sm:gap-2">
                {unlocked ? (
                  <button
                    type="button"
                    disabled={busy || isEquipped}
                    onClick={() => handleSaveLook(selected.id)}
                    className={`btn w-full !px-2 sm:!px-3 !py-1.5 sm:!py-2 text-[11px] sm:text-sm ${
                      isEquipped ? 'bg-white text-ink opacity-75 cursor-default' : 'bg-neon text-ink'
                    } disabled:opacity-60`}
                  >
                    {busy ? 'Saving…' : isEquipped ? '✓ Equipped' : '💾 Save avatar'}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={busy || !canAffordHub}
                      onClick={() => handleBuy('pts')}
                      className="btn bg-sun text-ink w-full !px-2 sm:!px-3 !py-1.5 sm:!py-2 text-[10px] sm:text-xs disabled:opacity-50"
                    >
                      {busy ? '…' : `Buy ${nextPrice.pts} PTS`}
                    </button>
                    <button
                      type="button"
                      disabled={busy || !canAfford2048}
                      onClick={() => handleBuy('game2048')}
                      className="btn bg-[#B89CFF] text-ink w-full !px-2 sm:!px-3 !py-1.5 sm:!py-2 text-[10px] sm:text-xs disabled:opacity-50"
                    >
                      {busy ? '…' : `Buy ${nextPrice.game2048.toLocaleString('en-US')} Coins`}
                    </button>
                    {profile && !canAffordHub && !canAfford2048 && (
                      <div className="flex flex-col gap-0.5">
                        <Link to="/erasmus-plus" className="font-mono text-[10px] font-bold underline text-ink">
                          Earn +500/prompt in Stop 5 →
                        </Link>
                        <Link to="/mouse-run" className="font-mono text-[10px] font-bold underline text-ink/80">
                          Or play Rattie 2048 →
                        </Link>
                      </div>
                    )}
                  </>
                )}

                {selected.id !== 'plain' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => (profile ? handleSaveLook('plain') : selectCostume('plain'))}
                    className="btn bg-white text-ink w-full !px-2 !py-1 text-[10px] sm:text-xs"
                  >
                    Plain Mouse
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Right: Outfits Catalog Grid */}
          <div className="col-span-7 md:col-span-7 lg:col-span-8 flex flex-col gap-3 min-w-0">
            <div className="box p-2 sm:p-3 bg-white flex flex-wrap gap-1.5 sm:gap-2">
              {COSTUME_CATEGORIES.map((c) => {
                const active = cat === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCat(c.id)}
                    className={`border-2 border-ink rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 font-mono text-[10px] sm:text-xs font-extrabold uppercase transition flex items-center gap-1.5 cursor-pointer ${
                      active ? 'bg-ink text-white shadow-b2' : 'bg-paper text-ink hover:bg-sun/40'
                    }`}
                  >
                    {c.sticker && (
                      <img src={c.sticker} alt="" className="h-5 sm:h-6 w-auto object-contain shrink-0" draggable={false} />
                    )}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {filteredCostumes.map((c) => {
                const cUnlocked = isCostumeUnlocked(c.id, ownedList);
                const cEquipped = !!profile && savedCostume === c.id;
                const cSelected = selected.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCostume(c.id)}
                    className={`border-[2.5px] sm:border-[3px] border-ink rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center text-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-w-0 ${
                      cSelected
                        ? 'bg-sun shadow-b4 sm:shadow-b6 -translate-y-0.5'
                        : cEquipped
                          ? 'bg-neon/35 shadow-b4 hover:-translate-y-0.5'
                          : 'bg-white shadow-b4 hover:-translate-y-0.5 hover:bg-paper'
                    }`}
                  >
                    <MouseAvatar
                      costumeId={c.id}
                      bgColor={bgColor}
                      name={c.name}
                      size="w-14 h-14 sm:w-20 sm:h-20"
                      rounded="rounded-lg sm:rounded-xl"
                      border="border-2 sm:border-[3px] border-ink"
                    />
                    <div className="font-extrabold text-[11px] sm:text-xs uppercase leading-tight break-words w-full">
                      {c.name}
                    </div>
                    {cEquipped ? (
                      <span className="tag bg-neon text-ink !text-[9px] sm:!text-[10px] !px-1.5 !py-0.5">EQUIPPED</span>
                    ) : cUnlocked ? (
                      <span className="tag bg-white text-ink !text-[9px] sm:!text-[10px] !px-1.5 !py-0.5">{c.free ? 'FREE' : 'OWNED'}</span>
                    ) : (
                      <span className="tag bg-ink text-white !text-[9px] sm:!text-[10px] !px-1.5 !py-0.5">
                        {nextPrice.pts} PTS · {nextPrice.game2048.toLocaleString('en-US')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
