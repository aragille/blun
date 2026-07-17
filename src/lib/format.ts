import { getLang, t } from './i18n'

export function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return t('time.now')
  const m = Math.floor(s / 60)
  if (m < 60) return t('time.m', { n: m })
  const h = Math.floor(m / 60)
  if (h < 24) return t('time.h', { n: h })
  const d = Math.floor(h / 24)
  if (d < 30) return t('time.d', { n: d })
  return new Date(ts).toLocaleDateString(getLang() === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0]
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
