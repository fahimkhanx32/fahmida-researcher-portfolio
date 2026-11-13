import { LuMapPin } from 'react-icons/lu'

// Vertical academic timeline. Each item: { id, dateLabel, title, organization, location, description }.
export default function Timeline({ items, icon }) {
  const Icon = icon
  return (
    <ol className="relative space-y-6 border-l border-line pl-8 sm:pl-10">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.85rem] top-5 flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-canvas text-gold-ink sm:-left-[3.35rem]"
          >
            <Icon className="h-4 w-4" />
          </span>
          <article className="rounded-2xl border border-line bg-surface p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{item.dateLabel}</p>
            <h3 className="mt-2 font-display text-xl font-medium leading-snug text-ink">{item.title}</h3>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="font-medium text-ink">{item.organization}</span>
              {item.location && (
                <span className="inline-flex items-center gap-1">
                  <LuMapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.location}
                </span>
              )}
            </p>
            {item.description && <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>}
          </article>
        </li>
      ))}
    </ol>
  )
}
