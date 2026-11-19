import { Router } from 'express'
import multer from 'multer'
import bcrypt from 'bcryptjs'
import {
  Admin, Achievement, Message, Project, Publication, ResearchInterest, TimelineEntry, resources,
} from '../models.js'
import { HttpError, plain, removedAssets, collectAssets } from '../utils.js'
import { objectId, requireAuth, validate } from '../middleware.js'
import {
  messageStatusSchema, profileUpdateSchema, reorderSchema, resourceSchemas, settingsSchema, visibilitySchema,
} from '../schemas.js'
import { getSettings, saveSettings, sniffFileType } from '../services.js'

/* Everything under /api/admin requires the owner to be signed in. */

function resourceRouter({ Model, fixed = {} }, schema, uploader) {
  const r = Router()

  r.get('/', async (_req, res) => res.json(await Model.find(fixed).sort({ order: 1, createdAt: 1 })))

  r.post('/', validate(schema), async (req, res) => {
    const last = await Model.findOne(fixed).sort({ order: -1 }).select('order')
    const doc = await Model.create({ ...req.body, ...fixed, order: (last?.order ?? -1) + 1 })
    res.status(201).json(doc)
  })

  // before "/:id" so "reorder" is not mistaken for an id
  r.patch('/reorder', validate(reorderSchema), async (req, res) => {
    await Model.bulkWrite(req.body.ids.map((id, order) => ({ updateOne: { filter: { _id: id, ...fixed }, update: { $set: { order } } } })))
    res.json(await Model.find(fixed).sort({ order: 1, createdAt: 1 }))
  })

  r.get('/:id', objectId, async (req, res) => {
    const doc = await Model.findOne({ _id: req.params.id, ...fixed })
    if (!doc) throw new HttpError(404, 'Not found')
    res.json(doc)
  })

  r.put('/:id', objectId, validate(schema.partial()), async (req, res) => {
    const doc = await Model.findOne({ _id: req.params.id, ...fixed })
    if (!doc) throw new HttpError(404, 'Not found')
    const before = plain(doc)
    doc.set(req.body)
    await doc.save()
    await uploader.destroy(removedAssets(before, plain(doc)))
    res.json(doc)
  })

  r.patch('/:id/visibility', objectId, validate(visibilitySchema), async (req, res) => {
    const doc = await Model.findOneAndUpdate({ _id: req.params.id, ...fixed }, { visible: req.body.visible }, { new: true })
    if (!doc) throw new HttpError(404, 'Not found')
    res.json(doc)
  })

  r.delete('/:id', objectId, async (req, res) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id, ...fixed })
    if (!doc) throw new HttpError(404, 'Not found')
    await uploader.destroy(collectAssets(plain(doc)))
    res.json({ message: 'Deleted' })
  })

  return r
}

export function adminRoutes({ uploader }) {
  const r = Router()
  r.use(requireAuth)

  /* ----- site-wide settings (profile, about, sections, contact …) ----- */
  r.get('/settings', async (_req, res) => res.json(await getSettings()))
  r.put('/settings', validate(settingsSchema), async (req, res) => {
    if (!Object.keys(req.body).length) throw new HttpError(400, 'Nothing to save')
    res.json(await saveSettings(req.body, uploader))
  })

  /* ----- owner account ----- */
  r.put('/account', validate(profileUpdateSchema), async (req, res) => {
    const { name, username, email, currentPassword } = req.body
    const changesLogin = (username !== undefined && username !== req.admin.username) || (email !== undefined && (email || undefined) !== req.admin.email)
    if (changesLogin) {
      // changing how you sign in or where reset links go needs the current password
      if (!currentPassword || !(await bcrypt.compare(currentPassword, req.admin.passwordHash))) {
        throw new HttpError(400, 'Enter your current password to change your username or email', { currentPassword: 'Your current password is required' })
      }
      if (username !== undefined && username !== req.admin.username && (await Admin.exists({ username }))) throw new HttpError(400, 'That username is already taken', { username: 'Already taken' })
      if (email && email !== req.admin.email && (await Admin.exists({ email }))) throw new HttpError(400, 'That email is already used', { email: 'Already used' })
    }
    req.admin.name = name
    if (username !== undefined) req.admin.username = username
    if (email !== undefined) req.admin.email = email || undefined
    await req.admin.save()
    res.json({ admin: req.admin })
  })

  /* ----- content collections ----- */
  for (const [name, def] of Object.entries(resources)) r.use(`/${name}`, resourceRouter(def, resourceSchemas[name], uploader))

  /* ----- contact-form inbox ----- */
  r.get('/messages', async (req, res) => {
    const filter = ['new', 'read', 'archived'].includes(req.query.status) ? { status: req.query.status } : {}
    res.json(await Message.find(filter).sort({ createdAt: -1 }).limit(500))
  })
  r.patch('/messages/read-all', async (_req, res) => {
    const out = await Message.updateMany({ status: 'new' }, { status: 'read' })
    res.json({ updated: out.modifiedCount })
  })
  r.patch('/messages/:id', objectId, validate(messageStatusSchema), async (req, res) => {
    const doc = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!doc) throw new HttpError(404, 'Not found')
    res.json(doc)
  })
  r.delete('/messages/:id', objectId, async (req, res) => {
    const doc = await Message.findByIdAndDelete(req.params.id)
    if (!doc) throw new HttpError(404, 'Not found')
    res.json({ message: 'Deleted' })
  })

  /* ----- dashboard numbers ----- */
  r.get('/stats', async (_req, res) => {
    const since = new Date(Date.now() - 13 * 24 * 3600 * 1000)
    since.setHours(0, 0, 0, 0)
    const [counts, unread, recent, perDay] = await Promise.all([
      Promise.all([
        ResearchInterest.countDocuments(), Publication.countDocuments(), Project.countDocuments(),
        TimelineEntry.countDocuments({ kind: 'experience' }), TimelineEntry.countDocuments({ kind: 'education' }),
        Achievement.countDocuments(), Message.countDocuments(),
      ]),
      Message.countDocuments({ status: 'new' }),
      Message.find().sort({ createdAt: -1 }).limit(5),
      Message.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      ]),
    ])
    const byDay = Object.fromEntries(perDay.map((d) => [d._id, d.count]))
    const series = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(since.getTime() + i * 24 * 3600 * 1000)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return { date: key, count: byDay[key] ?? 0 }
    })
    const [research, publications, projects, experience, education, achievements, messages] = counts
    res.json({ counts: { research, publications, projects, experience, education, achievements, messages }, unreadMessages: unread, recentMessages: recent, messagesPerDay: series })
  })

  /* ----- file upload (photo, CV, project images) ----- */
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 } })
  r.post('/upload', upload.single('file'), async (req, res) => {
    if (!uploader.configured()) throw new HttpError(503, 'File uploads are not set up yet. Add your Cloudinary keys to server/.env, or paste a link instead.')
    if (!req.file) throw new HttpError(400, 'Choose a file to upload')
    const kind = sniffFileType(req.file.buffer)
    const wanted = req.body.kind === 'pdf' ? 'pdf' : 'image'
    if (!kind || kind !== wanted) throw new HttpError(400, wanted === 'pdf' ? 'Please choose a PDF file' : 'Please choose a JPG, PNG or WebP image')
    const folder = ['profile', 'cv', 'projects', 'publications', 'achievements'].includes(req.body.folder) ? req.body.folder : 'misc'
    res.status(201).json(await uploader.upload(req.file.buffer, { folder, kind, filename: req.file.originalname.slice(0, 200) }))
  })

  return r
}
