import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo, Mark } from '../components/Logo'
import { Avatar } from '../components/Avatar'
import { LangSwitch } from '../components/LangSwitch'
import { addFeedback } from '../lib/store'
import { t, useLang } from '../lib/i18n'

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in')
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}s` } as React.CSSProperties}>
      {children}
    </div>
  )
}

const MARQUEE = [
  { name: 'Ana', hue: 330, avatar: 'v2', kind: 'idea' as const, key: 'mq.1' },
  { name: 'Jonas', hue: 152, avatar: 'v6', kind: 'issue' as const, key: 'mq.2' },
  { name: 'Mara', hue: 262, avatar: 'v5', kind: 'issue' as const, key: 'mq.3' },
  { name: 'Priya', hue: 24, avatar: 'v3', kind: 'praise' as const, key: 'mq.4' },
  { name: 'Theo', hue: 202, avatar: 'v8', kind: 'idea' as const, key: 'mq.5' },
  { name: 'Ana', hue: 330, avatar: 'v2', kind: 'praise' as const, key: 'mq.6' },
]

/* stars live in the side bands only — the centered copy stays clear */
const STARS = [
  { left: '4%', top: '14%', size: 22, d: '0s' },
  { left: '11%', top: '34%', size: 11, d: '2.1s' },
  { left: '7%', top: '52%', size: 14, d: '1.2s' },
  { left: '15%', top: '70%', size: 9, d: '2.6s' },
  { left: '5%', top: '84%', size: 16, d: '3.2s' },
  { right: '5%', top: '16%', size: 26, d: '0.6s' },
  { right: '13%', top: '36%', size: 10, d: '1.7s' },
  { right: '8%', top: '54%', size: 15, d: '2.8s' },
  { right: '15%', top: '72%', size: 9, d: '0.9s' },
  { right: '6%', top: '86%', size: 18, d: '2.3s' },
]

/* abstract visuals for the trio cards — monochrome shapes, one accent each */
function VisFeedback() {
  return (
    <svg className="trio-vis" viewBox="0 0 220 96" fill="none" aria-hidden="true">
      <circle cx="16" cy="18" r="5" fill="var(--praise)" />
      <rect x="32" y="13" width="128" height="10" rx="5" fill="rgba(10,10,10,0.10)" />
      <circle cx="16" cy="48" r="5" fill="var(--issue)" />
      <rect x="32" y="43" width="168" height="10" rx="5" fill="rgba(10,10,10,0.16)" />
      <circle cx="16" cy="78" r="5" fill="var(--idea)" />
      <rect x="32" y="73" width="96" height="10" rx="5" fill="rgba(10,10,10,0.10)" />
    </svg>
  )
}

function VisContacts() {
  return (
    <svg className="trio-vis" viewBox="0 0 220 96" fill="none" aria-hidden="true">
      <circle cx="76" cy="48" r="26" fill="rgba(10,10,10,0.08)" />
      <circle cx="110" cy="48" r="26" fill="var(--ink)" />
      <circle cx="144" cy="48" r="26" fill="hsl(262 80% 60%)" opacity="0.85" />
      <circle cx="144" cy="48" r="26" stroke="var(--bg)" strokeWidth="3" />
      <circle cx="110" cy="48" r="26" stroke="var(--bg)" strokeWidth="3" />
    </svg>
  )
}

function VisFeatures() {
  return (
    <svg className="trio-vis" viewBox="0 0 220 96" fill="none" aria-hidden="true">
      <rect x="66" y="10" width="26" height="26" rx="7" transform="rotate(45 79 23)" fill="rgba(10,10,10,0.10)" />
      <rect x="128" y="10" width="26" height="26" rx="7" transform="rotate(45 141 23)" fill="rgba(10,10,10,0.18)" />
      <rect x="66" y="58" width="26" height="26" rx="7" transform="rotate(45 79 71)" fill="var(--ink)" />
      <rect x="128" y="58" width="26" height="26" rx="7" transform="rotate(45 141 71)" fill="hsl(152 75% 45%)" />
    </svg>
  )
}

export default function Landing() {
  useLang()
  const [text, setText] = useState('')
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      navigate('/app')
      return
    }
    const fb = addFeedback({ text: trimmed })
    navigate('/app', { state: { flashId: fb.id } })
  }

  return (
    <div className="landing">
      <header className="landing-nav">
        <Link to="/" aria-label="blun home">
          <Logo size={19} />
        </Link>
        <nav className="links">
          <a href="#product">{t('nav.product')}</a>
          <a href="#how">{t('nav.how')}</a>
        </nav>
        <Link to="/app" className="btn btn-dark">
          {t('nav.open')}
        </Link>
      </header>

      <div className="float-lang">
        <LangSwitch />
      </div>

      <section className="hero">
        <div className="hero-blob a" aria-hidden="true" />
        <div className="hero-blob b" aria-hidden="true" />

        <div className="rise" style={{ '--d': '0.1s' } as React.CSSProperties}>
          <span className="hero-badge">
            <span className="kind-dot praise" />
            {t('hero.badge')}
          </span>
        </div>

        <h1 className="rise" style={{ '--d': '0.25s' } as React.CSSProperties}>
          {t('hero.t1')} <span className="serif">{t('hero.t2')}</span>
        </h1>

        <p className="hero-sub rise" style={{ '--d': '0.4s' } as React.CSSProperties}>
          {t('hero.sub')}
        </p>

        <form className="hero-composer rise" style={{ '--d': '0.55s' } as React.CSSProperties} onSubmit={submit}>
          <Mark size={18} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('hero.placeholder')}
            aria-label={t('hero.placeholder')}
            autoFocus
          />
          <button type="submit" className="btn btn-dark">
            {t('hero.save')}
          </button>
        </form>

        <p className="hero-hint rise" style={{ '--d': '0.7s' } as React.CSSProperties}>
          {t('hero.hint.pre')} <kbd>{t('hero.hint.key')}</kbd> {t('hero.hint.post')}
        </p>

        <div className="marquee-section hero-marquee rise" style={{ '--d': '0.85s' } as React.CSSProperties} aria-hidden="true">
          <div className="marquee">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="marquee-card">
                <Avatar name={m.name} hue={m.hue} avatar={m.avatar} />
                {t(m.key)}
                <span className={`kind-dot ${m.kind}`} />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="product">
        <Reveal>
          <div className="section-head">
            <span className="mono-label">{t('product.label')}</span>
            <h2>
              {t('product.t1')} <span className="serif">{t('product.t2')}</span>
            </h2>
            <p>{t('product.sub')}</p>
          </div>
        </Reveal>
        <div className="trio">
          <Reveal delay={0}>
            <div className="trio-card">
              <VisFeedback />
              <h3>{t('trio.feedback.title')}</h3>
              <p>{t('trio.feedback.desc')}</p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="trio-card">
              <VisContacts />
              <h3>{t('trio.contacts.title')}</h3>
              <p>{t('trio.contacts.desc')}</p>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="trio-card">
              <VisFeatures />
              <h3>{t('trio.features.title')}</h3>
              <p>{t('trio.features.desc')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="how">
        <Reveal>
          <div className="section-head">
            <span className="mono-label">{t('how.label')}</span>
            <h2>
              {t('how.t1')} <span className="serif">{t('how.t2')}</span>
            </h2>
          </div>
        </Reveal>
        <div className="steps">
          {([1, 2, 3] as const).map((i, idx) => (
            <Reveal key={i} delay={idx * 0.12}>
              <div className="step">
                <h3>{t(`step.${i}.title`)}</h3>
                <p>{t(`step.${i}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="cta-final">
          <div className="stars" aria-hidden="true">
            {STARS.map((s, i) => (
              <span
                key={i}
                className="star"
                style={{ left: s.left, right: s.right, top: s.top, '--d': s.d } as React.CSSProperties}
              >
                <Mark size={s.size} />
              </span>
            ))}
          </div>
          <h2>
            {t('cta.t1')} <span className="serif">{t('cta.t2')}</span> {t('cta.t3')}
          </h2>
          <p>{t('cta.sub')}</p>
          <Link to="/app" className="btn">
            {t('cta.btn')}
          </Link>
        </section>
      </Reveal>

      <footer className="landing-footer">
        <Logo size={15} />
        <span className="mono-label">
          {t('footer.tag')} {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
