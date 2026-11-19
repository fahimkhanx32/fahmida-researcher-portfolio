import dns from 'node:dns/promises'
import mongoose from 'mongoose'
import { config } from './config.js'

// Use public DNS servers so the Atlas "mongodb+srv://" address resolves even when the local network's DNS blocks it.
dns.setServers(['1.1.1.1', '8.8.8.8'])

mongoose.set('strictQuery', true)

export async function connectDb(uri = config.mongoUri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  return mongoose.connection
}

export const disconnectDb = () => mongoose.disconnect()
