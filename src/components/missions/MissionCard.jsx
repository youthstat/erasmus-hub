import { useApp } from '../../context/AppContext.jsx';
import { categoryColor } from '../../utils/categoryColor.js';
import { deadlineText, isExpired } from '../../utils/mission.js';

const STATUS = { pending: ['UNDER REVIEW', 'bg-sun'], approved: ['✓ YOU COMPLETED THIS', 'bg-neon'], rejected: ['REJECTED', 'bg-hot text-white'] };

export default function MissionCard({ mission, className = '' }) {
  const { openMission, isAdmin, openEditor, statusFor, profile, submissions, clearSubmissions } = useApp();
  const doneCount = isAdmin ? submissions.filter((s) => s.missionId === mission.id).length : 0;
  const clearDone = (e) => {
    e.stopPropagation();
    if (confirm(`Clear everyone who completed “${mission.title}”? ${doneCount} record(s) will be deleted. Points already paid stay, and participants can send this mission again.`)) clearSubmissions(mission.id);
  };
  const status = !isAdmin && profile ? statusFor(mission) : null;
  const st = status ? STATUS[status] : null;
  const completed = status === 'approved';
  return (
    <div onClick={() => openMission(mission)}
      className={`border-[3px] border-ink p-3.5 sm:p-4 rounded-xl shadow-b4 hover:shadow-b6 transition-all flex flex-col justify-between cursor-pointer ${completed ? 'bg-[#ebe7e7] opacity-75' : 'bg-white'} ${mission.active === false ? 'opacity-60' : ''} ${className}`}>
      <div className="space-y-1.5 sm:space-y-2 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className={`tag !text-[10px] sm:!text-[11px] ${categoryColor(mission.category)}`}>{mission.category}</span>
          <span className="tag !text-[10px] sm:!text-[11px] bg-neon shrink-0">+{mission.points} PTS</span>
        </div>
        <h4 className="text-sm sm:text-base font-bold uppercase leading-tight mt-1">{mission.title}</h4>
        <p className="text-[11px] sm:text-xs text-mute leading-snug">{mission.short}</p>
      </div>
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-ink flex flex-wrap items-center justify-between gap-2">
        <span className={`font-mono text-[10px] ${isExpired(mission) ? 'text-hot font-bold' : 'text-mute'}`}>
          {deadlineText(mission) && `${isExpired(mission) ? 'CLOSED ' : 'UNTIL '}${deadlineText(mission)}`}
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {mission.active === false && <span className="tag !text-[10px] sm:!text-[11px] bg-paper">HIDDEN</span>}
          {isAdmin && doneCount > 0 && <button className="tag !text-[10px] sm:!text-[11px] bg-hot text-white" onClick={clearDone}>CLEAR DONE · {doneCount}</button>}
          {isAdmin && <button className="tag !text-[10px] sm:!text-[11px] bg-white" onClick={(e) => { e.stopPropagation(); openEditor(mission); }}>EDIT</button>}
          {st ? <span className={`tag !text-[10px] sm:!text-[11px] ${st[1]}`}>{st[0]}</span> : <span className="tag !text-[10px] sm:!text-[11px] bg-sun">DETAILS →</span>}
        </div>
      </div>
    </div>
  );
}
