import { LuArrowUpRight, LuFileText } from 'react-icons/lu'
import Badge, { SampleBadge } from '../common/Badge'
import { typeLabel } from '../../utils/citation'

export default function PublicationCard({ publication: p, onOpen }) {
  return (
    <article className="group rounded-2xl border border-line bg-surface p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-lift">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="gold">{typeLabel(p.type)}</Badge>
        <span className="text-xs font-medium text-muted">{p.year ?? 'Year to be added'}</span>
        {p.isSample && <SampleBadge />}
      </div>
      <h3 className="mt-3 font-display text-xl font-medium leading-snug text-ink">
        <button
          type="button"
          onClick={() => onOpen(p)}
          className="rounded text-left transition hover:text-gold-ink"
        >
          {p.title}
        </button>
      </h3>
      <p className="mt-2 text-sm text-ink/90">{p.authors.join(', ')}</p>
      <p className="mt-0.5 text-sm italic text-muted">{p.venue}</p>
      {p.keywords.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Keywords">
          {p.keywords.map((k) => (
            <li key={k}><Badge tone="sage">{k}</Badge></li>
          ))}
        </ul>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
        <button type="button" onClick={() => onOpen(p)} className="inline-flex items-center gap-1.5 text-ink underline decoration-gold decoration-2 underline-offset-4 transition hover:text-gold-ink">
          View details
        </button>
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted transition hover:text-ink">
            Publication <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {p.pdfUrl && (
          <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted transition hover:text-ink">
            <LuFileText className="h-3.5 w-3.5" aria-hidden="true" /> PDF
          </a>
        )}
      </div>
    </article>
  )
}
