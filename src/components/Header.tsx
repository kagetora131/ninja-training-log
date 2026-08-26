import { useAuth } from '../hooks/useAuth'

export function Header() {
  const { session, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-gold/20 px-4 py-4 sm:px-8">
      <div>
        <h1 className="font-mincho text-xl font-bold tracking-wide text-paper sm:text-2xl">
          忍者修行ログ
        </h1>
        <p className="text-xs text-paper-dim">Ninja Training Log</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-paper-dim">
        <span className="hidden sm:inline">{session?.user.email}</span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-md border border-gold/30 px-3 py-1.5 transition hover:border-seal-bright hover:text-paper"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}
