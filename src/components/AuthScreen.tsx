import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

export function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setSubmitting(true)

    if (mode === 'signup') {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error)
      } else {
        setNotice('確認メールを送信しました。メール内のリンクを開いてからログインしてください。')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error)
    }
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm animate-rise rounded-2xl border border-gold/30 bg-void-soft/80 p-8 shadow-2xl">
        <h1 className="font-mincho text-2xl font-bold tracking-wide text-paper">忍者修行ログ</h1>
        <p className="mt-1 text-sm text-paper-dim">
          記録をつけてXPを貯め、忍者ランクを上げていこう。
        </p>

        <div className="mt-6 flex rounded-lg border border-gold/30 p-1 text-sm">
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === 'signin' ? 'bg-seal text-paper' : 'text-paper-dim hover:text-paper'
            }`}
            onClick={() => setMode('signin')}
          >
            ログイン
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === 'signup' ? 'bg-seal text-paper' : 'text-paper-dim hover:text-paper'
            }`}
            onClick={() => setMode('signup')}
          >
            新規登録
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm text-paper-dim">
            メールアドレス
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-gold/30 bg-void px-3 py-2 text-paper outline-none focus:border-gold"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-paper-dim">
            パスワード
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-gold/30 bg-void px-3 py-2 text-paper outline-none focus:border-gold"
            />
          </label>

          {error && <p className="text-sm text-seal-bright">{error}</p>}
          {notice && <p className="text-sm text-jade">{notice}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-seal py-2 font-semibold text-paper transition hover:bg-seal-bright disabled:opacity-50"
          >
            {mode === 'signup' ? '登録する' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}
