import { SPRITES } from '../components/mascot/sprites.js';

export function formatScore(score) {
  if (score === -Infinity || score === '-Infinity' || score === '-∞' || (typeof score === 'number' && score <= -1e15)) {
    return '-∞';
  }
  if (score === Infinity || score === 'Infinity' || score === '∞' || (typeof score === 'number' && score >= 1e15)) {
    return '∞';
  }
  return (Number(score) || 0).toLocaleString('en-US');
}

export function parseScoreValue(val) {
  if (val === -Infinity || val === '-Infinity' || val === '-∞') return -Infinity;
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
}

export function avatarSrcOf(photo, photoSprite) {
  if (photo) return photo;
  if (photoSprite && SPRITES[photoSprite]) return SPRITES[photoSprite].src;
  return '';
}
