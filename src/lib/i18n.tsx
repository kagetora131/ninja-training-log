import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import type { TrainingCategory } from '../types'

export type Language = 'ja' | 'en'

export interface Dictionary {
  common: { loading: string }
  auth: {
    tagline: string
    tabLogin: string
    tabSignup: string
    emailLabel: string
    passwordLabel: string
    submitLogin: string
    submitSignup: string
    signupNotice: string
  }
  header: { logout: string }
  progress: {
    currentRank: string
    totalXp: string
    nextRankPrefix: string
    nextRankSuffix: string
    maxRank: string
    currentStreak: string
    longestStreak: string
    days: string
  }
  logForm: {
    heading: string
    xpPrefix: string
    xpSuffix: string
    amountLabel: string
    unitLabel: string
    memoLabel: string
    memoPlaceholder: string
    submit: string
    amountError: string
  }
  logList: { heading: string; empty: string; delete: string }
  rankUp: { badge: string; message: string; close: string }
  charts: {
    weeklyHeading: string
    monthlyHeading: string
    xpTooltip: string
    weekOf: string
  }
}

// カテゴリ名・デフォルト単位・ランク称号は言語別に切り替える表示用テキスト。
// ランク名は下忍/中忍/上忍(Genin/Chunin/Jonin)は英語圏でも通じる語としてローマ字表記のまま残し、
// 見習い忍者/忍者頭領は伝わりにくいため英訳する方針(2026-08-31、ユーザー確認済み)。
// 「忍者頭領」ランク自体は2026-09-04に廃止し、上忍(Jonin)を最高ランクとした。
export const CATEGORY_LABELS: Record<Language, Record<TrainingCategory, string>> = {
  ja: {
    exercise: '稽古',
    study: '学習',
    reading: '読書',
    meditation: '瞑想',
    other: 'その他',
  },
  en: {
    exercise: 'Training',
    study: 'Study',
    reading: 'Reading',
    meditation: 'Meditation',
    other: 'Other',
  },
}

export const CATEGORY_UNITS: Record<Language, Record<TrainingCategory, string>> = {
  ja: {
    exercise: '分',
    study: '分',
    reading: 'ページ',
    meditation: '分',
    other: '回',
  },
  en: {
    exercise: 'min',
    study: 'min',
    reading: 'pages',
    meditation: 'min',
    other: 'times',
  },
}

export const RANK_TITLES: Record<Language, Record<number, string>> = {
  ja: {
    1: '見習い忍者',
    2: '下忍',
    3: '中忍',
    4: '上忍',
  },
  en: {
    1: 'Ninja Apprentice',
    2: 'Genin',
    3: 'Chunin',
    4: 'Jonin',
  },
}

const ja: Dictionary = {
  common: { loading: '読み込み中...' },
  auth: {
    tagline: '記録をつけてXPを貯め、忍者ランクを上げていこう。',
    tabLogin: 'ログイン',
    tabSignup: '新規登録',
    emailLabel: 'メールアドレス',
    passwordLabel: 'パスワード',
    submitLogin: 'ログイン',
    submitSignup: '登録する',
    signupNotice: '確認メールを送信しました。メール内のリンクを開いてからログインしてください。',
  },
  header: { logout: 'ログアウト' },
  progress: {
    currentRank: '現在のランク',
    totalXp: '累計XP',
    nextRankPrefix: '次のランク「',
    nextRankSuffix: '」まで、あと',
    maxRank: '最高ランクに到達済み。見事、皆伝の境地。',
    currentStreak: '連続記録',
    longestStreak: '最長記録',
    days: '日',
  },
  logForm: {
    heading: '今日の修行を記録する',
    xpPrefix: 'この記録で',
    xpSuffix: '(カテゴリごとにXPが異なる)',
    amountLabel: '時間・回数',
    unitLabel: '単位',
    memoLabel: 'メモ(任意)',
    memoPlaceholder: '例: ランニング5km、参考書10ページなど',
    submit: '記録する',
    amountError: '回数・時間は1以上の数値で入力してください。',
  },
  logList: {
    heading: '修行の記録',
    empty: 'まだ記録がありません。最初の修行を記録してみよう。',
    delete: '削除',
  },
  rankUp: {
    badge: 'RANK UP',
    message: '修行の成果が実を結んだ。さらなる高みへ。',
    close: '修行を続ける',
  },
  charts: {
    weeklyHeading: '週間の推移(直近7日)',
    monthlyHeading: '月間の推移(直近4週・週の開始日)',
    xpTooltip: '獲得XP',
    weekOf: '週:',
  },
}

const en: Dictionary = {
  common: { loading: 'Loading...' },
  auth: {
    tagline: 'Log your training, earn XP, and rise through the ninja ranks.',
    tabLogin: 'Log In',
    tabSignup: 'Sign Up',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    submitLogin: 'Log In',
    submitSignup: 'Sign Up',
    signupNotice:
      'A confirmation email has been sent. Please open the link inside it before logging in.',
  },
  header: { logout: 'Log Out' },
  progress: {
    currentRank: 'Current Rank',
    totalXp: 'Total XP',
    nextRankPrefix: 'Only',
    nextRankSuffix: 'XP to the next rank:',
    maxRank: "You've reached the highest rank. A true master of the shadows.",
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    days: 'days',
  },
  logForm: {
    heading: "Log Today's Training",
    xpPrefix: 'This entry earns',
    xpSuffix: '(XP varies by category)',
    amountLabel: 'Time / Count',
    unitLabel: 'Unit',
    memoLabel: 'Memo (optional)',
    memoPlaceholder: 'e.g. 5km run, 10 pages of reading',
    submit: 'Log It',
    amountError: 'Please enter a number of 1 or more for time/count.',
  },
  logList: {
    heading: 'Training Log',
    empty: 'No records yet. Log your first training session!',
    delete: 'Delete',
  },
  rankUp: {
    badge: 'RANK UP',
    message: 'Your training has paid off. Onward to greater heights.',
    close: 'Continue Training',
  },
  charts: {
    weeklyHeading: 'Weekly Trend (Last 7 Days)',
    monthlyHeading: 'Monthly Trend (Last 4 Weeks, by Week Start)',
    xpTooltip: 'XP Gained',
    weekOf: 'Week of',
  },
}

export const DICTIONARIES: Record<Language, Dictionary> = { ja, en }

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  dict: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'ninja-training-log:language'

function detectInitialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'ja' || stored === 'en') return stored
  } catch {
    // localStorageが使えない環境(プライベートブラウジング等)では端末の言語設定にフォールバック
  }
  // 保存済みの選択が無い初回訪問時は、端末の言語設定から自動判定する。
  // 日本語系(ja, ja-JP等)以外は全て英語をデフォルトにする
  // (フランス語・スペイン語など未対応言語の訪問者にも英語を表示するため)。
  try {
    return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en'
  } catch {
    return 'ja'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(detectInitialLanguage)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // 保存に失敗しても致命的ではないため無視
    }
  }, [language])

  return (
    <LanguageContext value={{ language, setLanguage, dict: DICTIONARIES[language] }}>
      {children}
    </LanguageContext>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = use(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
