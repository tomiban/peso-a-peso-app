'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/schema/transaction';

export async function createTransaction(form: CreateTransactionSchemaType) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect('/login');
    }

    if (!form) {
      throw new Error('Los datos de la transacción son requeridos');
    }
    console.log(form);
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
      throw new Error('Datos de transacción inválidos');
    }

    const transaction = await db.transaction.create({
      data: {
        userId: session.user.id,
        ...parsedBody.data,
        categoryId: parsedBody.data.categoryId,
      },
    });

    revalidatePath('/dashboard');
    return transaction;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al crear transacción',
    );
  }
}
