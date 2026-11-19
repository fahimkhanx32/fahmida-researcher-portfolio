import mongoose from 'mongoose'
import { assertConfig, config } from './config.js'
import { connectDb } from './db.js'
import { createApp } from './app.js'
import { ensureAdmin, ensureContent } from './services.js'

try {
  assertConfig()
} catch (e) {
  console.error(`\n${e.message}\n`)
  process.exit(1)
}

try {
  await connectDb()
} catch (e) {
  console.error(`\nCould not connect to MongoDB: ${e.message}\nCheck MONGODB_URI and that your IP address is allowed in Atlas (Network Access).\n`)
  process.exit(1)
}

await ensureContent()
await ensureAdmin()

const server = createApp().listen(config.port, () => {
  console.log(`API ready on http://localhost:${config.port}  (db: ${mongoose.connection.name})`)
})

const stop = () => server.close(() => mongoose.disconnect().then(() => process.exit(0)))
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
