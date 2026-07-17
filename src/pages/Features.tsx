import { useEffect, useState } from 'react'
import { useBlunData, addFeature, updateFeature, updateFeedback, deleteFeature } from '../lib/store'
import { Select } from '../components/Select'
import { ConfirmModal } from '../components/ConfirmModal'
import { t, tp, useLang } from '../lib/i18n'
import type { Feature, Feedback } from '../lib/types'

function FeatureCard({
  f,
  linked,
  linkable,
  editing,
  onStartEdit,
  onStopEdit,
}: {
  f: Feature
  linked: Feedback[]
  linkable: Feedback[]
  editing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [name, setName] = useState(f.name)
  const [description, setDescription] = useState(f.description)

  // entering edit mode (re)loads current values — leaving without saving reverts
  useEffect(() => {
    if (editing) {
      setName(f.name)
      setDescription(f.description)
    }
  }, [editing, f.name, f.description])

  function save() {
    if (!name.trim()) return
    updateFeature(f.id, { name: name.trim(), description: description.trim() })
    onStopEdit()
  }

  if (editing) {
    return (
      <article className="entity-card editing">
        <span className="feature-dot" style={{ '--hue': f.hue } as React.CSSProperties} />
        <input value={name} onChange={(e) => setName(e.target.value)} aria-label={t('features.namePh')} placeholder={t('features.namePh')} autoFocus />
        <input
          className="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label={t('features.desc')}
          placeholder={t('features.desc')}
        />
        <div className="edit-actions">
          <button type="button" className="btn btn-ghost" onClick={onStopEdit}>
            {t('btn.cancel')}
          </button>
          <button type="button" className="btn btn-dark" onClick={save} disabled={!name.trim()}>
            {t('btn.save')}
          </button>
        </div>
      </article>
    )
  }

  return (
    <article className="entity-card">
      <div className="entity-main">
        <span className="feature-dot" style={{ '--hue': f.hue } as React.CSSProperties} />
        <div className="entity-info">
          <h3>{f.name}</h3>
          <div className="sub">{f.description || '—'}</div>
        </div>
        <span className="stat">{tp('notes', linked.length)}</span>
        <span className="card-actions">
          <button type="button" className="icon-btn" onClick={onStartEdit} aria-label={t('action.edit')} title={t('action.edit')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3l4 4L8 20l-5 1 1-5L17 3z" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setConfirming(true)}
            aria-label={t('action.delete')}
            title={t('action.delete')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </span>
      </div>

      <div className="linked-list">
        {linked.map((fb) => (
          <span key={fb.id} className="linked-row">
            <span className={`kind-dot ${fb.kind}`} />
            <span className="txt">{fb.text}</span>
            <button
              type="button"
              className="unlink"
              onClick={() => updateFeedback(fb.id, { featureId: null })}
              aria-label={t('action.unlink')}
              title={t('action.unlink')}
            >
              ×
            </button>
          </span>
        ))}
        {linkable.length > 0 && (
          <Select
            value=""
            onChange={(v) => updateFeedback(v, { featureId: f.id })}
            options={linkable.map((fb) => ({
              value: fb.id,
              label: fb.text.length > 46 ? fb.text.slice(0, 46) + '…' : fb.text,
            }))}
            placeholder={t('features.link')}
            ariaLabel={t('features.link')}
            className="link-select"
          />
        )}
      </div>
      <ConfirmModal
        open={confirming}
        title={t('confirm.title.feature', { name: f.name })}
        message={t('features.delete')}
        confirmLabel={t('confirm.delete')}
        onConfirm={() => deleteFeature(f.id)}
        onClose={() => setConfirming(false)}
      />
    </article>
  )
}

export default function Features() {
  useLang()
  const data = useBlunData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')

  const q = search.trim().toLowerCase()
  const visible = q
    ? data.features.filter((f) => (f.name + ' ' + f.description).toLowerCase().includes(q))
    : data.features

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addFeature({ name, description })
    setName('')
    setDescription('')
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>{t('features.title')}</h1>
        <p>{t('features.sub')}</p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.5-4.5" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search.features')}
            aria-label={t('search.features')}
          />
          {search && (
            <button type="button" className="clear-btn" onClick={() => setSearch('')} aria-label="×">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="entity-list">
        {visible.map((f) => (
          <FeatureCard
            key={f.id}
            f={f}
            linked={data.feedback.filter((fb) => fb.featureId === f.id)}
            linkable={data.feedback.filter((fb) => fb.featureId !== f.id)}
            editing={editingId === f.id}
            onStartEdit={() => setEditingId(f.id)}
            onStopEdit={() => setEditingId(null)}
          />
        ))}

        {!q && (
          <form className="add-form" onSubmit={submit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('features.newName')}
              aria-label={t('features.namePh')}
            />
            <input
              className="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('features.desc')}
              aria-label={t('features.desc')}
            />
            <button type="submit" className="btn btn-dark" disabled={!name.trim()}>
              {t('features.add')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
