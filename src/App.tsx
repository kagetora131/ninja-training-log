import { useEffect, useRef, useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { Header } from './components/Header'
import { LogForm } from './components/LogForm'
import { LogList } from './components/LogList'
import { MonthlyChart } from './components/MonthlyChart'
import { ProgressPanel } from './components/ProgressPanel'
import { RankUpModal } from './components/RankUpModal'
import { WeeklyChart } from './components/WeeklyChart'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import { useTrainingLogs } from './hooks/useTrainingLogs'
import { useLanguage } from './lib/i18n'

function AppShell() {
  const { session } = useAuth()
  const userId = session!.user.id
  const { progress, refresh: refreshProgress } = useProgress(userId)
  const { logs, addLog, deleteLog } = useTrainingLogs(userId)

  const previousRank = useRef<number | null>(null)
  const [rankUpTo, setRankUpTo] = useState<number | null>(null)

  useEffect(() => {
    if (!progress) return
    if (previousRank.current !== null && progress.current_rank > previousRank.current) {
      setRankUpTo(progress.current_rank)
    }
    previousRank.current = progress.current_rank
  }, [progress])

  async function handleAddLog(input: Parameters<typeof addLog>[1]) {
    const result = await addLog(userId, input)
    if (!result.error) await refreshProgress()
    return result
  }

  async function handleDeleteLog(id: string) {
    await deleteLog(id)
    await refreshProgress()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-8">
        {progress && <ProgressPanel progress={progress} />}
        <LogForm onSubmit={handleAddLog} />
        <div className="grid gap-6 sm:grid-cols-2">
          <WeeklyChart logs={logs} />
          <MonthlyChart logs={logs} />
        </div>
        <LogList logs={logs} onDelete={handleDeleteLog} />
      </main>
      {rankUpTo !== null && <RankUpModal rank={rankUpTo} onClose={() => setRankUpTo(null)} />}
    </div>
  )
}

function App() {
  const { session, loading } = useAuth()
  const { dict } = useLanguage()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-paper-dim">
        {dict.common.loading}
      </div>
    )
  }

  if (!session) return <AuthScreen />

  return <AppShell />
}

export default App
