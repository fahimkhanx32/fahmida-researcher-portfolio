// Default site content. Used on first start (and `npm run seed`) so the website looks complete before anything is edited.
// After that, everything is edited from the dashboard and stored in MongoDB.

export const SECTION_KEYS = ['home', 'about', 'research', 'publications', 'projects', 'experience', 'education', 'achievements', 'profiles', 'contact']
export const ICONS = ['stethoscope', 'heart', 'shield', 'paw', 'globe', 'flask']
export const PUBLICATION_TYPES = ['journal', 'conference', 'review', 'abstract', 'chapter', 'preprint']
export const PROJECT_STATUSES = ['ongoing', 'completed', 'planned']
export const ACHIEVEMENT_CATEGORIES = ['conferences', 'presentations', 'workshops', 'training', 'certifications', 'awards']
export const PROFILE_ICONS = ['scholar', 'researchgate', 'orcid', 'linkedin', 'globe']

export const defaultSettings = {
  profile: {
    name: 'Dr. Fahmida Bristy',
    initials: 'FB',
    title: 'Registered Veterinary Doctor',
    eyebrow: 'Academic Portfolio',
    heroIntro:
      'Veterinary doctor and graduate of Sher-e-Bangla Agricultural University, with international academic experience at Prince of Songkla University, Thailand.',
    heroBio:
      'Her training spans animal science and veterinary medicine. This portfolio documents her academic journey and will grow as her research work develops.',
    photo: null,
    cv: null,
    registration: { body: 'Bangladesh Veterinary Council', number: '10592' },
    heroFacts: [
      { label: 'Degree', value: 'B.Sc. Veterinary Science & Animal Husbandry' },
      { label: 'Graduated', value: '2026' },
      { label: 'International', value: 'Prince of Songkla University, Thailand' },
    ],
  },
  about: {
    highestQualification: 'B.Sc. in Veterinary Science and Animal Husbandry, Sher-e-Bangla Agricultural University, 2026',
    blocks: [
      {
        title: 'Professional introduction',
        body: 'Dr. Fahmida Bristy is a registered veterinary doctor. She holds a Bachelor of Science in Veterinary Science and Animal Husbandry from Sher-e-Bangla Agricultural University and is registered with the Bangladesh Veterinary Council.',
      },
      {
        title: 'Academic journey',
        body: 'Her studies progressed from the Secondary School Certificate in 2016 and the Higher Secondary Certificate in 2018, both in Naogaon, to university enrollment on 10 December 2019 and graduation in 2026.',
      },
      {
        title: 'Veterinary science background',
        body: 'At Sher-e-Bangla Agricultural University she studied Animal Science and Veterinary Medicine, building a foundation across animal biology, health and husbandry.',
      },
      {
        title: 'Current academic and research development',
        body: 'Her research profile is at an early stage. The research areas listed on this site are suggestions that she can refine; they are not confirmed specializations, and verified publications and projects will be added as work progresses.',
      },
      {
        title: 'International academic exposure',
        body: 'Since 4 January 2026 she has been gaining academic experience at Prince of Songkla University in Thailand.',
      },
    ],
    goals: '',
  },
  sections: [
    { key: 'home', label: 'Home', short: '', visible: true, inNav: true, inMore: false, eyebrow: '', title: '', intro: '' },
    { key: 'about', label: 'About', short: '', visible: true, inNav: true, inMore: false, eyebrow: 'About', title: 'An academic path in veterinary science', intro: '' },
    { key: 'research', label: 'Research Interests', short: 'Research', visible: true, inNav: true, inMore: false, eyebrow: 'Research Interests', title: 'Areas of academic interest', intro: 'A suggested framework for how this portfolio may organize research themes as they take shape.' },
    { key: 'publications', label: 'Publications', short: '', visible: true, inNav: true, inMore: false, eyebrow: 'Publications', title: 'Scholarly output', intro: 'Journal articles, conference papers, reviews, abstracts, book chapters and preprints.' },
    { key: 'projects', label: 'Projects', short: '', visible: true, inNav: true, inMore: false, eyebrow: 'Research Projects', title: 'Projects and investigations', intro: 'Ongoing, completed and planned research, with objectives, methods, collaborators and outcomes.' },
    { key: 'experience', label: 'Experience', short: '', visible: true, inNav: true, inMore: true, eyebrow: 'Experience', title: 'Academic and professional experience', intro: 'Verified experience appears in the timeline. Other categories are reserved for future entries.' },
    { key: 'education', label: 'Education', short: '', visible: true, inNav: true, inMore: true, eyebrow: 'Education', title: 'Academic qualifications', intro: '' },
    { key: 'achievements', label: 'Achievements', short: '', visible: true, inNav: false, inMore: false, eyebrow: 'Conferences, Training & Achievements', title: 'Beyond the degree', intro: 'Conferences, presentations, workshops, training, certifications and awards. Only verified entries will be listed.' },
    { key: 'profiles', label: 'Academic Profiles', short: '', visible: true, inNav: false, inMore: false, eyebrow: 'Academic Profiles', title: 'Find Dr. Bristy online', intro: '' },
    { key: 'contact', label: 'Contact', short: '', visible: true, inNav: true, inMore: true, eyebrow: 'Contact & Collaboration', title: 'Start a conversation', intro: 'For research collaboration, academic invitations or questions about this work.' },
  ],
  navCta: { label: 'Contact Me', target: 'contact' },
  contact: { email: 'FahmidaBristy@gmail.com', phone: '+880 1728-249175', location: '', formEnabled: true },
  academicProfiles: [
    { key: 'scholar', label: 'Google Scholar', icon: 'scholar', url: '' },
    { key: 'researchgate', label: 'ResearchGate', icon: 'researchgate', url: '' },
    { key: 'orcid', label: 'ORCID', icon: 'orcid', url: '' },
    { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', url: '' },
    { key: 'institutional', label: 'Institutional profile', icon: 'globe', url: '' },
    { key: 'other', label: 'Other academic platform', icon: 'globe', url: '' },
  ],
  collaborationTypes: [
    'Research collaboration',
    'Joint project or grant',
    'Academic or speaking invitation',
    'Laboratory or field work',
    'Peer review or editorial',
    'Other',
  ],
  footer: { blurb: 'Academic portfolio of a registered veterinary doctor and graduate of Sher-e-Bangla Agricultural University.' },
  extras: {
    experienceCategories: [
      'Research internships',
      'Laboratory experience',
      'Academic appointments',
      'Research assistant positions',
      'Professional training',
      'International academic experiences',
    ],
  },
}

export const defaultResearch = [
  { icon: 'stethoscope', title: 'Veterinary Science', description: 'The study and practice of diagnosing, treating and preventing disease in animals.', topics: ['Clinical medicine', 'Preventive care'] },
  { icon: 'heart', title: 'Animal Health and Disease Research', description: 'Understanding how diseases arise, spread and can be controlled in animal populations.', topics: ['Disease surveillance', 'Diagnostics'] },
  { icon: 'shield', title: 'Veterinary Public Health', description: 'The role of veterinary practice in protecting human health, food safety and communities.', topics: ['Zoonoses', 'Food safety'] },
  { icon: 'paw', title: 'Animal Science', description: 'The biology, nutrition, breeding and management of domestic and farmed animals.', topics: ['Nutrition', 'Production systems'] },
  { icon: 'globe', title: 'One Health', description: 'An integrated approach linking the health of people, animals and their shared environment.', topics: ['Cross-sector collaboration', 'Environment'] },
  { icon: 'flask', title: 'Biomedical and Laboratory Research', description: 'Laboratory-based methods used to study biological mechanisms, pathogens and treatments.', topics: ['Laboratory methods', 'Microbiology'] },
]

export const defaultTimeline = [
  { kind: 'experience', dateLabel: 'From 4 January 2026', title: 'Academic experience', organization: 'Prince of Songkla University', location: 'Thailand', description: 'International academic experience. The specific role, responsibilities and end date will be added once confirmed.' },
  { kind: 'education', dateLabel: 'Enrolled Dec 2019 · Graduated 2026', title: 'Bachelor of Science in Veterinary Science and Animal Husbandry', organization: 'Sher-e-Bangla Agricultural University', location: '', description: 'Studied Animal Science and Veterinary Medicine. Academic enrollment began on 10 December 2019.' },
  { kind: 'education', dateLabel: '2018', title: 'Higher Secondary Certificate (HSC)', organization: 'Naogaon Government College', location: 'Naogaon', description: '' },
  { kind: 'education', dateLabel: '2016', title: 'Secondary School Certificate (SSC)', organization: "Naogaon Government Girls' High School", location: 'Naogaon', description: '' },
]
