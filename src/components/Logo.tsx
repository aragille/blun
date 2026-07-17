export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg
      className="blun-mark"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 1.5C13.1 8 16 10.9 22.5 12C16 13.1 13.1 16 12 22.5C10.9 16 8 13.1 1.5 12C8 10.9 10.9 8 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="blun-logo">
      <Mark size={size} />
      <span className="blun-word">blun</span>
    </span>
  )
}
