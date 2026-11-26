import { COSTUME_BY_ID } from '../../config/costumes.js';
import { SPRITES } from '../mascot/sprites.js';

/**
 * Renders a participant's customized mouse avatar (either one of the separate costume PNGs,
 * a free classic hub mouse look, or a demo Rattie sprite) full-frame over the chosen background.
 */
export default function MouseAvatar({
  user = null,
  costumeId = null,
  bgColor = null,
  photoSprite = null,
  photo = null,
  name = '',
  size = 'w-12 h-12',
  rounded = 'rounded-xl',
  border = 'border-[3px] border-ink',
  className = '',
}) {
  const resolvedCostumeId = costumeId ?? user?.avatarCostume ?? null;
  const resolvedBg = bgColor ?? user?.avatarBg ?? '#FFE600';
  const resolvedSprite = photoSprite ?? user?.photoSprite ?? null;
  const costume = resolvedCostumeId ? COSTUME_BY_ID.get(resolvedCostumeId) : null;

  // 1. Selected costume or classic look (renders full-frame inside the square)
  if (costume?.img) {
    return (
      <div
        title={costume.name}
        className={`${size} ${rounded} ${border} overflow-hidden shrink-0 flex items-center justify-center ${className}`}
        style={{ backgroundColor: resolvedBg }}
      >
        <img
          src={costume.img}
          alt={name ? `${name} (${costume.name})` : costume.name}
          draggable={false}
          className="w-full h-full object-contain select-none"
        />
      </div>
    );
  }

  // 2. Demo sprite (e.g. Rattie Patty or Admin) if no custom costume has been saved
  if (resolvedSprite && SPRITES[resolvedSprite]) {
    return (
      <div
        className={`${size} ${rounded} ${border} overflow-hidden shrink-0 flex items-center justify-center ${className}`}
        style={{ backgroundColor: resolvedBg }}
      >
        <img
          src={SPRITES[resolvedSprite].src}
          alt={name || 'Mouse avatar'}
          draggable={false}
          className="w-full h-full object-contain select-none"
        />
      </div>
    );
  }

  // 3. Default Plain Mouse (fills the frame cleanly)
  const plainSrc = SPRITES.hello?.src || SPRITES.idle?.src || photo || '';
  return (
    <div
      title="Plain Mouse"
      className={`${size} ${rounded} ${border} overflow-hidden shrink-0 flex items-center justify-center ${className}`}
      style={{ backgroundColor: resolvedBg }}
    >
      {plainSrc ? (
        <img
          src={plainSrc}
          alt={name ? `${name} (Plain Mouse)` : 'Plain Mouse'}
          draggable={false}
          className="w-full h-full object-contain select-none"
        />
      ) : (
        <span className="font-extrabold uppercase">{(name || '?').trim().charAt(0)}</span>
      )}
    </div>
  );
}
