import { useLanguage, type Language } from '../lib/i18n'

const OPTIONS: { value: Language; label: string }[] = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'EN' },
]

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex rounded-full border border-gold/30 p-0.5 text-xs">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLanguage(opt.value)}
          aria-pressed={language === opt.value}
          className={`rounded-full px-2.5 py-1 transition ${
            language === opt.value
              ? 'bg-gold text-void'
              : 'text-paper-dim hover:text-paper'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
