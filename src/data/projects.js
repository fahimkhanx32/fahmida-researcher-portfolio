export const projectStatuses = [
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'planned', label: 'Planned' },
]

// VERIFIED research projects. Intentionally empty: none have been supplied.
// Shape: { id, title, status, area, overview, objectives[], methodology, collaborators[], images[], outcomes, relatedPublications[] }
export const projects = []

// SAMPLE placeholders for frontend review only. Labelled in the UI. Remove before launch.
export const sampleProjects = [
  {
    id: 'sample-proj-1',
    isSample: true,
    title: '[Sample] Ongoing research project placeholder',
    status: 'ongoing',
    area: 'Research area (placeholder)',
    overview: 'Sample overview text that shows how a project summary reads on a card and in the detail view. No real project is described.',
    objectives: ['Sample objective one', 'Sample objective two'],
    methodology: 'Sample methodology description. Real methods will be added when a project is confirmed.',
    collaborators: ['Collaborator name (placeholder)'],
    images: [],
    outcomes: 'Outcomes and findings will appear here once available.',
    relatedPublications: ['sample-pub-1'],
  },
  {
    id: 'sample-proj-2',
    isSample: true,
    title: '[Sample] Completed research project placeholder',
    status: 'completed',
    area: 'Research area (placeholder)',
    overview: 'Sample overview for a completed project, used only to preview layout and the status badge.',
    objectives: ['Sample objective one', 'Sample objective two', 'Sample objective three'],
    methodology: 'Sample methodology description for a completed project.',
    collaborators: ['Collaborator name (placeholder)', 'Institution name (placeholder)'],
    images: [],
    outcomes: 'Sample outcomes text. No real findings are reported.',
    relatedPublications: ['sample-pub-3'],
  },
  {
    id: 'sample-proj-3',
    isSample: true,
    title: '[Sample] Planned research project placeholder',
    status: 'planned',
    area: 'Research area (placeholder)',
    overview: 'Sample overview for a planned project, used only to preview layout and the status badge.',
    objectives: ['Sample objective one'],
    methodology: 'Methodology to be defined.',
    collaborators: [],
    images: [],
    outcomes: '',
    relatedPublications: [],
  },
]
