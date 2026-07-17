import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Mark } from '../components/Logo'
import { Avatar } from '../components/Avatar'
import { Popover } from '../components/Popover'
import { Select } from '../components/Select'
import { ConfirmModal } from '../components/ConfirmModal'
import { FeedbackForm, PRIORITIES } from '../components/FeedbackForm'
import { useBlunData, addFeedback, updateFeedback, cycleStatus, deleteFeedback } from '../lib/store'
import type { Contact, Feature, Feedback, FeedbackKind, FeedbackPriority, FeedbackSource, FeedbackStatus } from '../lib/types'
import { timeAgo, firstName } from '../lib/format'
import { t, tp, useLang } from '../lib/i18n'

const KINDS: FeedbackKind[] = ['praise', 'issue', 'idea']
const SOURCES: FeedbackSource[] = ['slack', 'email', 'meeting', 'call', 'support', 'other']
const STATUSES: FeedbackStatus[] = ['new', 'reviewed', 'done']

function FeedbackCard({
  f,
  contact,
  feature,
  contacts,
  features,
  tagSuggestions,
  flash,
}: {
  f: Feedback
  contact: Contact | null
  feature: Feature | null
  contacts: Contact[]
  features: Feature[]
  tagSuggestions: string[]
  flash: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  if (editing) {
    return (
      <FeedbackForm
        initial={f}
        contacts={contacts}
        features={features}
        tagSuggestions={tagSuggestions}
        submitLabel={t('btn.saveChanges')}
        autoFocus
        onCancel={() => setEditing(false)}
        onSubmit={(values) => {
          updateFeedback(f.id, values)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <article className={`feed-card ${f.status}${flash ? ' flash' : ''}`}>
      <div className="top">
        <span className={`kind-dot ${f.kind}`} />
        {contact ? (
          <>
            <Avatar name={contact.name} hue={contact.hue} avatar={contact.avatar} />
            <span className="who">{firstName(contact.name)}</span>
          </>
        ) : (
          <span className="who" style={{ color: 'var(--ink-3)' }}>{t('unattributed')}</span>
        )}
        <span className="when">
          {timeAgo(f.createdAt)} · {t(`via.${f.source}`)}
        </span>
        <span className="spacer" />
        {f.priority && (
          <span className={`prio ${f.priority}`} title={t(`prio.${f.priority}`)}>
            {t(`prio.${f.priority}`)}
          </span>
        )}
        <button
          type="button"
          className={`status-pill ${f.status}`}
          onClick={() => cycleStatus(f.id)}
          title={t('status.cycle')}
        >
          {t(`status.${f.status}`)}
        </button>
      </div>
      <p className="text">{f.text}</p>
      <div className="bottom">
        {feature && (
          <span className="tag">
            <span className="feature-dot" style={{ '--hue': feature.hue } as React.CSSProperties} />
            {feature.name}
          </span>
        )}
        {f.tags.map((tag) => (
          <span key={tag} className="tag hash">#{tag}</span>
        ))}
        <span className="row-actions">
          <button type="button" className="icon-btn" onClick={() => setEditing(true)} aria-label={t('action.edit')} title={t('action.edit')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3l4 4L8 20l-5 1 1-5L17 3z" />
            </svg>
          </button>
          <button type="button" className="icon-btn" onClick={() => setConfirming(true)} aria-label={t('action.delete')} title={t('action.delete')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
            </svg>
          </button>
        </span>
      </div>
      <ConfirmModal
        open={confirming}
        title={t('confirm.title.feedback')}
        message={t('confirm.msg.feedback')}
        confirmLabel={t('confirm.delete')}
        onConfirm={() => deleteFeedback(f.id)}
        onClose={() => setConfirming(false)}
      />
    </article>
  )
}

export default function Inbox() {
  useLang()
  const data = useBlunData()
  const location = useLocation()
  const flashId = (location.state as { flashId?: string } | null)?.flashId ?? null

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all')
  const [kindFilter, setKindFilter] = useState<FeedbackKind | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<FeedbackSource | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority | 'all'>('all')
  const [featureFilter, setFeatureFilter] = useState('')
  const [contactFilter, setContactFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [flash, setFlash] = useState(flashId)

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(null), 2600)
    return () => clearTimeout(timer)
  }, [flash])

  const contactById = new Map(data.contacts.map((c) => [c.id, c]))
  const featureById = new Map(data.features.map((f) => [f.id, f]))
  const tagSuggestions = [...new Set(data.feedback.flatMap((f) => f.tags))].sort()

  const activeFilterCount =
    (kindFilter !== 'all' ? 1 : 0) +
    (sourceFilter !== 'all' ? 1 : 0) +
    (priorityFilter !== 'all' ? 1 : 0) +
    (featureFilter ? 1 : 0) +
    (contactFilter ? 1 : 0)

  function clearFilters() {
    setKindFilter('all')
    setSourceFilter('all')
    setPriorityFilter('all')
    setFeatureFilter('')
    setContactFilter('')
  }

  const q = search.trim().toLowerCase()
  const visible = data.feedback.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false
    if (kindFilter !== 'all' && f.kind !== kindFilter) return false
    if (sourceFilter !== 'all' && f.source !== sourceFilter) return false
    if (priorityFilter !== 'all' && f.priority !== priorityFilter) return false
    if (featureFilter && f.featureId !== featureFilter) return false
    if (contactFilter && f.contactId !== contactFilter) return false
    if (q) {
      const contact = f.contactId ? contactById.get(f.contactId) : null
      const feature = f.featureId ? featureById.get(f.featureId) : null
      const hay = [f.text, ...f.tags, contact?.name ?? '', feature?.name ?? '', f.source]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const newCount = data.feedback.filter((f) => f.status === 'new').length

  return (
    <div className="page">
      <div className="page-head">
        <h1>{t('inbox.title')}</h1>
        <p>
          {tp('notes', data.feedback.length)} · {tp('newcount', newCount)}
        </p>
      </div>

      <FeedbackForm
        contacts={data.contacts}
        features={data.features}
        tagSuggestions={tagSuggestions}
        submitLabel={t('btn.save')}
        resetOnSubmit
        onSubmit={(values) => {
          const fb = addFeedback(values)
          setFlash(fb.id)
        }}
      />

      <div className="toolbar">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.5-4.5" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search.feedback')}
            aria-label={t('search.feedback')}
          />
          {search && (
            <button type="button" className="clear-btn" onClick={() => setSearch('')} aria-label="×">
              ×
            </button>
          )}
        </div>
        <Popover
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          align="right"
          trigger={
            <button
              type="button"
              className={`filter-chip filters-btn${activeFilterCount > 0 ? ' active' : ''}`}
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 5h18M7 12h10M10 19h4" />
              </svg>
              {t('filter.btn')}
              {activeFilterCount > 0 && <span className="badge">{activeFilterCount}</span>}
            </button>
          }
        >
          <div className="pop-section">
            <span className="mono-label">{t('filter.kind')}</span>
            <div className="pop-chips">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`filter-chip${kindFilter === k ? ' active' : ''}`}
                  onClick={() => setKindFilter(kindFilter === k ? 'all' : k)}
                >
                  <span className={`kind-dot ${k}`} />
                  {t(`kind.${k}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="pop-section">
            <span className="mono-label">{t('filter.source')}</span>
            <div className="pop-chips">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`filter-chip${sourceFilter === s ? ' active' : ''}`}
                  onClick={() => setSourceFilter(sourceFilter === s ? 'all' : s)}
                >
                  {t(`src.${s}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="pop-section">
            <span className="mono-label">{t('filter.priority')}</span>
            <div className="pop-chips">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`prio ${p} prio-select${priorityFilter === p ? ' on' : ''}`}
                  onClick={() => setPriorityFilter(priorityFilter === p ? 'all' : p)}
                >
                  {t(`prio.${p}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="pop-section">
            <span className="mono-label">{t('filter.linked')}</span>
            <div className="pop-chips">
              <Select
                value={contactFilter}
                onChange={setContactFilter}
                options={[
                  { value: '', label: t('filter.anyContact'), muted: true },
                  ...data.contacts.map((c) => ({ value: c.id, label: firstName(c.name) })),
                ]}
                ariaLabel={t('field.contact')}
              />
              <Select
                value={featureFilter}
                onChange={setFeatureFilter}
                options={[
                  { value: '', label: t('filter.anyFeature'), muted: true },
                  ...data.features.map((f) => ({ value: f.id, label: f.name })),
                ]}
                ariaLabel={t('field.feature')}
              />
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button type="button" className="pop-clear" onClick={clearFilters}>
              {t('filter.clear')}
            </button>
          )}
        </Popover>
      </div>

      <div className="filter-row">
        <button
          type="button"
          className={`filter-chip${statusFilter === 'all' ? ' active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          {t('filter.all')}
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`filter-chip${statusFilter === s ? ' active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
          >
            {t(`status.${s}`)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <Mark size={30} />
          <p>{t('inbox.empty')}</p>
        </div>
      ) : (
        <div className="feed-list">
          {visible.map((f) => (
            <FeedbackCard
              key={f.id}
              f={f}
              contact={f.contactId ? contactById.get(f.contactId) ?? null : null}
              feature={f.featureId ? featureById.get(f.featureId) ?? null : null}
              contacts={data.contacts}
              features={data.features}
              tagSuggestions={tagSuggestions}
              flash={flash === f.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
