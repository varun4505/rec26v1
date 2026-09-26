import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

declare global {
  // global cached Mongo client promise (development only)
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  // Don't throw at import time: that breaks `next build` when the env var
  // isn't configured yet. Fail only when something actually uses the DB.
  clientPromise = Promise.reject(new Error('Missing MONGODB_URI in environment'))
  clientPromise.catch(() => {})
} else if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise!
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
