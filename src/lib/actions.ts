'use server';
import bcryptjs from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn, signOut } from '@/lib/auth';
import { LoginSchema, RegisterSchema } from '@/schema/auth';

import database from './db';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const { name, email, password, confirmPassword } = values;

    const { data, success } = RegisterSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!success) {
      return { error: 'Datos incorrectas' };
    }

    const user = await database.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return { error: 'El usuario ya existe' };
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    await database.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message || error.message };
    }
    return { error: 'error desconocido' };
  }
};

export async function login(values: z.infer<typeof LoginSchema>) {
  try {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message || error.message };
    }
    return { error: 'error desconocido' };
  }
}

export async function logout() {
  await signOut();
}
