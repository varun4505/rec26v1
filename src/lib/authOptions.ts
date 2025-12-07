import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import type { Adapter } from 'next-auth/adapters'

export const authOptions: AuthOptions = {
  // Persist NextAuth data in MongoDB
  adapter: MongoDBAdapter(clientPromise) as unknown as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions
