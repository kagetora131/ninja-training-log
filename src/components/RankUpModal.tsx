import { rankTitle } from '../lib/rank'

export function RankUpModal({ rank, onClose }: { rank: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 px-4 backdrop-blur-sm">
      <div className="animate-rank-pop w-full max-w-sm rounded-2xl border border-gold bg-void-soft p-8 text-center shadow-2xl">
        <p className="text-xs tracking-[0.3em] text-gold">RANK UP</p>
        <p className="mt-3 font-mincho text-4xl font-bold text-paper">{rankTitle(rank)}</p>
        <p className="mt-2 text-sm text-paper-dim">修行の成果が実を結んだ。さらなる高みへ。</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-seal py-2 font-semibold text-paper transition hover:bg-seal-bright"
        >
          修行を続ける
        </button>
      </div>
    </div>
  )
}
