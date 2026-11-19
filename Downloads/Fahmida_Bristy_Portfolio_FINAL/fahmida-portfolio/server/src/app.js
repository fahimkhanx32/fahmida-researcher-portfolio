import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { config } from './config.js'
import { errorHandler, notFound, originGuard } from './middleware.js'
import { createMailer, createUploader } from './services.js'
import { authRoutes } from './routes/auth.js'
import { publicRoutes } from './routes/public.js'
import { adminRoutes } from './routes/admin.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const clientDist = process.env.CLIENT_DIST || path.resolve(here, '../../client/dist')

// The built site has one inline script (it applies the saved theme before the first paint).
// Allow exactly that script by its hash instead of allowing every inline script.
function inlineScriptHashes(dir) {
  try {
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8')
    return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => `'sha256-${crypto.createHash('sha256').update(m[1]).digest('base64')}'`)
  } catch {
    return []
  }
}

// Dependencies (mailer, uploader, rate limits) can be replaced, which is how the tests run without real e-mail or Cloudinary.
export function createApp({ mailer = createMailer(), uploader = createUploader(), limits = config.limits } = {}) {
  const app = express()
  app.disable('x-powered-by')
  if (config.isProd) app.set('trust proxy', 1) // behind a host's proxy, so rate limits see the visitor's real IP

  const serveClient = fs.existsSync(path.join(clientDist, 'index.html'))

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", ...inlineScriptHashes(clientDist)],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], // MUI injects its styles at runtime
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: config.isProd ? [] : null,
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  )
  app.use(cors({ origin: config.clientOrigins, credentials: true }))
  if (!config.isTest) app.use(morgan(config.isProd ? 'combined' : 'dev'))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use('/api', originGuard)

  app.get('/api/health', (_req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', uploads: uploader.configured() }))
  app.use('/api/auth', authRoutes({ mailer, limits }))
  app.use('/api/admin', adminRoutes({ uploader }))
  app.use('/api', publicRoutes({ mailer, limits }))
  app.use('/api', notFound)

  // One-server deployment: serve the built website and fall back to index.html for client-side routes.
  if (serveClient) {
    app.use(express.static(clientDist, { index: false, maxAge: '1y', immutable: true, setHeaders: (res, p) => p.endsWith('.html') && res.setHeader('Cache-Control', 'no-cache') }))
    app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html'), { headers: { 'Cache-Control': 'no-cache' } }))
  }

  app.use(errorHandler)
  return app
}
