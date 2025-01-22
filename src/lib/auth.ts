import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { LoginSchema } from '@/schema/auth';

import { authConfig } from './auth.config';
import database from './db';

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const { data, success } = LoginSchema.safeParse(credentials);

        //verificamos si loos datos llegaron bien del front
        if (!success) {
          throw new Error('Credenciales incorrectas');
        }
        //verificamos si existe el usuario
        const user = await database.user.findFirst({
          where: {
            email: data.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Credenciales incorrectas');
        }

        //verificamos si la contraseña es correcta
        const passwordMatch = await bcryptjs.compare(
          data.password,
          user.password,
        );

        if (!passwordMatch) {
          throw new Error('Credenciales incorrectas');
        }

        return user;1
      },
    }),
  ],
});
