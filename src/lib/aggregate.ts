import { lastNDatesJst } from './format'
import { XP_PER_LOG } from './rank'
import type { TrainingLog } from '../types'

export interface DailyPoint {
  date: string
  xp: number
  count: number
}

/** 直近n日分の、日別の獲得XP・記録件数を古い→新しい順で返す(記録が無い日は0埋め) */
export function dailyTotals(logs: TrainingLog[], days: number): DailyPoint[] {
  const dates = lastNDatesJst(days)
  const byDate = new Map<string, number>()
  for (const log of logs) {
    byDate.set(log.log_date, (byDate.get(log.log_date) ?? 0) + 1)
  }
  return dates.map((date) => {
    const count = byDate.get(date) ?? 0
    return { date, xp: count * XP_PER_LOG, count }
  })
}

export interface WeeklyPoint {
  weekStart: string
  xp: number
  count: number
}

/** 直近n日を7日単位のバケットに分け、週ごとの獲得XP・記録件数を古い→新しい順で返す */
export function weeklyTotals(logs: TrainingLog[], days: number): WeeklyPoint[] {
  const daily = dailyTotals(logs, days)
  const buckets: WeeklyPoint[] = []
  for (let i = 0; i < daily.length; i += 7) {
    const chunk = daily.slice(i, i + 7)
    buckets.push({
      weekStart: chunk[0].date,
      xp: chunk.reduce((sum, d) => sum + d.xp, 0),
      count: chunk.reduce((sum, d) => sum + d.count, 0),
    })
  }
  return buckets
}
