'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { GetHexRandomColor } from '@/helpers/helpers';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
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
    const color = GetHexRandomColor();

    const category = await db.category.create({
      data: {
        name,
        icon,
        color,
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

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('bad request');
  }

  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return await db.category.delete({
    where: {
      name_userId_type: {
        userId: session.user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
