import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { weeklyTotals } from '../lib/aggregate'
import { formatDateLabel } from '../lib/format'
import { useLanguage } from '../lib/i18n'
import type { TrainingLog } from '../types'

export function MonthlyChart({ logs }: { logs: TrainingLog[] }) {
  const { language, dict } = useLanguage()
  const data = weeklyTotals(logs, 28).map((w) => ({
    ...w,
    label: formatDateLabel(w.weekStart, language),
  }))

  return (
    <div className="animate-rise rounded-2xl border border-gold/30 bg-void-soft/80 p-6">
      <h2 className="font-mincho text-lg font-bold text-paper">{dict.charts.monthlyHeading}</h2>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#3a3a38" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke="#cfc4a6" tick={{ fontSize: 12 }} />
            <YAxis stroke="#cfc4a6" tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: '#12161d',
                border: '1px solid #a5321f55',
                borderRadius: 8,
                color: '#ece3cf',
              }}
              formatter={(value) => [`${value} XP`, dict.charts.xpTooltip]}
              labelFormatter={(label) => `${dict.charts.weekOf} ${label}`}
            />
            <Bar dataKey="xp" fill="#a5321f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
