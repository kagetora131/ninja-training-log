import { useState, type FormEvent } from 'react'
import { CATEGORY_DEFAULT_UNITS, CATEGORY_LABELS, CATEGORY_ORDER, CATEGORY_XP } from '../lib/rank'
import type { TrainingCategory } from '../types'
import type { NewLogInput } from '../hooks/useTrainingLogs'

export function LogForm({
  onSubmit,
}: {
  onSubmit: (input: NewLogInput) => Promise<{ error: string | null }>
}) {
  const [category, setCategory] = useState<TrainingCategory>('exercise')
  const [amount, setAmount] = useState('30')
  const [unit, setUnit] = useState(CATEGORY_DEFAULT_UNITS.exercise)
  const [memo, setMemo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleCategoryChange(next: TrainingCategory) {
    setCategory(next)
    setUnit(CATEGORY_DEFAULT_UNITS[next])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      setError('回数・時間は1以上の数値で入力してください。')
      return
    }
    setError(null)
    setSubmitting(true)
    const { error } = await onSubmit({ category, amount: numericAmount, unit, memo })
    setSubmitting(false)
    if (error) {
      setError(error)
    } else {
      setMemo('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-rise rounded-2xl border border-gold/30 bg-void-soft/80 p-6"
    >
      <h2 className="font-mincho text-lg font-bold text-paper">今日の修行を記録する</h2>
      <p className="mt-1 text-xs text-paper-dim">
        この記録で <span className="text-gold">+{CATEGORY_XP[category]} XP</span>
        (カテゴリごとにXPが異なる)
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleCategoryChange(c)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              category === c
                ? 'border-seal bg-seal text-paper'
                : 'border-gold/30 text-paper-dim hover:border-gold hover:text-paper'
            }`}
          >
            {CATEGORY_LABELS[c]}
            <span className="ml-1 text-xs opacity-70">+{CATEGORY_XP[c]}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-paper-dim">
          時間・回数
          <input
            type="number"
            min={0}
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-md border border-gold/30 bg-void px-3 py-2 text-paper outline-none focus:border-gold"
          />
        </label>
        <label className="flex w-28 flex-col gap-1 text-sm text-paper-dim">
          単位
          <input
            type="text"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="rounded-md border border-gold/30 bg-void px-3 py-2 text-paper outline-none focus:border-gold"
          />
        </label>
      </div>

      <label className="mt-3 flex flex-col gap-1 text-sm text-paper-dim">
        メモ(任意)
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          className="resize-none rounded-md border border-gold/30 bg-void px-3 py-2 text-paper outline-none focus:border-gold"
          placeholder="例: ランニング5km、参考書10ページなど"
        />
      </label>

      {error && <p className="mt-2 text-sm text-seal-bright">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-md bg-seal py-2 font-semibold text-paper transition hover:bg-seal-bright disabled:opacity-50"
      >
        記録する
      </button>
    </form>
  )
}
