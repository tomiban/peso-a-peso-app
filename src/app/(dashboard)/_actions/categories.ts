'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/category';

export async function createCategory(form: CreateCategorySchemaType) {
  try {
    console.log(form);
    const parsedBody = CreateCategorySchema.safeParse(form);
    if (!parsedBody.success) {
      throw new Error('Datos de categoría inválidos');
    }

    const session = await auth();
    if (!session?.user) {
      redirect('/login');
    }

    const { name, icon, type } = parsedBody.data;

    const category = await db.category.create({
      data: {
        name,
        icon,
        type,
        userId: session.user.id,
      },
    });

    // Revalidar la caché después de crear la categoría
    revalidatePath('/');

    return category;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
}
