// Central site configuration. Edit values here; components read from this file.
// Anything set to null is treated as "not available" and is hidden or shown as an empty state.

export const profile = {
  name: 'Dr. Fahmida Bristy',
  initials: 'FB',
  title: 'Registered Veterinary Doctor',
  eyebrow: 'Academic Portfolio',
  heroIntro:
    'Veterinary doctor and graduate of Sher-e-Bangla Agricultural University, with international academic experience at Prince of Songkla University, Thailand.',
  heroBio:
    'Her training spans animal science and veterinary medicine. This portfolio documents her academic journey and will grow as her research work develops.',
  // Set `photo` to { src: '/images/fahmida.jpg', alt: 'Portrait of Dr. Fahmida Bristy' } when a photograph is available.
  photo: null,
  // Put the real file in /public/cv/ and set e.g. '/cv/Fahmida-Bristy-CV.pdf'. While null, the button explains that the CV is pending.
  cvUrl: null,
  registration: { body: 'Bangladesh Veterinary Council', number: '10592' },
  heroFacts: [
    { label: 'Degree', value: 'B.Sc. Veterinary Science & Animal Husbandry' },
    { label: 'Graduated', value: '2026' },
    { label: 'International', value: 'Prince of Songkla University, Thailand' },
  ],
}

export const navigation = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research Interests' },
  { id: 'publications', label: 'Publications' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

// Academic profiles. Add a real `url` to show a link; entries with url: null are hidden.
export const academicProfiles = [
  { id: 'scholar', label: 'Google Scholar', icon: 'scholar', url: null },
  { id: 'researchgate', label: 'ResearchGate', icon: 'researchgate', url: null },
  { id: 'orcid', label: 'ORCID', icon: 'orcid', url: null },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', url: null },
  { id: 'institutional', label: 'Institutional profile', icon: 'globe', url: null },
  { id: 'other', label: 'Other academic platform', icon: 'globe', url: null },
]

// Contact details. Only confirmed values should be filled in; null values are hidden.
export const contactDetails = {
  email: null,
  phone: null,
  location: null,
}

export const collaborationTypes = [
  'Research collaboration',
  'Joint project or grant',
  'Academic or speaking invitation',
  'Laboratory or field work',
  'Peer review or editorial',
  'Other',
]
