import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LuArrowUpRight, LuCheck, LuCopy, LuFileText, LuSearch, LuX } from 'react-icons/lu'
import { Badge, Button, EmptyState, Modal, Section, glass, metal } from './ui'
import { useSite } from '../lib/site'
import { publicationTypes } from '../data/publications'

/* =====================================================================================
   PUBLICATIONS — search + filter, publication cards, the detail dialog, citation formatting and the
   copy-citation button. Everything for this section is in this ONE file.
   ===================================================================================== */

const typeLabel = (type) => publicationTypes.find((t) => t.id === type)?.singular ?? 'Publication'

// APA-style citation string built from the publication fields that exist.
function formatCitation(p) {
  const authors = p.authors?.length ? p.authors.join(', ') : 'Author(s) not listed'
  const year = p.year ? `(${p.year})` : '(n.d.)'
  const parts = [`${authors} ${year}.`, `${p.title}.`]
  if (p.venue) parts.push(`${p.venue}.`)
  if (p.doi) parts.push(`https://doi.org/${p.doi}`)
  return parts.join(' ')
}


// Search + category filtering for publications. Pure client-side; ready to be swapped for an API later.
function usePublicationFilter(items) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const counts = useMemo(() => {
    const map = { all: items.length }
    items.forEach((p) => {
      map[p.type] = (map[p.type] || 0) + 1
    })
    return map
  }, [items])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((p) => category === 'all' || p.type === category)
      .filter((p) => {
        if (!q) return true
        const haystack = [p.title, p.authors.join(' '), p.venue, p.abstract, p.keywords.join(' '), p.doi, p.year]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0))
  }, [items, query, category])

  return { query, setQuery, category, setCategory, counts, results }
}


function CopyButton({ text, label = 'Copy citation' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink transition hover:border-gold hover:bg-sage/50"
    >
      {copied ? <LuCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <LuCopy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  )
}


function PublicationCard({ publication: p, onOpen }) {
  return (
    <article className={`${glass} group rounded-2xl border border-line bg-surface p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-lift`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="gold">{typeLabel(p.type)}</Badge>
        <span className="text-xs font-medium text-muted">{p.year ?? 'Year to be added'}</span>
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


const DetailField = ({ label, children }) => (
  <div>
    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">{label}</dt>
    <dd className="mt-1.5 text-sm leading-relaxed text-ink">{children}</dd>
  </div>
)

function PublicationDetail({ publication: p, onClose }) {
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
          </>
        )
      }
    >
      {p && (
        <div className="space-y-7">
          <dl className="grid gap-6 sm:grid-cols-2">
            <DetailField label="Authors">{p.authors.join(', ')}</DetailField>
            <DetailField label="Journal / venue">{p.venue}</DetailField>
            <DetailField label="Year">{p.year ?? 'To be added'}</DetailField>
            <DetailField label="DOI">
              {p.doi ? (
                <a className="underline decoration-gold underline-offset-4" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                  {p.doi}
                </a>
              ) : (
                <span className="text-muted">Not available</span>
              )}
            </DetailField>
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


export default function Publications() {
  const { publications } = useSite()
  const { query, setQuery, category, setCategory, counts, results } = usePublicationFilter(publications)
  const [selected, setSelected] = useState(null)
  const hasAny = publications.length > 0

  return (
    <Section id="publications">
      {!hasAny ? (
        <EmptyState
          title="No publications yet"
          message="Research publications will be added as academic work progresses."
        >
          <ul className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted" aria-label="Supported publication categories">
            {publicationTypes.map((t) => (
              <li key={t.id} className="rounded-full border border-line px-3 py-1">{t.label}</li>
            ))}
          </ul>
        </EmptyState>
      ) : (
        <>
          <div className="mb-8 space-y-5">
            <div className="relative max-w-xl">
              <label htmlFor="pub-search" className="sr-only">Search publications</label>
              <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id="pub-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, keyword, venue or year"
                className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-11 text-sm text-ink placeholder:text-muted/80 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-sage/60 hover:text-ink"
                >
                  <LuX className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div role="group" aria-label="Filter publications by category" className="flex flex-wrap gap-2">
              {[{ id: 'all', label: 'All' }, ...publicationTypes].map((t) => {
                const active = category === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(t.id)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      active ? `border-transparent ${metal} text-on-primary` : 'border-line bg-surface text-ink hover:border-gold'
                    }`}
                  >
                    {t.label}
                    <span className={`ml-2 text-xs ${active ? 'opacity-80' : 'text-muted'}`}>{counts[t.id] ?? 0}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-sm text-muted" role="status" aria-live="polite">
              Showing {results.length} of {publications.length} publications
            </p>
          </div>

          {results.length === 0 ? (
            <EmptyState compact title="No matching publications" message="Try a different search term or choose another category.">
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                }}
                className="mt-4 text-sm font-medium text-ink underline decoration-gold underline-offset-4"
              >
                Reset search and filters
              </button>
            </EmptyState>
          ) : (
            <ul className="grid gap-5 lg:grid-cols-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((p) => (
                  <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                    <PublicationCard publication={p} onOpen={setSelected} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </>
      )}
      <PublicationDetail publication={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
