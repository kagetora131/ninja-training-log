import type { TrainingCategory } from '../types'

// DB側の calc_log_xp() 関数と同じ配分(カテゴリごとに固定XP)
export const CATEGORY_XP: Record<TrainingCategory, number> = {
  exercise: 15,
  study: 20,
  reading: 10,
  meditation: 15,
  other: 10,
}

export interface RankDef {
  rank: number
  requiredXp: number
}

// DB側の calc_rank() 関数と同じ閾値(CLAUDE.mdのランク設計表に対応)。
// ランク名(表示用の言語別テキスト)は src/lib/i18n.ts の RANK_TITLES を参照する。
export const RANKS: RankDef[] = [
  { rank: 1, requiredXp: 0 },
  { rank: 2, requiredXp: 100 },
  { rank: 3, requiredXp: 300 },
  { rank: 4, requiredXp: 700 },
  { rank: 5, requiredXp: 1500 },
]

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

// カテゴリのラベル・デフォルト単位(表示用の言語別テキスト)は
// src/lib/i18n.ts の CATEGORY_LABELS / CATEGORY_UNITS を参照する。
export const CATEGORY_ORDER: TrainingCategory[] = [
  'exercise',
  'study',
  'reading',
  'meditation',
  'other',
]
