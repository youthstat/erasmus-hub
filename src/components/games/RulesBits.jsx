import { useEffect, useState } from 'react';
import { SPRITES } from '../mascot/sprites.js';

// Animated character used INSIDE feature pages (moves automatically)
export function AnimatedMouse({ frames = ['idle'], speed = 950, className = 'w-20 h-20 sm:w-28 sm:h-28' }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (frames.length <= 1) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % frames.length), speed);
    return () => clearInterval(t);
  }, [frames.length, speed]);
  const sp = SPRITES[frames[idx % frames.length]] || SPRITES.idle;
  return (
    <div className={`${className} shrink-0 flex items-end justify-center`}>
      <img
        src={sp.src}
        alt=""
        draggable={false}
        decoding="async"
        className="w-full h-full object-contain object-bottom select-none mascot-breathe drop-shadow-[0_3px_0_rgba(17,17,17,0.22)]"
      />
    </div>
  );
}

// Маленькі блоки для сторінок правил (у стилі сайту)
export const Step = ({ n, tag, title, children, cls = 'bg-sun' }) => (
  <div className="border-[3px] border-ink rounded-2xl shadow-b4 bg-white overflow-hidden flex flex-col">
    <div className={`${cls} border-b-[3px] border-ink px-4 py-2 font-mono text-xs font-extrabold uppercase flex justify-between`}>
      <span>Step {n}</span><span>{tag}</span>
    </div>
    <div className="p-4 flex flex-col gap-2">
      <h3 className="text-xl font-extrabold uppercase leading-tight">{title}</h3>
      {children}
    </div>
  </div>
);

export const Card = ({ title, children, cls = 'bg-white' }) => (
  <div className={`border-[3px] border-ink rounded-2xl shadow-b4 p-4 ${cls}`}>
    <h4 className="font-mono text-xs font-extrabold uppercase mb-2">{title}</h4>
    <div className="text-sm font-medium flex flex-col gap-1.5">{children}</div>
  </div>
);

export const List = ({ items, mark = '•' }) => (
  <ul className="flex flex-col gap-1.5 text-sm font-medium">
    {items.map((t, i) => <li key={i} className="flex gap-2"><span className="font-mono font-bold">{mark}</span><span>{t}</span></li>)}
  </ul>
);

export const Banner = ({ title, children, cls = 'bg-sun', frames }) => (
  <div className={`box shadow-b8 p-5 sm:p-6 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${cls}`}>
    <div className="min-w-0 flex-1 w-full">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase leading-tight tracking-tight">{title}</h1>
      {frames && frames.length > 0 && (
        <div className="sm:hidden flex justify-center w-full my-3">
          <AnimatedMouse frames={frames} className="w-24 h-24" />
        </div>
      )}
      <p className="text-sm sm:text-lg mt-2 sm:mt-3 font-bold max-w-3xl">{children}</p>
    </div>
    {frames && frames.length > 0 && (
      <div className="hidden sm:block shrink-0">
        <AnimatedMouse frames={frames} />
      </div>
    )}
  </div>
);
