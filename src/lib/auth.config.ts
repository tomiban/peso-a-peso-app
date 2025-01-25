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
      try {
        if (account?.provider === 'google') {
          console.log(user);
          await database.user.upsert({
            where: { email: user.email! },
            update: {},
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              id: user.id,
            },
          });
        }
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      // Si no hay user, usar sub como id
      if (!token.id && token.sub) {
        token.id = token.sub;
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
