import { formatDateTime } from '../lib/format'
import { CATEGORY_LABELS } from '../lib/rank'
import type { TrainingLog } from '../types'

export function LogList({
  logs,
  onDelete,
}: {
  logs: TrainingLog[]
  onDelete: (id: string) => void
}) {
  return (
    <div className="animate-rise rounded-2xl border border-gold/30 bg-void-soft/80 p-6">
      <h2 className="font-mincho text-lg font-bold text-paper">修行の記録</h2>

      {logs.length === 0 ? (
        <p className="mt-4 text-sm text-paper-dim">
          まだ記録がありません。最初の修行を記録してみよう。
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-gold/10">
          {logs.map((log) => (
            <li key={log.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded-full bg-void px-2 py-0.5 text-xs text-gold">
                    {CATEGORY_LABELS[log.category]}
                  </span>
                  <span className="font-semibold text-paper">
                    {log.amount}
                    {log.unit}
                  </span>
                </div>
                {log.memo && (
                  <p className="mt-1 truncate text-xs text-paper-dim">{log.memo}</p>
                )}
                <p className="mt-1 text-xs text-paper-dim/70">{formatDateTime(log.logged_at)}</p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(log.id)}
                className="shrink-0 rounded-md border border-gold/20 px-2 py-1 text-xs text-paper-dim transition hover:border-seal-bright hover:text-seal-bright"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
