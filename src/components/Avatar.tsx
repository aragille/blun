import { isAvatarKey } from '../lib/avatars'
import { initials } from '../lib/format'

const INK = '#181410'

/** Variant-specific hair/accessory, drawn above the shared face. */
function Hair({ variant }: { variant: string }) {
  switch (variant) {
    case 'v1': // straight fringe
      return <rect x="12.2" y="10.6" width="15.6" height="4.6" rx="2.3" fill={INK} />
    case 'v2': // bun
      return (
        <>
          <circle cx="20" cy="7.8" r="3.1" fill={INK} />
          <path d="M12.8 14.4 Q20 8.2 27.2 14.4" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      )
    case 'v3': // long hair
      return (
        <>
          <path d="M12.4 14 Q20 7.8 27.6 14" stroke={INK} strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <rect x="9.6" y="13" width="4" height="13.4" rx="2" fill={INK} />
          <rect x="26.4" y="13" width="4" height="13.4" rx="2" fill={INK} />
        </>
      )
    case 'v4': // curls
      return (
        <>
          <circle cx="13.6" cy="12" r="3" fill={INK} />
          <circle cx="20" cy="9.8" r="3" fill={INK} />
          <circle cx="26.4" cy="12" r="3" fill={INK} />
        </>
      )
    case 'v5': // side swoosh
      return <path d="M12.2 15.4 Q13.6 8.2 22.6 9" stroke={INK} strokeWidth="4.4" strokeLinecap="round" fill="none" />
    case 'v6': // glasses, no hair
      return (
        <>
          <circle cx="14.8" cy="20.5" r="4" stroke={INK} strokeWidth="1.7" fill="none" />
          <circle cx="25.2" cy="20.5" r="4" stroke={INK} strokeWidth="1.7" fill="none" />
          <path d="M18.8 20.5 L21.2 20.5" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
        </>
      )
    case 'v7': // beanie
      return (
        <>
          <circle cx="20" cy="6.6" r="1.9" fill={INK} />
          <rect x="11.4" y="8.8" width="17.2" height="6" rx="3" fill={INK} />
        </>
      )
    case 'v8': // spikes
      return (
        <path
          d="M12.6 13.4 L15.4 9.6 L18.2 13 L21 9.4 L23.8 13 L26.8 10"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )
    default:
      return null
  }
}

export function AvatarGlyph({ variant, hue }: { variant: string; hue: number | null }) {
  const disc = hue === null ? 'hsl(0 0% 89%)' : `hsl(${hue} 72% 86%)`
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill={disc} />
      <circle cx="14.8" cy="20.5" r="1.7" fill={INK} />
      <circle cx="25.2" cy="20.5" r="1.7" fill={INK} />
      <path d="M15.8 26.2 Q20 29.4 24.2 26.2" stroke={INK} strokeWidth="1.9" strokeLinecap="round" fill="none" />
      <Hair variant={variant} />
    </svg>
  )
}

export function Avatar({
  name,
  hue,
  avatar,
  className = '',
}: {
  name: string
  hue: number
  avatar?: string | null
  className?: string
}) {
  if (isAvatarKey(avatar)) {
    return (
      <span className={`avatar glyph ${className}`}>
        <AvatarGlyph variant={avatar} hue={hue} />
      </span>
    )
  }
  return (
    <span className={`avatar ${className}`} style={{ '--hue': hue } as React.CSSProperties}>
      {initials(name)}
    </span>
  )
}
