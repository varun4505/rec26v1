import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI?.trim()

declare global {
  // global cached Mongo client promise (development only)
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// Never throw at import time: that breaks `next build` (e.g. on Vercel) when
// the env var is missing or malformed. Fail only when the DB is actually used.
function connect(): Promise<MongoClient> {
  if (!uri) return Promise.reject(new Error('Missing MONGODB_URI in environment'))
  try {
    return new MongoClient(uri).connect()
  } catch (err) {
    return Promise.reject(err)
  }
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = connect()
}

// Awaiting clientPromise still rejects; this only stops an unhandled-rejection
// crash while nothing is awaiting it yet (e.g. during the build).
clientPromise.catch(() => {})

export default clientPromise
