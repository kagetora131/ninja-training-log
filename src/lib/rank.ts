import type { TrainingCategory } from '../types'

export const XP_PER_LOG = 20

export interface RankDef {
  rank: number
  requiredXp: number
  title: string
}

// DB側の calc_rank() 関数と同じ閾値(CLAUDE.mdのランク設計表に対応)
export const RANKS: RankDef[] = [
  { rank: 1, requiredXp: 0, title: '見習い忍者' },
  { rank: 2, requiredXp: 100, title: '下忍' },
  { rank: 3, requiredXp: 300, title: '中忍' },
  { rank: 4, requiredXp: 700, title: '上忍' },
  { rank: 5, requiredXp: 1500, title: '忍者頭領' },
]

export function rankTitle(rank: number): string {
  return RANKS.find((r) => r.rank === rank)?.title ?? RANKS[0].title
}

export function rankByXp(xp: number): RankDef {
  let current = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.requiredXp) current = r
  }
  return current
}

/** 現在のXPから、次のランクまでの進捗(0〜1)と残りXPを返す。最高ランクなら null。 */
export function nextRankProgress(xp: number): {
  next: RankDef
  progress: number
  remaining: number
} | null {
  const current = rankByXp(xp)
  const currentIndex = RANKS.findIndex((r) => r.rank === current.rank)
  const next = RANKS[currentIndex + 1]
  if (!next) return null
  const span = next.requiredXp - current.requiredXp
  const progress = span > 0 ? (xp - current.requiredXp) / span : 1
  return { next, progress: Math.min(Math.max(progress, 0), 1), remaining: next.requiredXp - xp }
}

export const CATEGORY_LABELS: Record<TrainingCategory, string> = {
  exercise: '稽古',
  study: '学習',
  reading: '読書',
  meditation: '瞑想',
  other: 'その他',
}

export const CATEGORY_DEFAULT_UNITS: Record<TrainingCategory, string> = {
  exercise: '分',
  study: '分',
  reading: 'ページ',
  meditation: '分',
  other: '回',
}

export const CATEGORY_ORDER: TrainingCategory[] = [
  'exercise',
  'study',
  'reading',
  'meditation',
  'other',
]
