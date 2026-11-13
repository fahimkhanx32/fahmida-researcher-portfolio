import { LuImage } from 'react-icons/lu'

// Neutral stand-in for imagery that has not been supplied. Never imitates a real photograph.
export default function ImagePlaceholder({ label = 'Image to be added', className = '' }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br from-sage to-surface-2 text-muted ${className}`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <defs>
          <pattern id="folio-hex" width="28" height="24" patternUnits="userSpaceOnUse">
            <path d="M7 0l7 4v8l-7 4-7-4V4zM21 12l7 4v8l-7 4-7-4v-8z" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#folio-hex)" />
      </svg>
      <LuImage className="relative h-6 w-6" aria-hidden="true" />
      <span className="relative text-xs font-medium tracking-wide">{label}</span>
    </div>
  )
}
