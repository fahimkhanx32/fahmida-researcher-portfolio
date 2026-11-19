import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LuArrowRight } from 'react-icons/lu'
import { Badge, EmptyState, ImagePlaceholder, Modal, Section, glass, metal, scrollToSection } from './ui'
import { useSite } from '../lib/site'
import { projectStatuses } from '../data/projects'

/* =====================================================================================
   PROJECTS — status filter, project cards, the detail dialog and the status badge.
   Everything for this section is in this ONE file.
   ===================================================================================== */

const tones = { ongoing: 'gold', completed: 'sage', planned: 'outline' }

function StatusBadge({ status }) {
  const label = projectStatuses.find((s) => s.id === status)?.label ?? status
  return <Badge tone={tones[status] ?? 'neutral'}>{label}</Badge>
}


function ProjectCard({ project: p, onOpen }) {
  const cover = p.images?.[0]
  return (
    <article className={`${glass} group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift`}>
      {cover ? (
        <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <ImagePlaceholder label="Project image to be added" className="aspect-[16/9]" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={p.status} />
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


const Block = ({ title, children }) => (
  <section>
    <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">{title}</h3>
    <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>
  </section>
)

function ProjectDetail({ project: p, onClose }) {
  const { publications } = useSite()
  const related = p ? publications.filter((pub) => p.relatedPublications?.includes(pub.id)) : []

  return (
    <Modal
      open={Boolean(p)}
      onClose={onClose}
      title={p?.title}
      eyebrow={
        p && (
          <>
            <StatusBadge status={p.status} />
          </>
        )
      }
    >
      {p && (
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">{p.area}</p>
          <Block title="Overview"><p>{p.overview}</p></Block>
          {p.objectives?.length > 0 && (
            <Block title="Research objectives">
              <ul className="list-disc space-y-1 pl-5 marker:text-gold">{p.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            </Block>
          )}
          {p.methodology && <Block title="Methodology"><p>{p.methodology}</p></Block>}
          <Block title="Collaborators">
            {p.collaborators?.length ? (
              <ul className="list-disc space-y-1 pl-5 marker:text-gold">{p.collaborators.map((c) => <li key={c}>{c}</li>)}</ul>
            ) : (
              <p>No collaborators listed.</p>
            )}
          </Block>
          <Block title="Outcomes and findings"><p>{p.outcomes || 'Outcomes will be reported when available.'}</p></Block>
          <Block title="Images">
            {p.images?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {p.images.map((img) => (
                  <img key={img.src} src={img.src} alt={img.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl object-cover" />
                ))}
              </div>
            ) : (
              <ImagePlaceholder label="Related images to be added" className="aspect-[21/9] rounded-xl" />
            )}
          </Block>
          {related.length > 0 && (
            <Block title="Related publications">
              <ul className="space-y-1.5">
                {related.map((pub) => (
                  <li key={pub.id}>
                    <button
                      type="button"
                      className="text-left text-ink underline decoration-gold underline-offset-4"
                      onClick={() => {
                        onClose()
                        setTimeout(() => scrollToSection('publications'), 50)
                      }}
                    >
                      {pub.title}
                    </button>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      )}
    </Modal>
  )
}


export default function Projects() {
  const { projects } = useSite()
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const visible = projects.filter((p) => status === 'all' || p.status === status)

  return (
    <Section id="projects" tone="tint">
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" message="Research projects will be shown here once they are confirmed and added." />
      ) : (
        <>
          <div role="group" aria-label="Filter projects by status" className="mb-8 flex flex-wrap gap-2">
            {[{ id: 'all', label: 'All' }, ...projectStatuses].map((s) => {
              const active = status === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatus(s.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    active ? `border-transparent ${metal} text-on-primary` : 'border-line bg-surface text-ink hover:border-gold'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
          {visible.length === 0 ? (
            <EmptyState compact message="No projects with this status yet." />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((p) => (
                  <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                    <ProjectCard project={p} onOpen={setSelected} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </>
      )}
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
