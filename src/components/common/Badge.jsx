const tones = {
  neutral: 'border-line bg-surface-2 text-muted',
  gold: 'border-gold/50 bg-gold/15 text-gold-ink',
  sage: 'border-transparent bg-sage text-ink',
  outline: 'border-line bg-transparent text-muted',
}

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

// Marks content that is placeholder data for frontend review only.
export function SampleBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed border-gold-ink/60 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gold-ink ${className}`}
    >
      Sample placeholder
    </span>
  )
}
