import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { UserProgress } from '../types'

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (!error) setProgress(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    setLoading(true)
    refresh()
  }, [refresh])

  return { progress, loading, refresh }
}
