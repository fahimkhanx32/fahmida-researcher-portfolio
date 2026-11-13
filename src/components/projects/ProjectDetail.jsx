import Modal from '../common/Modal'
import { SampleBadge } from '../common/Badge'
import ImagePlaceholder from '../common/ImagePlaceholder'
import StatusBadge from './StatusBadge'
import { useContent } from '../../context/PreviewContext'
import { scrollToSection } from '../../utils/scroll'

const Block = ({ title, children }) => (
  <section>
    <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">{title}</h3>
    <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>
  </section>
)

export default function ProjectDetail({ project: p, onClose }) {
  const { publications } = useContent()
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
            {p.isSample && <SampleBadge />}
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
