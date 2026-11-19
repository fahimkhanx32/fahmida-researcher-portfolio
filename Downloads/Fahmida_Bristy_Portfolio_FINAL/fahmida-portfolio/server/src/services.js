import nodemailer from 'nodemailer'
import { v2 as cloudinary } from 'cloudinary'
import bcrypt from 'bcryptjs'
import { config, cloudinaryConfigured } from './config.js'
import { Admin, Settings, ResearchInterest, TimelineEntry } from './models.js'
import { defaultResearch, defaultSettings, defaultTimeline } from './defaults.js'
import { removedAssets } from './utils.js'

/* =====================================================================================
   SERVICES — settings (with defaults), owner account bootstrap, e-mail, and file uploads.
   ===================================================================================== */

const clone = (v) => JSON.parse(JSON.stringify(v))
const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

/* ---------- settings ---------- */

// Fill anything missing from the stored document with the defaults, so new fields never break an old database.
function withDefaults(stored) {
  const out = {}
  for (const key of Object.keys(defaultSettings)) {
    const def = defaultSettings[key]
    const val = stored[key]
    if (key === 'sections') {
      const byKey = new Map((Array.isArray(val) ? val : []).map((s) => [s.key, s]))
      const known = (Array.isArray(val) ? val : []).filter((s) => def.some((d) => d.key === s.key)).map((s) => ({ ...def.find((d) => d.key === s.key), ...s }))
      const missing = def.filter((d) => !byKey.has(d.key))
      out.sections = clone([...known, ...missing])
    } else if (isPlainObject(def)) {
      out[key] = clone({ ...def, ...(isPlainObject(val) ? val : {}) })
    } else {
      out[key] = Array.isArray(val) ? clone(val) : clone(def) // a stored list wins, even when the owner emptied it
    }
  }
  return out
}

export async function getSettings() {
  let doc = await Settings.findOne({ key: 'site' })
  if (!doc) {
    try {
      doc = await Settings.create({ key: 'site', ...clone(defaultSettings) })
    } catch {
      doc = await Settings.findOne({ key: 'site' }) // created by a parallel request
    }
  }
  return withDefaults(doc.toObject())
}

export async function saveSettings(patch, uploader) {
  const before = await getSettings()
  await Settings.updateOne({ key: 'site' }, { $set: patch }, { upsert: true })
  const after = await getSettings()
  await uploader?.destroy(removedAssets(before, after))
  return after
}

/* ---------- owner account + first-run content ---------- */

export async function ensureAdmin(log = console) {
  // accounts made before the "username" field existed keep logging in with their e-mail
  for (const a of await Admin.find({ username: { $exists: false } })) {
    a.username = a.email
    await a.save()
  }
  if (await Admin.countDocuments()) return null
  if (!config.adminUsername || !config.adminPassword) {
    log.warn('No owner account exists yet. Set ADMIN_EMAIL (or ADMIN_USERNAME) and ADMIN_PASSWORD in server/.env and restart to create it.')
    return null
  }
  const passwordHash = await bcrypt.hash(config.adminPassword, 12)
  const admin = await Admin.create({
    username: config.adminUsername,
    email: config.adminEmail.includes('@') ? config.adminEmail : undefined,
    name: config.adminName,
    passwordHash,
  })
  log.info(`Owner account created (username: ${admin.username}). You can remove ADMIN_PASSWORD from .env now; change the username or password any time in the dashboard.`)
  return admin
}

export async function ensureContent() {
  await getSettings()
  if (!(await ResearchInterest.countDocuments())) {
    await ResearchInterest.insertMany(defaultResearch.map((r, order) => ({ ...r, order })))
  }
  if (!(await TimelineEntry.countDocuments())) {
    const counters = {}
    await TimelineEntry.insertMany(defaultTimeline.map((t) => ({ ...t, order: (counters[t.kind] = (counters[t.kind] ?? -1) + 1) })))
  }
}

/* ---------- e-mail (Nodemailer; prints to the console when SMTP is not configured) ---------- */

export function createMailer() {
  const { host, port, user, pass, from } = config.smtp
  const transport = host ? nodemailer.createTransport({ host, port, secure: port === 465, auth: user ? { user, pass } : undefined }) : null
  return {
    configured: Boolean(transport),
    async send({ to, subject, text, replyTo }) {
      if (!transport) {
        console.log(`\n[mail not configured] To: ${to}\nSubject: ${subject}\n${text}\n`)
        return { sent: false }
      }
      await transport.sendMail({ from, to, subject, text, replyTo })
      return { sent: true }
    },
  }
}

/* ---------- uploads (Cloudinary) ---------- */

// Check the real file signature, not just the name the browser claims.
export function sniffFileType(buf) {
  if (!buf || buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image'
  if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image'
  if (buf.subarray(0, 4).toString() === '%PDF') return 'pdf'
  return null
}

export function createUploader() {
  const setup = () => cloudinary.config({ cloud_name: config.cloudinary.cloudName, api_key: config.cloudinary.apiKey, api_secret: config.cloudinary.apiSecret, secure: true })
  return {
    configured: cloudinaryConfigured,
    async upload(buffer, { folder = 'misc', kind = 'image', filename = '' }) {
      setup()
      const resource_type = kind === 'pdf' ? 'raw' : 'image'
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: `fahmida-portfolio/${folder}`, resource_type, use_filename: kind === 'pdf', unique_filename: true }, (err, res) => (err ? reject(err) : resolve(res)))
          .end(buffer)
      })
      return { url: result.secure_url, publicId: result.public_id, resourceType: resource_type, name: filename, bytes: result.bytes }
    },
    // Best effort: a failed clean-up must never fail the save the user just made.
    async destroy(assets = []) {
      if (!assets.length || !cloudinaryConfigured()) return
      setup()
      await Promise.allSettled(assets.map((a) => cloudinary.uploader.destroy(a.publicId, { resource_type: a.resourceType || 'image' })))
    },
  }
}
