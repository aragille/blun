import { useState } from 'react'
import { Select } from './Select'
import { TagInput } from './TagInput'
import { firstName } from '../lib/format'
import { t } from '../lib/i18n'
import type { Contact, Feature, Feedback, FeedbackKind, FeedbackPriority, FeedbackSource } from '../lib/types'

const KINDS: FeedbackKind[] = ['praise', 'issue', 'idea']
const SOURCES: FeedbackSource[] = ['slack', 'email', 'meeting', 'call', 'support', 'other']
export const PRIORITIES: FeedbackPriority[] = ['low', 'medium', 'high']

type OptionalField = 'source' | 'priority' | 'contact' | 'feature' | 'tags'
const FIELDS: OptionalField[] = ['source', 'priority', 'contact', 'feature', 'tags']

export interface FeedbackFormValues {
  text: string
  kind: FeedbackKind
  source: FeedbackSource
  priority: FeedbackPriority | null
  tags: string[]
  contactId: string | null
  featureId: string | null
}

export function FeedbackForm({
  initial,
  contacts,
  features,
  tagSuggestions,
  submitLabel,
  placeholder,
  autoFocus = false,
  resetOnSubmit = false,
  onSubmit,
  onCancel,
}: {
  initial?: Feedback
  contacts: Contact[]
  features: Feature[]
  tagSuggestions: string[]
  submitLabel: string
  placeholder?: string
  autoFocus?: boolean
  resetOnSubmit?: boolean
  onSubmit: (values: FeedbackFormValues) => void
  onCancel?: () => void
}) {
  const [text, setText] = useState(initial?.text ?? '')
  const [kind, setKind] = useState<FeedbackKind>(initial?.kind ?? 'idea')
  const [source, setSource] = useState<FeedbackSource | ''>(
    initial && initial.source !== 'other' ? initial.source : '',
  )
  const [priority, setPriority] = useState<FeedbackPriority | ''>(initial?.priority ?? '')
  const [contactId, setContactId] = useState(initial?.contactId ?? '')
  const [featureId, setFeatureId] = useState(initial?.featureId ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [active, setActive] = useState<OptionalField[]>(() => {
    const a: OptionalField[] = []
    if (initial?.source && initial.source !== 'other') a.push('source')
    if (initial?.priority) a.push('priority')
    if (initial?.contactId) a.push('contact')
    if (initial?.featureId) a.push('feature')
    if (initial?.tags.length) a.push('tags')
    return a
  })
  // the field just added via "+ Field" mounts with its dropdown already open
  const [justAdded, setJustAdded] = useState<OptionalField | null>(null)

  function addField(f: OptionalField) {
    // newest field leads the active row, which sits on its own line above the chips
    setActive((a) => [f, ...a])
    setJustAdded(f)
  }

  function removeField(f: OptionalField) {
    setActive((a) => a.filter((x) => x !== f))
    if (justAdded === f) setJustAdded(null)
    if (f === 'source') setSource('')
    if (f === 'priority') setPriority('')
    if (f === 'contact') setContactId('')
    if (f === 'feature') setFeatureId('')
    if (f === 'tags') setTags([])
  }

  /** empty option chosen → the field folds back into its "+ Field" chip */
  function changeOrRemove(f: OptionalField, v: string, set: (v: string) => void) {
    if (v === '') removeField(f)
    else set(v)
  }

  function reset() {
    setText('')
    setKind('idea')
    setSource('')
    setPriority('')
    setContactId('')
    setFeatureId('')
    setTags([])
    setActive([])
    setJustAdded(null)
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim()) return
    onSubmit({
      text: text.trim(),
      kind,
      source: source || 'other',
      priority: priority || null,
      tags,
      contactId: contactId || null,
      featureId: featureId || null,
    })
    if (resetOnSubmit) reset()
  }

  const inactive = FIELDS.filter((f) => !active.includes(f))

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        placeholder={placeholder ?? t('composer.placeholder')}
        aria-label={t('composer.placeholder')}
        autoFocus={autoFocus}
      />

      <div className="composer-row">
        <div className="kind-picker" role="radiogroup" aria-label={t('filter.kind')}>
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              className={kind === k ? 'active' : ''}
              onClick={() => setKind(k)}
            >
              <span className={`kind-dot ${k}`} />
              {t(`kind.${k}`)}
            </button>
          ))}
        </div>
        <span className="spacer" />
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {t('btn.cancel')}
          </button>
        )}
        <button type="submit" className="btn btn-dark" disabled={!text.trim()}>
          {submitLabel}
        </button>
      </div>

      {active.length > 0 && (
        <div className="composer-row fields-row active-fields">
          {active.map((f) => (
          <span key={f} className="field-slot">
            {f === 'source' && (
              <Select
                value={source}
                onChange={(v) => changeOrRemove('source', v, (x) => setSource(x as FeedbackSource))}
                options={[
                  { value: '', label: t('sel.noSource'), muted: true },
                  ...SOURCES.map((s) => ({ value: s, label: t(`via.${s}`) })),
                ]}
                placeholder={t('sel.source')}
                ariaLabel={t('field.source')}
                initialOpen={justAdded === 'source'}
                onDismiss={() => {
                  if (!source) removeField('source')
                }}
              />
            )}
            {f === 'priority' && (
              <Select
                value={priority}
                onChange={(v) => changeOrRemove('priority', v, (x) => setPriority(x as FeedbackPriority))}
                options={[
                  { value: '', label: t('sel.noPriority'), muted: true },
                  ...PRIORITIES.map((p) => ({
                    value: p,
                    label: <span className={`prio ${p}`}>{t(`prio.${p}`)}</span>,
                  })),
                ]}
                placeholder={t('sel.priority')}
                ariaLabel={t('field.priority')}
                initialOpen={justAdded === 'priority'}
                onDismiss={() => {
                  if (!priority) removeField('priority')
                }}
              />
            )}
            {f === 'contact' && (
              <Select
                value={contactId}
                onChange={(v) => changeOrRemove('contact', v, setContactId)}
                options={[
                  { value: '', label: t('sel.noContact'), muted: true },
                  ...contacts.map((c) => ({ value: c.id, label: firstName(c.name) })),
                ]}
                placeholder={t('sel.contact')}
                ariaLabel={t('field.contact')}
                initialOpen={justAdded === 'contact'}
                onDismiss={() => {
                  if (!contactId) removeField('contact')
                }}
              />
            )}
            {f === 'feature' && (
              <Select
                value={featureId}
                onChange={(v) => changeOrRemove('feature', v, setFeatureId)}
                options={[
                  { value: '', label: t('sel.noFeature'), muted: true },
                  ...features.map((ft) => ({ value: ft.id, label: ft.name })),
                ]}
                placeholder={t('sel.feature')}
                ariaLabel={t('field.feature')}
                initialOpen={justAdded === 'feature'}
                onDismiss={() => {
                  if (!featureId) removeField('feature')
                }}
              />
            )}
            {f === 'tags' && (
              <TagInput
                value={tags}
                onChange={setTags}
                suggestions={tagSuggestions}
                autoFocus={justAdded === 'tags'}
              />
            )}
            <button
              type="button"
              className="field-remove"
              onClick={() => removeField(f)}
              aria-label={`${t('action.delete')}: ${t(`field.${f}`)}`}
            >
              ×
            </button>
          </span>
          ))}
        </div>
      )}

      {inactive.length > 0 && (
        <div className="composer-row fields-row chips-row">
          {inactive.map((f) => (
            <button key={f} type="button" className="add-field-chip" onClick={() => addField(f)}>
              + {t(`field.${f}`)}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
