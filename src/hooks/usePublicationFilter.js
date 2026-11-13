import { useMemo, useState } from 'react'

// Search + category filtering for publications. Pure client-side; ready to be swapped for an API later.
export default function usePublicationFilter(items) {
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
