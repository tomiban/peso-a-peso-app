import type { NextAuthConfig } from 'next-auth';

import database from './db';

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/error',
    signIn: '/login',
    signOut: '/login',
  },

  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await database.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await database.user.create({
            data: {
              email: user.email!,
              name: user.name || '',
              image: user.image || '',
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const databaseUser = await database.user.findUnique({
          where: { email: token.email! },
        });

        if (databaseUser) {
          token.id = databaseUser.id;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
