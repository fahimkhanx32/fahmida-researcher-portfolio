// Categories for conferences, training and achievements. `achievements` holds VERIFIED entries (none supplied yet).
// Item shape: { id, category, title, organization, date, location, description, attachmentUrl }
export const achievementCategories = [
  { id: 'conferences', icon: 'users', title: 'Academic Conferences', empty: 'Conference participation will be listed here.' },
  { id: 'presentations', icon: 'presentation', title: 'Research Presentations', empty: 'Research presentations will be listed here.' },
  { id: 'workshops', icon: 'flask', title: 'Scientific Workshops', empty: 'Scientific workshops will be listed here.' },
  { id: 'training', icon: 'graduation', title: 'Professional Training', empty: 'Professional training will be listed here.' },
  { id: 'certifications', icon: 'badge', title: 'Certifications', empty: 'Certifications will be listed here.' },
  { id: 'awards', icon: 'award', title: 'Awards and Achievements', empty: 'Awards and achievements will be listed here once verified.' },
]

export const achievements = []

// SAMPLE placeholders for frontend review only. Remove before launch.
export const sampleAchievements = achievementCategories.map((c) => ({
  id: `sample-${c.id}`,
  isSample: true,
  category: c.id,
  title: '[Sample] Placeholder entry title',
  organization: 'Organization name (placeholder)',
  date: 'Date (placeholder)',
  location: 'Location (placeholder)',
  description: 'Sample description showing how an entry reads. Not a real achievement.',
  attachmentUrl: null,
}))
