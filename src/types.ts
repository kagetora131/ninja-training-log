export type TrainingCategory = 'exercise' | 'study' | 'reading' | 'meditation' | 'other'

export interface TrainingLog {
  id: string
  user_id: string
  category: TrainingCategory
  amount: number
  unit: string
  memo: string | null
  logged_at: string
  log_date: string
  created_at: string
}

export interface UserProgress {
  user_id: string
  total_xp: number
  current_rank: number
  current_streak: number
  longest_streak: number
  last_log_date: string | null
  updated_at: string
}
