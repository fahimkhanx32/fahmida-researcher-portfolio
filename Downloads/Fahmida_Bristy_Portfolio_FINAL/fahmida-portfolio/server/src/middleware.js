import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { ZodError } from 'zod'
import mongoose from 'mongoose'
import { config } from './config.js'
import { Admin } from './models.js'
import { HttpError } from './utils.js'

export const COOKIE = 'fp_token'

export function signToken(admin, remember = false) {
  return jwt.sign({ sub: String(admin._id), v: admin.tokenVersion }, config.jwtSecret, { expiresIn: remember ? '30d' : '1d' })
}

export function setAuthCookie(res, admin, remember = false) {
  res.cookie(COOKIE, signToken(admin, remember), {
    httpOnly: true, // not readable by page scripts, so an XSS bug cannot steal the session
    secure: config.isProd || config.cookieSameSite === 'none',
    sameSite: config.cookieSameSite,
    maxAge: remember ? 30 * 24 * 3600 * 1000 : undefined, // without "remember me" it is a session cookie
    path: '/',
  })
}

export const clearAuthCookie = (res) => res.clearCookie(COOKIE, { path: '/', sameSite: config.cookieSameSite, secure: config.isProd || config.cookieSameSite === 'none' })

export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization
  const token = req.cookies?.[COOKIE] || (header?.startsWith('Bearer ') ? header.slice(7) : null)
  if (!token) throw new HttpError(401, 'Please sign in')
  let payload
  try {
    payload = jwt.verify(token, config.jwtSecret)
  } catch {
    throw new HttpError(401, 'Your session has expired. Please sign in again.')
  }
  const admin = await Admin.findById(payload.sub)
  if (!admin || admin.tokenVersion !== payload.v) throw new HttpError(401, 'Your session is no longer valid. Please sign in again.')
  req.admin = admin
  next()
}

// Browsers always send an Origin header on cross-site writes. Reject writes that come from a site we do not know.
export function originGuard(req, _res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  const origin = req.headers.origin
  if (!origin) return next() // non-browser clients (curl, tests) carry no ambient cookies to abuse
  let host = ''
  try {
    host = new URL(origin).host
  } catch {
    throw new HttpError(403, 'Bad origin')
  }
  if (config.clientOrigins.includes(origin) || host === req.headers.host) return next()
  throw new HttpError(403, 'Request blocked: unknown origin')
}

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {})
    if (!result.success) {
      const fields = {}
      for (const issue of result.error.issues) fields[issue.path.join('.') || '_'] ??= issue.message
      throw new HttpError(400, 'Please check the highlighted fields', fields)
    }
    req.body = result.data
    next()
  }
}

export const objectId = (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(404, 'Not found')
  next()
}

export function limiter(max, windowMs, message) {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => res.status(429).json({ error: message }),
  })
}

export const notFound = (_req, _res, next) => next(new HttpError(404, 'Not found'))

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message, fields: err.fields })
  if (err instanceof ZodError) return res.status(400).json({ error: 'Invalid data' })
  if (err?.name === 'CastError' || err?.name === 'ValidationError') return res.status(400).json({ error: 'Invalid data' })
  if (err?.code === 11000) return res.status(409).json({ error: 'That value already exists' })
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON' })
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large' })
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File is too large (max 10 MB)' })
  console.error(err)
  return res.status(500).json({ error: config.isProd ? 'Something went wrong' : String(err?.message || err) })
}
