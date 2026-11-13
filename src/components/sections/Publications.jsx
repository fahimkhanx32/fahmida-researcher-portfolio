import { useState } from 'react'
import { LuSearch, LuX } from 'react-icons/lu'
import Section from '../common/Section'
import EmptyState from '../common/EmptyState'
import PublicationCard from '../publications/PublicationCard'
import PublicationDetail from '../publications/PublicationDetail'
import usePublicationFilter from '../../hooks/usePublicationFilter'
import { useContent } from '../../context/PreviewContext'
import { publicationTypes } from '../../data/publications'

export default function Publications() {
  const { publications } = useContent()
  const { query, setQuery, category, setCategory, counts, results } = usePublicationFilter(publications)
  const [selected, setSelected] = useState(null)
  const hasAny = publications.length > 0

  return (
    <Section
      id="publications"
      eyebrow="Publications"
      title="Scholarly output"
      intro="Journal articles, conference papers, reviews, abstracts, book chapters and preprints."
    >
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
                      active ? 'border-transparent bg-primary text-on-primary' : 'border-line bg-surface text-ink hover:border-gold'
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
              {results.map((p) => (
                <li key={p.id}>
                  <PublicationCard publication={p} onOpen={setSelected} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <PublicationDetail publication={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
