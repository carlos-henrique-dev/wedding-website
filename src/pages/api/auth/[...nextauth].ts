import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { FireStoreAdapter } from '@/infra'

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/auth/credentials-signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null

        const database = new FireStoreAdapter()

        const { username, password } = credentials

        const user = await database.getUser(username)

        if (!user) return null

        if (user.password !== password) return null

        return {
          id: user.id,
          name: user.name,
          side: user.side,
          username: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.username = user.username
        token.side = user.side
      }
      return token
    },
    session({ session, newSession, token, trigger, user }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.username = token.username
        session.user.side = token.side
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
