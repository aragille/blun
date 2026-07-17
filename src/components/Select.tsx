import { useEffect, useRef, useState } from 'react'

export interface SelectOption {
  value: string
  label: React.ReactNode
  /** neutral styling for "none / any" options */
  muted?: boolean
}

export function Select({
  value,
  onChange,
  options,
  placeholder = '…',
  ariaLabel,
  className = '',
  initialOpen = false,
  onDismiss,
}: {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  ariaLabel: string
  className?: string
  initialOpen?: boolean
  /** called when the menu closes without a selection (outside click, Escape, trigger toggle) */
  onDismiss?: () => void
}) {
  const [open, setOpen] = useState(initialOpen)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  function dismiss() {
    setOpen(false)
    onDismiss?.()
  }

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) dismiss()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div className={`select ${className}`} ref={ref}>
      <button
        type="button"
        className={`select-trigger${open ? ' open' : ''}${selected ? '' : ' empty'}`}
        onClick={() => (open ? dismiss() : setOpen(true))}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="select-value">{selected ? selected.label : placeholder}</span>
        <svg className="chev" width="8" height="5" viewBox="0 0 8 5" fill="none">
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              className={`select-option${o.value === value ? ' selected' : ''}${o.muted ? ' muted' : ''}`}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              <span className="select-option-label">{o.label}</span>
              {o.value === value && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
