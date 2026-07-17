import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { LangSwitch } from '../components/LangSwitch'
import { ConfirmModal } from '../components/ConfirmModal'
import { useBlunData, resetToSeed } from '../lib/store'
import { t, useLang } from '../lib/i18n'

export default function AppLayout() {
  useLang()
  const data = useBlunData()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const newCount = data.feedback.filter((f) => f.status === 'new').length

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" aria-label="blun">
          <Logo size={19} />
        </Link>
        <nav>
          <NavLink to="/app" end className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            {t('side.inbox')}
            {newCount > 0 && <span className="count">{newCount}</span>}
          </NavLink>
          <NavLink to="/app/contacts" className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            {t('side.contacts')}
            <span className="count">{data.contacts.length}</span>
          </NavLink>
          <NavLink to="/app/features" className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            {t('side.features')}
            <span className="count">{data.features.length}</span>
          </NavLink>
        </nav>
        <div className="foot">
          <LangSwitch />
          <button type="button" className="side-link" onClick={() => setConfirmingReset(true)}>
            {t('side.reset')}
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
      <ConfirmModal
        open={confirmingReset}
        title={t('confirm.title.reset')}
        message={t('confirm.msg.reset')}
        confirmLabel={t('confirm.reset')}
        onConfirm={resetToSeed}
        onClose={() => setConfirmingReset(false)}
      />
    </div>
  )
}
