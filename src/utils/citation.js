import { publicationTypes } from '../data/publications'

export const typeLabel = (type) => publicationTypes.find((t) => t.id === type)?.singular ?? 'Publication'

// APA-style citation string built from the publication fields that exist.
export function formatCitation(p) {
  const authors = p.authors?.length ? p.authors.join(', ') : 'Author(s) not listed'
  const year = p.year ? `(${p.year})` : '(n.d.)'
  const parts = [`${authors} ${year}.`, `${p.title}.`]
  if (p.venue) parts.push(`${p.venue}.`)
  if (p.doi) parts.push(`https://doi.org/${p.doi}`)
  return parts.join(' ')
}
