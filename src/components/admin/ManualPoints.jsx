import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { formatScore } from '../../utils/format.js';

export default function ManualPoints() {
  const { users, reflectionConfig, adjustPointsBatch } = useApp();
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [amount, setAmount] = useState(50);
  const [reason, setReason] = useState('');
  const [flash, setFlash] = useState('');

  const teams = reflectionConfig?.teams || [];
  const selectable = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...users]
      .filter((u) => !q || u.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, search]);

  const toggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setFlash('');
  };

  const selectAllVisible = () => {
    const ids = selectable.filter((u) => !u.isDemo).map((u) => u.id);
    setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    setFlash('');
  };

  const selectTeam = (team) => {
    const ids = (team.memberIds || []).filter(Boolean);
    setSelectedIds(ids);
    if (!reason) setReason(`Team ${team.name}`);
    setFlash('');
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setFlash('');
  };

  const apply = async (sign) => {
    const amt = Math.abs(Number(amount));
    if (!selectedIds.length || !amt) return;
    await adjustPointsBatch(selectedIds, sign * amt, reason.trim() || 'Manual');
    setFlash(`${sign > 0 ? '+' : '−'}${amt} PTS applied to ${selectedIds.length} participant(s)!`);
    setReason('');
  };

  return (
    <section className="box overflow-hidden">
      <div className="bg-sun border-b-[3px] border-ink px-4 py-3 font-mono font-bold uppercase flex flex-wrap items-center justify-between gap-2">
        <span>🪙 Batch &amp; manual points · {selectedIds.length} selected</span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className="tag bg-neon text-ink" onClick={selectAllVisible}>Select all</button>
          <button type="button" className="tag bg-white text-ink" onClick={clearSelection}>Clear</button>
        </div>
      </div>

      <div className="p-4 bg-paper flex flex-col gap-4">
        {teams.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase text-mute">Quick-select Reflection team:</span>
            {teams.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => selectTeam(t)}
                className="tag bg-cobalt text-white hover:opacity-90"
              >
                🪞 {t.name} ({(t.memberIds || []).length})
              </button>
            ))}
          </div>
        )}

        <input
          type="text"
          className="input !shadow-none !py-2"
          placeholder="Search participant by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {selectable.map((u) => {
            const checked = selectedIds.includes(u.id);
            return (
              <label
                key={u.id}
                className={`border-[3px] border-ink rounded-xl px-3 py-2 flex items-center justify-between gap-2 cursor-pointer transition ${
                  checked ? 'bg-sun shadow-b2' : 'bg-white'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-ink shrink-0"
                    checked={checked}
                    onChange={() => toggle(u.id)}
                  />
                  <span className="font-bold text-sm truncate">{u.name}</span>
                  {u.isDemo && <span className="tag !text-[9px] bg-[#B89CFF] shrink-0">DEMO</span>}
                </span>
                <span className="font-mono text-xs font-bold text-mute shrink-0">{formatScore(u.score)}</span>
              </label>
            );
          })}
        </div>

        <div className="grid md:grid-cols-4 gap-3 items-end pt-2 border-t-2 border-ink/15">
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase">
            <span>Points amount</span>
            <input
              className="input shadow-none"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-xs font-bold uppercase md:col-span-2">
            <span>Reason (optional)</span>
            <input
              className="input shadow-none"
              placeholder="e.g. Evening reflection bonus, Activity win…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!selectedIds.length || !Number(amount)}
              className="btn bg-hot text-white flex-1 text-xs disabled:opacity-40"
              onClick={() => apply(-1)}
            >
              − Subtract
            </button>
            <button
              type="button"
              disabled={!selectedIds.length || !Number(amount)}
              className="btn bg-neon text-ink flex-1 text-xs disabled:opacity-40"
              onClick={() => apply(1)}
            >
              + Add
            </button>
          </div>
        </div>

        {flash && <p className="border-2 border-ink rounded-xl bg-neon px-3 py-2 font-mono text-xs font-bold">{flash}</p>}
      </div>
    </section>
  );
}
