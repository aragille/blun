import { useEffect, useState } from 'react'
import { useBlunData, addContact, updateContact, deleteContact } from '../lib/store'
import { Avatar, AvatarGlyph } from '../components/Avatar'
import { ConfirmModal } from '../components/ConfirmModal'
import { AVATAR_KEYS, randomAvatar } from '../lib/avatars'
import { firstName } from '../lib/format'
import { t, tp, useLang } from '../lib/i18n'
import type { Contact } from '../lib/types'

function AvatarPicker({
  value,
  onChange,
  hue = null,
}: {
  value: string
  onChange: (key: string) => void
  hue?: number | null
}) {
  return (
    <div className="avatar-picker" role="radiogroup">
      {AVATAR_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className={value === key ? 'active' : ''}
          onClick={() => onChange(key)}
          aria-label={key}
        >
          <AvatarGlyph variant={key} hue={value === key ? hue : null} />
        </button>
      ))}
    </div>
  )
}

function ContactCard({
  c,
  noteCount,
  editing,
  onStartEdit,
  onStopEdit,
}: {
  c: Contact
  noteCount: number
  editing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [name, setName] = useState(c.name)
  const [role, setRole] = useState(c.role)
  const [avatar, setAvatar] = useState(c.avatar)

  // entering edit mode (re)loads current values — leaving without saving reverts
  useEffect(() => {
    if (editing) {
      setName(c.name)
      setRole(c.role)
      setAvatar(c.avatar)
    }
  }, [editing, c.name, c.role, c.avatar])

  function save() {
    if (!name.trim()) return
    updateContact(c.id, { name: name.trim(), role: role.trim() || t('contacts.defaultRole'), avatar })
    onStopEdit()
  }

  if (editing) {
    return (
      <article className="entity-card editing">
        <AvatarPicker value={avatar} onChange={setAvatar} hue={c.hue} />
        <input value={name} onChange={(e) => setName(e.target.value)} aria-label={t('contacts.name')} placeholder={t('contacts.name')} autoFocus />
        <input className="small" value={role} onChange={(e) => setRole(e.target.value)} aria-label={t('contacts.rolePh')} placeholder={t('contacts.rolePh')} />
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
        <Avatar name={c.name} hue={c.hue} avatar={c.avatar} className="lg" />
        <div className="entity-info">
          <h3>{firstName(c.name)}</h3>
          <div className="sub">{c.role}</div>
        </div>
        <span className="stat">{tp('notes', noteCount)}</span>
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
      <ConfirmModal
        open={confirming}
        title={t('confirm.title.contact', { name: firstName(c.name) })}
        message={t('contacts.delete')}
        confirmLabel={t('confirm.delete')}
        onConfirm={() => deleteContact(c.id)}
        onClose={() => setConfirming(false)}
      />
    </article>
  )
}

export default function Contacts() {
  useLang()
  const data = useBlunData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [avatar, setAvatar] = useState(() => randomAvatar())

  const countFor = (id: string) => data.feedback.filter((f) => f.contactId === id).length

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addContact({ name, role: role.trim() || t('contacts.defaultRole'), avatar })
    setName('')
    setRole('')
    setAvatar(randomAvatar())
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>{t('contacts.title')}</h1>
        <p>{t('contacts.sub')}</p>
      </div>

      <div className="entity-list">
        {data.contacts.map((c) => (
          <ContactCard
            key={c.id}
            c={c}
            noteCount={countFor(c.id)}
            editing={editingId === c.id}
            onStartEdit={() => setEditingId(c.id)}
            onStopEdit={() => setEditingId(null)}
          />
        ))}

        <form className="add-form" onSubmit={submit}>
          <AvatarPicker value={avatar} onChange={setAvatar} />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('contacts.newName')}
            aria-label={t('contacts.name')}
          />
          <input
            className="small"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={t('contacts.role')}
            aria-label={t('contacts.rolePh')}
          />
          <button type="submit" className="btn btn-dark" disabled={!name.trim()}>
            {t('contacts.add')}
          </button>
        </form>
      </div>
    </div>
  )
}
