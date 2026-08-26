import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabaseの接続情報がありません。.env.example を参考に .env を作成してください。',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
