import type { Language } from './i18n'

/**
 * Supabase/PostgRESTが返す生のエラーメッセージには、まれにテーブル名・制約名・
 * SQLSTATEコードなどDB内部の実装詳細が含まれる(例: 'new row for relation
 * "training_logs" violates check constraint "training_logs_amount_check"'、
 * 'new row violates row-level security policy for table "training_logs"')。
 * 通常はクライアント側のバリデーションで到達しないパスだが、直接API呼び出し等の
 * 想定外の経路でもUIに内部詳細を出さないよう、それらしきメッセージは一般化した
 * 文言に差し替える(元のメッセージはコンソールにのみ残す)。
 */
const INTERNAL_ERROR_PATTERN =
  /relation\s+"|constraint\s+"|column\s+".*"\s+of\s+relation|violates|SQLSTATE|policy for table|duplicate key value/i

const FALLBACK_MESSAGE: Record<Language, string> = {
  ja: '処理に失敗しました。時間をおいて再度お試しください。',
  en: 'Something went wrong. Please try again in a moment.',
}

export function toSafeErrorMessage(
  message: string | null | undefined,
  language: Language,
): string | null {
  if (!message) return null
  if (INTERNAL_ERROR_PATTERN.test(message)) {
    console.error('[ninja-training-log] internal error message suppressed from UI:', message)
    return FALLBACK_MESSAGE[language]
  }
  return message
}
