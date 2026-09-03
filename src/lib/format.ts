import type { Language } from './i18n'

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * "YYYY-MM-DD" 形式の日付文字列(DBの log_date 列など)を、タイムゾーンのズレなしで
 * 表示用ラベルに変換する。`new Date("YYYY-MM-DD")` はUTC0時として解釈されるため、
 * ローカルタイムゾーンでの表示メソッド(getMonth等)と混ぜるとJSTでは1日ズレる。
 * ここでは文字列を直接分解し、UTC系メソッドのみで一貫させることでズレを防ぐ。
 */
export function formatDateLabel(dateStr: string, language: Language = 'ja'): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const utcDate = new Date(Date.UTC(y, m - 1, d))
  const weekday = language === 'ja' ? WEEKDAY_JA : WEEKDAY_EN
  return `${m}/${d}(${weekday[utcDate.getUTCDay()]})`
}

export function formatDateTime(isoString: string, language: Language = 'ja'): string {
  return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}

/** JSTでの「今日」を YYYY-MM-DD で返す */
export function todayJstDateString(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date())
}

/** JSTの日付文字列を、指定日数だけ遡って YYYY-MM-DD の配列(古い→新しい順)で返す */
export function lastNDatesJst(n: number): string[] {
  const todayStr = todayJstDateString()
  const [y, m, d] = todayStr.split('-').map(Number)
  const dates: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(Date.UTC(y, m - 1, d))
    dt.setUTCDate(dt.getUTCDate() - i)
    dates.push(
      `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(
        dt.getUTCDate(),
      ).padStart(2, '0')}`,
    )
  }
  return dates
}
