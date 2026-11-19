// `npm run seed` — creates the owner account (from .env) and the default content if they are missing. Safe to run again.
import { assertConfig } from './config.js'
import { connectDb, disconnectDb } from './db.js'
import { ensureAdmin, ensureContent } from './services.js'

assertConfig()
await connectDb()
await ensureContent()
const admin = await ensureAdmin()
console.log(admin ? 'Created the owner account and default content.' : 'Default content is in place. (No new owner account was created.)')
await disconnectDb()
