import { useEffect, useRef, useState } from 'react'
import { t, tp } from '../lib/i18n'

function normalize(tag: string): string {
  return tag.trim().replace(/^#/, '').toLowerCase()
}

const MAX_VISIBLE_CHIPS = 2

export function TagInput({
  value,
  onChange,
  suggestions,
  autoFocus = false,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
  autoFocus?: boolean
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(autoFocus)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const q = normalize(query)
  const matching = suggestions.filter((s) => !value.includes(s) && (!q || s.includes(q)))
  const canAddNew = q.length > 0 && !value.includes(q) && !suggestions.includes(q)
  const collapsed = value.length > MAX_VISIBLE_CHIPS

  function add(tag: string) {
    const tg = normalize(tag)
    if (!tg || value.includes(tg)) return
    onChange([...value, tg])
    setQuery('')
    inputRef.current?.focus()
  }

  function remove(tag: string) {
    onChange(value.filter((x) => x !== tag))
    inputRef.current?.focus()
  }

  return (
    <div className="tag-input-wrap" ref={ref}>
      <div
        className="tag-input-box"
        onClick={() => {
          inputRef.current?.focus()
          setOpen(true)
        }}
      >
        {collapsed ? (
          <span className="tag hash summary">{tp('tags.selected', value.length)}</span>
        ) : (
          value.map((tag) => (
            <span key={tag} className="tag hash">
              #{tag}
              <button
                type="button"
                className="tag-x"
                onClick={(e) => {
                  e.stopPropagation()
                  remove(tag)
                }}
                aria-label={`× ${tag}`}
              >
                ×
              </button>
            </span>
          ))
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (q) add(q)
              else if (matching.length) add(matching[0])
            }
            if (e.key === 'Backspace' && !query && value.length) {
              remove(value[value.length - 1])
            }
          }}
          placeholder={value.length ? '' : t('tags.add')}
          aria-label={t('field.tags')}
          autoFocus={autoFocus}
        />
      </div>
      {open && (value.length > 0 || matching.length > 0 || canAddNew) && (
        <div className="select-menu tag-menu" role="listbox" aria-label={t('field.tags')}>
          {value.map((tag) => (
            <button key={tag} type="button" className="select-option selected" onClick={() => remove(tag)}>
              <span className="select-option-label">
                <span className="tag hash">#{tag}</span>
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ))}
          {canAddNew && (
            <button type="button" className="select-option add-new" onClick={() => add(q)}>
              <span className="select-option-label">
                {t('tags.addNew')} <span className="tag hash">#{q}</span>
              </span>
              <span className="mono-hint">↵</span>
            </button>
          )}
          {matching.map((s) => (
            <button key={s} type="button" className="select-option" onClick={() => add(s)}>
              <span className="select-option-label">
                <span className="tag hash">#{s}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
