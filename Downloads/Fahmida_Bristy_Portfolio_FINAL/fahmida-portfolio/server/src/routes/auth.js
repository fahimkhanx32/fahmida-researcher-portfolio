import crypto from 'node:crypto'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { config } from '../config.js'
import { Admin } from '../models.js'
import { HttpError, sha256 } from '../utils.js'
import {
  clearAuthCookie, limiter, requireAuth, setAuthCookie, validate,
} from '../middleware.js'
import { changePasswordSchema, forgotSchema, loginSchema, resetSchema } from '../schemas.js'

// A throw-away hash so "unknown e-mail" takes as long as "wrong password" (no account enumeration by timing).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12)

const findByLogin = (name) => Admin.findOne({ $or: [{ username: name }, { email: name }] })

export function authRoutes({ mailer, limits }) {
  const r = Router()
  const loginLimit = limiter(limits.login, 15 * 60 * 1000, 'Too many sign-in attempts. Please wait 15 minutes and try again.')
  const forgotLimit = limiter(limits.forgot, 60 * 60 * 1000, 'Too many reset requests. Please try again later.')

  r.post('/login', loginLimit, validate(loginSchema), async (req, res) => {
    const { username, password, remember } = req.body
    const admin = await findByLogin(username)
    const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH)
    if (!admin || !ok) throw new HttpError(401, 'Incorrect username or password')
    admin.lastLoginAt = new Date()
    await admin.save()
    setAuthCookie(res, admin, remember)
    res.json({ admin })
  })

  r.post('/logout', (_req, res) => {
    clearAuthCookie(res)
    res.json({ message: 'Signed out' })
  })

  r.get('/me', requireAuth, (req, res) => res.json({ admin: req.admin }))

  // Always answers the same way, so nobody can use this form to discover which e-mail owns the dashboard.
  r.post('/forgot', forgotLimit, validate(forgotSchema), async (req, res) => {
    const admin = await findByLogin(req.body.username)
    if (admin) {
      const token = crypto.randomBytes(32).toString('hex')
      admin.resetTokenHash = sha256(token)
      admin.resetExpires = new Date(Date.now() + 30 * 60 * 1000)
      await admin.save()
      const link = `${config.publicSiteUrl}/reset-password?token=${token}&username=${encodeURIComponent(admin.username)}`
      if (admin.email) {
        await mailer.send({
          to: admin.email,
          subject: 'Reset your dashboard password',
          text: `Use this link within 30 minutes to choose a new password:\n\n${link}\n\nIf you did not ask for this, you can ignore this e-mail.`,
        })
      } else {
        // no e-mail saved on the account: the link can only be read from the server's console
        console.warn(`Password reset link for "${admin.username}" (no e-mail on the account): ${link}`)
      }
    }
    res.json({ message: 'If that account exists and has an e-mail saved, a reset link has been sent.' })
  })

  r.post('/reset', forgotLimit, validate(resetSchema), async (req, res) => {
    const { token, username, password } = req.body
    const admin = await Admin.findOne({ $or: [{ username }, { email: username }], resetTokenHash: sha256(token), resetExpires: { $gt: new Date() } })
    if (!admin) throw new HttpError(400, 'This reset link is invalid or has expired. Please request a new one.')
    admin.passwordHash = await bcrypt.hash(password, 12)
    admin.tokenVersion += 1 // signs out every existing session
    admin.resetTokenHash = null
    admin.resetExpires = null
    await admin.save()
    clearAuthCookie(res)
    res.json({ message: 'Password updated. You can sign in now.' })
  })

  r.post('/change-password', requireAuth, validate(changePasswordSchema), async (req, res) => {
    const { currentPassword, newPassword } = req.body
    if (!(await bcrypt.compare(currentPassword, req.admin.passwordHash))) throw new HttpError(400, 'Your current password is not correct', { currentPassword: 'Incorrect password' })
    req.admin.passwordHash = await bcrypt.hash(newPassword, 12)
    req.admin.tokenVersion += 1
    await req.admin.save()
    setAuthCookie(res, req.admin) // keep this device signed in
    res.json({ message: 'Password changed. Other devices were signed out.' })
  })

  return r
}
