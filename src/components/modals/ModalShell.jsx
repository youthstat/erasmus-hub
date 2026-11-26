export default function ModalShell({ title, onClose, children, maxW = 'max-w-2xl', zClass = 'z-50' }) {
  return (
    <div
      className={`fixed inset-0 ${zClass} flex items-start sm:items-center justify-center p-4 bg-black/60 backdrop-blur-[3px] overflow-y-auto`}
      onClick={onClose}
    >
      <div
        className={`my-auto w-full ${maxW} bg-white border-4 border-ink rounded-[20px] shadow-[8px_8px_0_#111] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#FFE200] px-4 py-2.5 border-b-[3px] border-ink flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-3 h-3 bg-ink shrink-0" />
            <span className="font-mono font-extrabold text-sm tracking-wider uppercase truncate">{title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 shrink-0 bg-[#FF4766] border-2 border-ink rounded-md text-white font-black text-sm flex items-center justify-center shadow-b2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="p-5 md:p-7 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
