import { LuArrowRight } from 'react-icons/lu'
import ImagePlaceholder from '../common/ImagePlaceholder'
import { SampleBadge } from '../common/Badge'
import StatusBadge from './StatusBadge'

export default function ProjectCard({ project: p, onOpen }) {
  const cover = p.images?.[0]
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift">
      {cover ? (
        <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <ImagePlaceholder label="Project image to be added" className="aspect-[16/9]" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={p.status} />
          {p.isSample && <SampleBadge />}
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">{p.area}</p>
        <h3 className="mt-1.5 font-display text-xl font-medium leading-snug text-ink">{p.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{p.overview}</p>
        <button
          type="button"
          onClick={() => onOpen(p)}
          className="mt-5 inline-flex items-center gap-2 self-start text-sm font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 transition hover:text-gold-ink"
        >
          View project <LuArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
