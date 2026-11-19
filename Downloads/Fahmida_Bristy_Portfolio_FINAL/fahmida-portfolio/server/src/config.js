import 'dotenv/config'

// All configuration comes from environment variables (see .env.example). Nothing secret lives in the code.
const env = process.env
const list = (v, fallback) => (v || fallback).split(',').map((s) => s.trim()).filter(Boolean)

export const config = {
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  port: Number(env.PORT) || 5000,
  mongoUri: env.MONGODB_URI || '',
  clientOrigins: list(env.CLIENT_ORIGIN, 'http://localhost:5173'),
  publicSiteUrl: env.PUBLIC_SITE_URL || list(env.CLIENT_ORIGIN, 'http://localhost:5173')[0],
  jwtSecret: env.JWT_SECRET || '',
  cookieSameSite: env.COOKIE_SAMESITE || 'lax', // use "none" only if the site and API are on different domains
  adminEmail: (env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminUsername: (env.ADMIN_USERNAME || env.ADMIN_EMAIL || '').trim().toLowerCase(), // login name; defaults to ADMIN_EMAIL
  adminPassword: env.ADMIN_PASSWORD || '',
  adminName: env.ADMIN_NAME || 'Dr. Fahmida Bristy',
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: env.CLOUDINARY_API_KEY || '',
    apiSecret: env.CLOUDINARY_API_SECRET || '',
  },
  smtp: {
    host: env.SMTP_HOST || '',
    port: Number(env.SMTP_PORT) || 587,
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
    from: env.SMTP_FROM || 'Portfolio <no-reply@localhost>',
  },
  notifyEmail: (env.NOTIFY_EMAIL || '').trim(),
  limits: {
    login: Number(env.RATE_LIMIT_LOGIN) || 10, // attempts per 15 minutes
    contact: Number(env.RATE_LIMIT_CONTACT) || 5, // messages per hour
    forgot: Number(env.RATE_LIMIT_FORGOT) || 5,
  },
}

// Refuse to start with a broken setup, with a message that says exactly what to fix.
export function assertConfig() {
  const problems = []
  if (!config.mongoUri) problems.push('MONGODB_URI is not set.')
  if (config.mongoUri.includes('<db_password>')) problems.push('MONGODB_URI still contains <db_password>. Replace it with your real Atlas database-user password.')
  if (!config.jwtSecret) problems.push('JWT_SECRET is not set. Generate one: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"')
  else if (config.jwtSecret.length < 32) problems.push('JWT_SECRET must be at least 32 characters.')
  if (problems.length) {
    throw new Error(`Configuration problem:\n - ${problems.join('\n - ')}`)
  }
}

export const cloudinaryConfigured = () => Boolean(config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret)
