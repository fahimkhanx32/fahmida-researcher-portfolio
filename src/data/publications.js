// Publication categories supported by the UI.
export const publicationTypes = [
  { id: 'journal', label: 'Journal Articles', singular: 'Journal Article' },
  { id: 'conference', label: 'Conference Papers', singular: 'Conference Paper' },
  { id: 'review', label: 'Review Articles', singular: 'Review Article' },
  { id: 'abstract', label: 'Research Abstracts', singular: 'Research Abstract' },
  { id: 'chapter', label: 'Book Chapters', singular: 'Book Chapter' },
  { id: 'preprint', label: 'Preprints', singular: 'Preprint' },
]

// VERIFIED publications. Intentionally empty: none have been supplied. Add real entries here.
// Shape: { id, type, title, authors[], venue, year, doi, abstract, keywords[], url, pdfUrl }
export const publications = []

const sample = (id, type, title, venue, keywords, abstract) => ({
  id,
  isSample: true,
  type,
  title,
  authors: ['Author Name (placeholder)', 'Co-author Name (placeholder)'],
  venue,
  year: null,
  doi: null,
  abstract,
  keywords,
  url: null,
  pdfUrl: null,
})

// SAMPLE placeholders used only so the frontend can be reviewed. They are clearly labelled in the UI
// and can be hidden with the "Sample content" switch. Remove this array before launch.
export const samplePublications = [
  sample('sample-pub-1', 'journal', '[Sample] Placeholder journal article on a veterinary topic', 'Journal Name (placeholder)', ['sample keyword', 'veterinary'], 'Sample abstract text. This placeholder only demonstrates how an abstract is laid out in the detail view. No real research is described.'),
  sample('sample-pub-2', 'conference', '[Sample] Placeholder conference paper on an animal health topic', 'Conference Name (placeholder)', ['sample keyword', 'conference'], 'Sample abstract text for a conference paper placeholder. Not a real publication.'),
  sample('sample-pub-3', 'review', '[Sample] Placeholder review article on a public health topic', 'Review Journal (placeholder)', ['sample keyword', 'review'], 'Sample abstract text for a review article placeholder. Not a real publication.'),
  sample('sample-pub-4', 'abstract', '[Sample] Placeholder research abstract on a laboratory topic', 'Symposium Abstracts (placeholder)', ['sample keyword', 'laboratory'], 'Sample text for a research abstract placeholder. Not a real publication.'),
  sample('sample-pub-5', 'chapter', '[Sample] Placeholder book chapter on a One Health topic', 'Book Title (placeholder)', ['sample keyword', 'one health'], 'Sample text for a book chapter placeholder. Not a real publication.'),
  sample('sample-pub-6', 'preprint', '[Sample] Placeholder preprint on an animal science topic', 'Preprint Server (placeholder)', ['sample keyword', 'preprint'], 'Sample text for a preprint placeholder. Not a real publication.'),
]
