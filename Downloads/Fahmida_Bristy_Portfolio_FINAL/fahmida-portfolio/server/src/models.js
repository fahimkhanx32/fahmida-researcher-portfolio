import mongoose from 'mongoose'

/* =====================================================================================
   MODELS — every collection in ONE file.
   Admin (single owner) · Settings (one document) · ResearchInterest · Publication · Project ·
   TimelineEntry (experience + education) · Achievement · Message
   All content models share { visible, order } so the dashboard can hide and reorder anything.
   ===================================================================================== */

const { Schema } = mongoose

// API output: expose `id`, hide `_id`, `__v` and anything secret.
function cleanJson(schema, hidden = []) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = String(ret._id)
      delete ret._id
      hidden.forEach((k) => delete ret[k])
      return ret
    },
  })
  schema.set('toObject', { virtuals: false, versionKey: false })
}

/* ---------- Admin: the one owner account ---------- */
const adminSchema = new Schema(
  {
    // The login name can be anything (an e-mail, a user id…). The e-mail is only used for password-reset links.
    username: { type: String, trim: true, lowercase: true, index: true },
    email: { type: String, unique: true, lowercase: true, trim: true, default: undefined },
    name: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 }, // bump to sign out every device (password change/reset)
    resetTokenHash: { type: String, default: null },
    resetExpires: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
)
cleanJson(adminSchema, ['passwordHash', 'resetTokenHash', 'resetExpires', 'tokenVersion'])
export const Admin = mongoose.model('Admin', adminSchema)

/* ---------- Settings: one document that holds all site-wide content ---------- */
const settingsSchema = new Schema(
  {
    key: { type: String, default: 'site', unique: true },
    profile: { type: Schema.Types.Mixed, default: {} },
    about: { type: Schema.Types.Mixed, default: {} },
    sections: { type: Schema.Types.Mixed, default: [] },
    navCta: { type: Schema.Types.Mixed, default: {} },
    contact: { type: Schema.Types.Mixed, default: {} },
    academicProfiles: { type: Schema.Types.Mixed, default: [] },
    collaborationTypes: { type: [String], default: [] },
    footer: { type: Schema.Types.Mixed, default: {} },
    extras: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
)
cleanJson(settingsSchema, ['key'])
export const Settings = mongoose.model('Settings', settingsSchema)

/* ---------- content collections ---------- */
const asset = { _id: false, url: String, publicId: String, resourceType: String, name: String, alt: String }
const base = { visible: { type: Boolean, default: true }, order: { type: Number, default: 0, index: true } }
const str = (extra = {}) => ({ type: String, trim: true, default: '', ...extra })

function makeModel(name, fields) {
  const schema = new Schema({ ...base, ...fields }, { timestamps: true, minimize: false })
  cleanJson(schema)
  return mongoose.model(name, schema)
}

export const ResearchInterest = makeModel('ResearchInterest', {
  icon: str({ default: 'globe' }),
  title: str({ required: true }),
  description: str(),
  topics: { type: [String], default: [] },
})

export const Publication = makeModel('Publication', {
  type: str({ default: 'journal' }),
  title: str({ required: true }),
  authors: { type: [String], default: [] },
  venue: str(),
  year: { type: Number, default: null },
  doi: str(),
  abstract: str(),
  keywords: { type: [String], default: [] },
  url: str(),
  pdf: { type: new Schema(asset), default: null },
})

export const Project = makeModel('Project', {
  title: str({ required: true }),
  status: str({ default: 'ongoing' }),
  area: str(),
  overview: str(),
  objectives: { type: [String], default: [] },
  methodology: str(),
  collaborators: { type: [String], default: [] },
  images: { type: [new Schema(asset)], default: [] },
  outcomes: str(),
  relatedPublications: { type: [String], default: [] }, // ids of Publication documents
})

export const TimelineEntry = makeModel('TimelineEntry', {
  kind: str({ required: true }), // 'experience' | 'education'
  dateLabel: str(),
  title: str({ required: true }),
  organization: str(),
  location: str(),
  description: str(),
})

export const Achievement = makeModel('Achievement', {
  category: str({ default: 'awards' }),
  title: str({ required: true }),
  organization: str(),
  date: str(),
  location: str(),
  description: str(),
  attachment: { type: new Schema(asset), default: null },
})

/* ---------- Message: contact-form inbox ---------- */
const messageSchema = new Schema(
  {
    name: str({ required: true }),
    email: str({ required: true }),
    subject: str({ required: true }),
    type: str(),
    message: str({ required: true }),
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new', index: true },
  },
  { timestamps: true },
)
cleanJson(messageSchema)
export const Message = mongoose.model('Message', messageSchema)

// Resource name -> model (+ fixed filter) used by the generic admin CRUD routes.
export const resources = {
  research: { Model: ResearchInterest },
  publications: { Model: Publication },
  projects: { Model: Project },
  experience: { Model: TimelineEntry, fixed: { kind: 'experience' } },
  education: { Model: TimelineEntry, fixed: { kind: 'education' } },
  achievements: { Model: Achievement },
}
