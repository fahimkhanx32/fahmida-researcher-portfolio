import { Router } from 'express'
import { config } from '../config.js'
import { Achievement, Message, Project, Publication, ResearchInterest, TimelineEntry } from '../models.js'
import { HttpError } from '../utils.js'
import { limiter, validate } from '../middleware.js'
import { contactSchema } from '../schemas.js'
import { getSettings } from '../services.js'

const visible = (Model, extra = {}) => Model.find({ visible: true, ...extra }).sort({ order: 1, createdAt: 1 })

export function publicRoutes({ mailer, limits }) {
  const r = Router()
  const contactLimit = limiter(limits.contact, 60 * 60 * 1000, 'You have sent several messages recently. Please try again in an hour.')

  // One request returns everything the public website needs.
  r.get('/site', async (_req, res) => {
    const [settings, research, publications, projects, experience, education, achievements] = await Promise.all([
      getSettings(),
      visible(ResearchInterest),
      visible(Publication),
      visible(Project),
      visible(TimelineEntry, { kind: 'experience' }),
      visible(TimelineEntry, { kind: 'education' }),
      visible(Achievement),
    ])
    res.set('Cache-Control', 'no-cache')
    res.json({ settings, research, publications, projects, experience, education, achievements })
  })

  r.post('/contact', contactLimit, validate(contactSchema), async (req, res) => {
    const settings = await getSettings()
    if (!settings.contact.formEnabled) throw new HttpError(403, 'The contact form is turned off at the moment.')
    const { website, ...data } = req.body
    if (website) return res.status(201).json({ message: 'Thank you. Your message has been received.' }) // bots fill the hidden field: pretend success, save nothing
    await Message.create(data)
    const to = config.notifyEmail || settings.contact.email
    if (to) {
      mailer
        .send({ to, replyTo: data.email, subject: `New portfolio message: ${data.subject}`, text: `From: ${data.name} <${data.email}>\nType: ${data.type || '-'}\n\n${data.message}` })
        .catch((e) => console.error('Notification e-mail failed:', e.message))
    }
    res.status(201).json({ message: 'Thank you. Your message has been received.' })
  })

  return r
}
