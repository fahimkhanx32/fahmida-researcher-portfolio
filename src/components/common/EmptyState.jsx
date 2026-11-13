import { LuBookOpen } from 'react-icons/lu'

export default function EmptyState({ title, message, icon = LuBookOpen, compact = false, children }) {
  const Icon = icon
  return (
    <div
      className={`rounded-2xl border border-dashed border-line bg-surface/60 text-center ${compact ? 'px-5 py-6' : 'px-6 py-14'}`}
    >
      <span className={`mx-auto flex items-center justify-center rounded-full bg-sage text-ink ${compact ? 'h-9 w-9' : 'h-12 w-12'}`}>
        <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
      </span>
      {title && <h3 className="mt-4 font-display text-lg font-medium text-ink">{title}</h3>}
      <p className={`mx-auto max-w-md text-sm leading-relaxed text-muted ${title ? 'mt-1.5' : 'mt-3'}`}>{message}</p>
      {children}
    </div>
  )
}
