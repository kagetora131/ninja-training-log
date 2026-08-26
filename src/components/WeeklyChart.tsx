import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dailyTotals } from '../lib/aggregate'
import { formatDateLabel } from '../lib/format'
import type { TrainingLog } from '../types'

export function WeeklyChart({ logs }: { logs: TrainingLog[] }) {
  const data = dailyTotals(logs, 7).map((d) => ({ ...d, label: formatDateLabel(d.date) }))

  return (
    <div className="animate-rise rounded-2xl border border-gold/30 bg-void-soft/80 p-6">
      <h2 className="font-mincho text-lg font-bold text-paper">週間の推移(直近7日)</h2>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#3a3a38" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke="#cfc4a6" tick={{ fontSize: 12 }} />
            <YAxis stroke="#cfc4a6" tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: '#12161d',
                border: '1px solid #b6924f55',
                borderRadius: 8,
                color: '#ece3cf',
              }}
              formatter={(value) => [`${value} XP`, '獲得XP']}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="xp" fill="#b6924f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
