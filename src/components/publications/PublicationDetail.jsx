import { LuArrowUpRight, LuFileText } from 'react-icons/lu'
import Modal from '../common/Modal'
import Badge, { SampleBadge } from '../common/Badge'
import CopyButton from '../common/CopyButton'
import Button from '../common/Button'
import { formatCitation, typeLabel } from '../../utils/citation'

const Field = ({ label, children }) => (
  <div>
    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">{label}</dt>
    <dd className="mt-1.5 text-sm leading-relaxed text-ink">{children}</dd>
  </div>
)

export default function PublicationDetail({ publication: p, onClose }) {
  const citation = p ? formatCitation(p) : ''
  return (
    <Modal
      open={Boolean(p)}
      onClose={onClose}
      title={p?.title}
      eyebrow={
        p && (
          <>
            <Badge tone="gold">{typeLabel(p.type)}</Badge>
            {p.isSample && <SampleBadge />}
          </>
        )
      }
    >
      {p && (
        <div className="space-y-7">
          <dl className="grid gap-6 sm:grid-cols-2">
            <Field label="Authors">{p.authors.join(', ')}</Field>
            <Field label="Journal / venue">{p.venue}</Field>
            <Field label="Year">{p.year ?? 'To be added'}</Field>
            <Field label="DOI">
              {p.doi ? (
                <a className="underline decoration-gold underline-offset-4" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                  {p.doi}
                </a>
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </Field>
          </dl>

          <section aria-labelledby="pub-abstract">
            <h3 id="pub-abstract" className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">Abstract</h3>
            <p className="mt-2 leading-relaxed text-muted">{p.abstract || 'Abstract not available.'}</p>
          </section>

          {p.keywords.length > 0 && (
            <section aria-labelledby="pub-keywords">
              <h3 id="pub-keywords" className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">Keywords</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.keywords.map((k) => <li key={k}><Badge tone="sage">{k}</Badge></li>)}
              </ul>
            </section>
          )}

          <section aria-labelledby="pub-citation" className="rounded-2xl border border-line bg-surface-2/70 p-5">
            <h3 id="pub-citation" className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">Cite this work</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink">{citation}</p>
            <div className="mt-3"><CopyButton text={citation} /></div>
          </section>

          {(p.url || p.pdfUrl) && (
            <div className="flex flex-wrap gap-3">
              {p.url && (
                <Button href={p.url} target="_blank" rel="noopener noreferrer">
                  View publication <LuArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {p.pdfUrl && (
                <Button href={p.pdfUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                  <LuFileText className="h-4 w-4" aria-hidden="true" /> PDF
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
