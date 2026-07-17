/**
 * Minimal in-house avatar glyphs — a hue-tinted disc with a tiny ink face.
 * No images: each avatar is an SVG variant drawn in code, so it always
 * matches the black/white design language.
 */

export const AVATAR_KEYS = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8']

export function isAvatarKey(key: string | null | undefined): key is string {
  return !!key && AVATAR_KEYS.includes(key)
}

export function randomAvatar(): string {
  return AVATAR_KEYS[Math.floor(Math.random() * AVATAR_KEYS.length)]
}

/** Deterministic avatar for contacts that predate the avatar field. */
export function avatarForId(id: string): string {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0
  return AVATAR_KEYS[Math.abs(h) % AVATAR_KEYS.length]
}
