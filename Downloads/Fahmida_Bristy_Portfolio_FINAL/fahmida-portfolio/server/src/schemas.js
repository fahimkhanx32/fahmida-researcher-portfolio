import { z } from 'zod'
import {
  ACHIEVEMENT_CATEGORIES, ICONS, PROFILE_ICONS, PROJECT_STATUSES, PUBLICATION_TYPES, SECTION_KEYS,
} from './defaults.js'

/* =====================================================================================
   SCHEMAS — every request body is validated here (zod). Unknown fields are dropped, strings are
   trimmed and length-limited, and URLs must be http(s) so a saved link can never be "javascript:".
   ===================================================================================== */

const text = (max = 500) => z.string().trim().max(max)
const longText = (max = 5000) => z.string().trim().max(max)
const httpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Must start with http:// or https://')
  .refine((v) => v === '' || URL.canParse(v), 'Not a valid URL')
const list = (max = 200, count = 50) => z.array(text(max).min(1)).max(count)

export const assetSchema = z
  .object({
    url: httpUrl.refine((v) => v !== '', 'Required'),
    publicId: z.string().trim().max(300).optional().default(''),
    resourceType: z.enum(['image', 'raw', 'video']).optional().default('image'),
    name: text(200).optional().default(''),
    alt: text(300).optional().default(''),
  })
  .strict()
const optionalAsset = assetSchema.nullable().optional()

const common = { visible: z.boolean().optional() }

export const researchSchema = z.object({
  ...common,
  icon: z.enum(ICONS).default('globe'),
  title: text(200).min(1, 'Title is required'),
  description: longText(1000).default(''),
  topics: list(100, 12).default([]),
})

export const publicationSchema = z.object({
  ...common,
  type: z.enum(PUBLICATION_TYPES).default('journal'),
  title: text(400).min(1, 'Title is required'),
  authors: list(150, 40).default([]),
  venue: text(300).default(''),
  year: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  doi: text(200).default(''),
  abstract: longText(5000).default(''),
  keywords: list(80, 20).default([]),
  url: httpUrl.default(''),
  pdf: optionalAsset,
})

export const projectSchema = z.object({
  ...common,
  title: text(300).min(1, 'Title is required'),
  status: z.enum(PROJECT_STATUSES).default('ongoing'),
  area: text(200).default(''),
  overview: longText(3000).default(''),
  objectives: list(300, 20).default([]),
  methodology: longText(3000).default(''),
  collaborators: list(200, 30).default([]),
  images: z.array(assetSchema).max(12).default([]),
  outcomes: longText(3000).default(''),
  relatedPublications: z.array(z.string().trim().max(40)).max(50).default([]),
})

export const timelineSchema = z.object({
  ...common,
  dateLabel: text(120).default(''),
  title: text(300).min(1, 'Title is required'),
  organization: text(300).default(''),
  location: text(200).default(''),
  description: longText(2000).default(''),
})

export const achievementSchema = z.object({
  ...common,
  category: z.enum(ACHIEVEMENT_CATEGORIES).default('awards'),
  title: text(300).min(1, 'Title is required'),
  organization: text(300).default(''),
  date: text(120).default(''),
  location: text(200).default(''),
  description: longText(2000).default(''),
  attachment: optionalAsset,
})

export const resourceSchemas = {
  research: researchSchema,
  publications: publicationSchema,
  projects: projectSchema,
  experience: timelineSchema,
  education: timelineSchema,
  achievements: achievementSchema,
}

export const reorderSchema = z.object({ ids: z.array(z.string().trim().max(40)).min(1).max(500) })
export const visibilitySchema = z.object({ visible: z.boolean() })

/* ---------- site settings (every block optional: the dashboard saves one block at a time) ---------- */

const sectionSchema = z.object({
  key: z.enum(SECTION_KEYS),
  label: text(60).min(1),
  short: text(30).default(''),
  visible: z.boolean(),
  inNav: z.boolean(),
  inMore: z.boolean(),
  eyebrow: text(120).default(''),
  title: text(200).default(''),
  intro: longText(500).default(''),
})

export const settingsSchema = z
  .object({
    profile: z.object({
      name: text(120).min(1),
      initials: text(4).min(1),
      title: text(160).default(''),
      eyebrow: text(120).default(''),
      heroIntro: longText(600).default(''),
      heroBio: longText(800).default(''),
      photo: optionalAsset,
      cv: optionalAsset,
      registration: z.object({ body: text(200).default(''), number: text(60).default('') }),
      heroFacts: z.array(z.object({ label: text(60).min(1), value: text(200).min(1) })).max(6),
    }),
    about: z.object({
      highestQualification: longText(400).default(''),
      blocks: z.array(z.object({ title: text(160).min(1), body: longText(1500).default('') })).max(12),
      goals: longText(1500).default(''),
    }),
    sections: z
      .array(sectionSchema)
      .length(SECTION_KEYS.length)
      .refine((arr) => new Set(arr.map((s) => s.key)).size === SECTION_KEYS.length, 'Each section must appear exactly once')
      .refine((arr) => arr.find((s) => s.key === 'home')?.visible, 'The home section cannot be hidden'),
    navCta: z.object({ label: text(40).min(1), target: z.enum(SECTION_KEYS) }),
    contact: z.object({
      email: z.string().trim().max(200).email().or(z.literal('')),
      phone: text(40).default(''),
      location: text(200).default(''),
      formEnabled: z.boolean().default(true),
    }),
    academicProfiles: z
      .array(z.object({ key: text(40).min(1), label: text(80).min(1), icon: z.enum(PROFILE_ICONS), url: httpUrl.default('') }))
      .max(12),
    collaborationTypes: list(100, 12),
    footer: z.object({ blurb: longText(400).default('') }),
    extras: z.object({ experienceCategories: list(100, 12) }),
  })
  .partial()

/* ---------- contact form, auth ---------- */

export const contactSchema = z.object({
  name: text(120).min(2, 'Please enter your name'),
  email: z.string().trim().max(200).email('Please enter a valid email'),
  subject: text(200).min(3, 'Please enter a subject'),
  type: text(100).default(''),
  message: longText(5000).min(20, 'Please write at least 20 characters'),
  website: z.string().max(200).optional().default(''), // honeypot: real people leave this empty
})

const password = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(128)
  .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), 'Use letters and at least one number')

// The login name may be an e-mail, a user id or anything else. Older clients send it as "email", so both keys are accepted.
const loginName = z.string().trim().toLowerCase().min(1, 'Enter your username').max(200)
const withName = (shape) =>
  z
    .object({ username: loginName.optional(), email: loginName.optional(), ...shape })
    .transform(({ email, ...v }) => ({ ...v, username: v.username ?? email }))
    .refine((v) => v.username, { message: 'Enter your username', path: ['username'] })

export const loginSchema = withName({ password: z.string().min(1).max(128), remember: z.boolean().optional().default(false) })
export const forgotSchema = withName({})
export const resetSchema = withName({ token: z.string().min(20).max(200), password })
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: password })
export const profileUpdateSchema = z.object({
  name: text(120).min(1),
  username: z.string().trim().toLowerCase().min(3, 'At least 3 characters').max(60, 'At most 60 characters').optional(),
  email: z.string().trim().toLowerCase().max(200).email('Please enter a valid email').or(z.literal('')).optional(),
  currentPassword: z.string().max(128).optional(),
})
export const messageStatusSchema = z.object({ status: z.enum(['new', 'read', 'archived']) })
