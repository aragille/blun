import { useLang, setLang, type Lang } from '../lib/i18n'

const LANGS: Lang[] = ['en', 'ru']

export function LangSwitch() {
  const lang = useLang()
  return (
    <div className="lang-switch" role="radiogroup" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className={lang === l ? 'active' : ''}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
