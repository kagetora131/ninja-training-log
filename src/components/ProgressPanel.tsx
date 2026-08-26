import { nextRankProgress, rankTitle } from '../lib/rank'
import type { UserProgress } from '../types'

export function ProgressPanel({ progress }: { progress: UserProgress }) {
  const next = nextRankProgress(progress.total_xp)

  return (
    <div className="animate-rise rounded-2xl border border-gold/30 bg-void-soft/80 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs tracking-widest text-paper-dim">現在のランク</p>
          <p className="font-mincho text-3xl font-bold text-gold">
            {rankTitle(progress.current_rank)}
          </p>
        </div>
        <p className="text-sm text-paper-dim">
          累計XP <span className="text-lg font-semibold text-paper">{progress.total_xp}</span>
        </p>
      </div>

      <div className="mt-4">
        {next ? (
          <>
            <div className="h-3 w-full overflow-hidden rounded-full bg-void">
              <div
                className="h-full rounded-full bg-gradient-to-r from-seal to-gold transition-all duration-500"
                style={{ width: `${next.progress * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-paper-dim">
              次のランク「{next.next.title}」まで、あと <strong className="text-paper">{next.remaining}</strong> XP
            </p>
          </>
        ) : (
          <p className="mt-1.5 text-xs text-gold">最高ランクに到達済み。見事、皆伝の境地。</p>
        )}
      </div>

      <div className="mt-5 flex gap-6 text-sm">
        <div>
          <p className="text-xs text-paper-dim">連続記録</p>
          <p className="text-lg font-semibold text-paper">
            {progress.current_streak}
            <span className="ml-1 text-xs font-normal text-paper-dim">日</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-paper-dim">最長記録</p>
          <p className="text-lg font-semibold text-paper">
            {progress.longest_streak}
            <span className="ml-1 text-xs font-normal text-paper-dim">日</span>
          </p>
        </div>
      </div>
    </div>
  )
}
