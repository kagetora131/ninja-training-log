import { useCallback, useEffect, useState } from 'react'
import { toSafeErrorMessage } from '../lib/errors'
import { useLanguage } from '../lib/i18n'
import { supabase } from '../lib/supabaseClient'
import type { TrainingCategory, TrainingLog } from '../types'

export interface NewLogInput {
  category: TrainingCategory
  amount: number
  unit: string
  memo: string
}

export function useTrainingLogs(userId: string | undefined, limit = 60) {
  const { language } = useLanguage()
  const [logs, setLogs] = useState<TrainingLog[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('training_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(limit)
    if (!error) setLogs(data)
    setLoading(false)
  }, [userId, limit])

  useEffect(() => {
    setLoading(true)
    refresh()
  }, [refresh])

  async function addLog(userId: string, input: NewLogInput) {
    const { error } = await supabase.from('training_logs').insert({
      user_id: userId,
      category: input.category,
      amount: input.amount,
      unit: input.unit,
      memo: input.memo || null,
    })
    if (error) return { error: toSafeErrorMessage(error.message, language) }
    await refresh()
    return { error: null }
  }

  async function deleteLog(id: string) {
    const { error } = await supabase.from('training_logs').delete().eq('id', id)
    if (error) return { error: toSafeErrorMessage(error.message, language) }
    await refresh()
    return { error: null }
  }

  return { logs, loading, addLog, deleteLog, refresh }
}
