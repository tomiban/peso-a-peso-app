import type { NextAuthConfig } from 'next-auth';

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
