import { ERASMUS_ESSENTIALS, OFFICIAL_LINKS } from '../../data/erasmusGames.js';
import { ERASMUS_PROPS, ERASMUS_SPRITES } from '../../assets/erasmus/index.js';

export default function ErasmusEssentials({ onStartJourney }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Intro & Action CTA */}
      <div className="box shadow-b8 p-5 sm:p-7 bg-white flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex-1 flex flex-col gap-2">
          <div className="font-mono text-xs font-extrabold uppercase text-cobalt">
            Erasmus+ Handbook · Official Essentials
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase leading-tight">
            Everything you need before your journey
          </h2>
          <p className="text-sm sm:text-base font-medium text-ink/90 leading-relaxed max-w-3xl">
            {ERASMUS_ESSENTIALS.intro}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <img
            src={ERASMUS_SPRITES.pattyReading}
            alt="Pretty Patty reading guide"
            draggable={false}
            className="w-24 h-24 object-contain"
          />
          {onStartJourney && (
            <button type="button" onClick={onStartJourney} className="btn bg-neon text-ink text-xs">
              Go to Journey Map →
            </button>
          )}
        </div>
      </div>

      {/* Key Actions KA1 / KA2 / KA3 */}
      <section className="box shadow-b6 overflow-hidden">
        <div className="bg-sun border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-extrabold uppercase flex items-center justify-between">
          <span>Key Actions Structure (KA1 · KA2 · KA3)</span>
          <span className="text-xs">2021–2027</span>
        </div>
        <div className="p-4 sm:p-6 bg-paper grid grid-cols-1 md:grid-cols-3 gap-4">
          {ERASMUS_ESSENTIALS.keyActions.map((ka) => (
            <div key={ka.code} className="border-[3px] border-ink rounded-2xl bg-white p-4 shadow-b4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`tag ${ka.badge}`}>{ka.code}</span>
                <span className="font-mono text-[11px] font-bold text-mute uppercase">Erasmus+</span>
              </div>
              <h3 className="font-extrabold text-base uppercase leading-snug">{ka.name}</h3>
              <p className="text-xs sm:text-sm font-medium text-ink/90 leading-relaxed">{ka.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Horizontal Priorities */}
      <section className="box shadow-b6 overflow-hidden">
        <div className="bg-ink text-white px-4 sm:px-6 py-3 font-mono font-extrabold uppercase flex items-center justify-between">
          <span>4 Horizontal Priorities</span>
          <span className="text-sun text-xs">Applied across every project</span>
        </div>
        <div className="p-4 sm:p-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ERASMUS_ESSENTIALS.priorities.map((p) => (
            <div key={p.id} className={`border-[3px] border-ink rounded-2xl p-4 shadow-b4 flex flex-col gap-2 ${p.color}`}>
              <h3 className="font-extrabold uppercase text-base leading-tight">{p.title}</h3>
              <p className="text-xs sm:text-sm font-medium leading-snug">{p.short}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Youth Exchange Basics & Grant Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 box shadow-b6 overflow-hidden flex flex-col">
          <div className="bg-cobalt text-white border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-extrabold uppercase">
            Youth Exchanges · Key Rules
          </div>
          <div className="divide-y-[2px] divide-ink/15 bg-white flex-1">
            {ERASMUS_ESSENTIALS.youthExchangeBasics.map((row) => (
              <div key={row.label} className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                <span className="font-mono text-xs font-extrabold uppercase text-cobalt shrink-0">{row.label}</span>
                <span className="text-xs sm:text-sm font-bold text-ink sm:text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-6 box shadow-b6 overflow-hidden flex flex-col">
          <div className="bg-[#B89CFF] text-ink border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-extrabold uppercase flex items-center justify-between">
            <span>Unit-Cost Grant Logic</span>
            <img src={ERASMUS_PROPS.coins} alt="" className="w-6 h-6 object-contain" />
          </div>
          <div className="p-4 sm:p-5 bg-paper grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {ERASMUS_ESSENTIALS.grantRules.map((g) => (
              <div key={g.title} className="border-2 border-ink rounded-xl bg-white p-3 flex flex-col gap-1">
                <h4 className="font-extrabold text-xs uppercase text-ink">{g.title}</h4>
                <p className="text-xs font-medium text-ink/85 leading-snug">{g.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Youthpass 8 Key Competences */}
      <section className="box shadow-b6 overflow-hidden">
        <div className="bg-sun border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-extrabold uppercase flex items-center justify-between gap-2">
          <span>Youthpass · 8 Key Competences</span>
          <img src={ERASMUS_PROPS.scroll} alt="" className="w-8 h-6 object-contain" />
        </div>
        <div className="p-4 sm:p-6 bg-paper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ERASMUS_ESSENTIALS.keyCompetences.map((c) => (
            <div key={c.key} className="border-[3px] border-ink rounded-xl bg-white p-3.5 shadow-b2 flex flex-col gap-1">
              <div className="font-extrabold text-sm uppercase">{c.title}</div>
              <p className="text-xs font-medium text-ink/85 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learn More · Official Useful Links */}
      <section className="box shadow-b6 overflow-hidden">
        <div className="bg-neon border-b-[3px] border-ink px-4 sm:px-6 py-3 font-mono font-extrabold uppercase flex items-center justify-between">
          <span>Learn More · Official Erasmus+ Resources</span>
          <span className="text-xs">EU &amp; SALTO links</span>
        </div>
        <div className="p-4 sm:p-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_LINKS.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-ink rounded-xl p-3 bg-paper hover:bg-sun/40 transition-colors flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0">
                <div className="font-extrabold text-sm leading-snug group-hover:underline truncate">{l.label}</div>
                <div className="text-xs text-mute truncate">{l.desc}</div>
              </div>
              <span className="font-mono font-extrabold text-sm shrink-0">↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
