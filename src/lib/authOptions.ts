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
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          hd: "vitstudent.ac.in"
        }
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow VIT student emails
      if (user.email && !user.email.endsWith('@vitstudent.ac.in')) {
        return false;
      }

      // Only allow 2024 and 2025 batch
      if (user.email) {
        const isAllowedBatch = user.email.includes('2022') || user.email.includes('2025');
        if (!isAllowedBatch) {
          return '/access-denied';
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions
