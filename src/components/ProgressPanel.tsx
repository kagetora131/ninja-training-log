import { nextRankProgress } from '../lib/rank'
import { RANK_TITLES, useLanguage } from '../lib/i18n'
import type { UserProgress } from '../types'

export function ProgressPanel({ progress }: { progress: UserProgress }) {
  const { language, dict } = useLanguage()
  const next = nextRankProgress(progress.total_xp)
  const rankTitles = RANK_TITLES[language]

  return (
    <div className="animate-rise rounded-2xl border border-gold/30 bg-void-soft/80 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs tracking-widest text-paper-dim">{dict.progress.currentRank}</p>
          <p className="font-mincho text-3xl font-bold text-gold">
            {rankTitles[progress.current_rank]}
          </p>
        </div>
        <p className="text-sm text-paper-dim">
          {dict.progress.totalXp}{' '}
          <span className="text-lg font-semibold text-paper">{progress.total_xp}</span>
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
              {language === 'ja' ? (
                <>
                  {dict.progress.nextRankPrefix}
                  {rankTitles[next.next.rank]}
                  {dict.progress.nextRankSuffix}{' '}
                  <strong className="text-paper">{next.remaining}</strong> XP
                </>
              ) : (
                <>
                  {dict.progress.nextRankPrefix}{' '}
                  <strong className="text-paper">{next.remaining}</strong>{' '}
                  {dict.progress.nextRankSuffix} {rankTitles[next.next.rank]}
                </>
              )}
            </p>
          </>
        ) : (
          <p className="mt-1.5 text-xs text-gold">{dict.progress.maxRank}</p>
        )}
      </div>

      <div className="mt-5 flex gap-6 text-sm">
        <div>
          <p className="text-xs text-paper-dim">{dict.progress.currentStreak}</p>
          <p className="text-lg font-semibold text-paper">
            {progress.current_streak}
            <span className="ml-1 text-xs font-normal text-paper-dim">{dict.progress.days}</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-paper-dim">{dict.progress.longestStreak}</p>
          <p className="text-lg font-semibold text-paper">
            {progress.longest_streak}
            <span className="ml-1 text-xs font-normal text-paper-dim">{dict.progress.days}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
