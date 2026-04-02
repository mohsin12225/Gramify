/**
 * Single source of truth for the app logo.
 * Uses the exact same design as public/favicon.svg.
 *
 * Sizes: xs (20), sm (28), md (40), lg (64), xl (80)
 */

const sizes = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 64,
  xl: 80,
}

export default function Logo({ size = 'md', className = '' }) {
  const px = typeof size === 'number' ? size : sizes[size] || sizes.md

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AI Grammar Fixer logo"
    >
      <path
        d="M24 2L27.5 17.5L43 21L27.5 24.5L24 40L20.5 24.5L5 21L20.5 17.5Z"
        fill="#a78bfa"
      />
      <path
        d="M38 6L39.5 11.5L45 13L39.5 14.5L38 20L36.5 14.5L31 13L36.5 11.5Z"
        fill="#c4b5fd"
        opacity="0.8"
      />
      <path
        d="M10 32L11 35L14 36L11 37L10 40L9 37L6 36L9 35Z"
        fill="#c4b5fd"
        opacity="0.6"
      />
    </svg>
  )
}