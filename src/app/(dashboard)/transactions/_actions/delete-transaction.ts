'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function deleteTransaction(id: string) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        userId: session.user.id,
        id,
      },
    });

    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    await prisma.$transaction([
      // Eliminar transacción de la base de datos
      prisma.transaction.delete({
        where: {
          id,
          userId: session.user.id,
        },
      }),

      // Actualizar historial mensual
      prisma.monthHistory.update({
        where: {
          userId_year_month_day: {
            userId: session.user.id!,
            day: transaction.date.getUTCDate(),
            month: transaction.date.getUTCMonth(),
            year: transaction.date.getUTCFullYear(),
          },
        },
        data: {
          ...(transaction.type === 'EXPENSE' && {
            expense: {
              decrement: transaction.amount,
            },
          }),
          ...(transaction.type === 'INCOME' && {
            income: {
              decrement: transaction.amount,
            },
          }),
        },
      }),

      // Actualizar historial anual
      prisma.yearHistory.update({
        where: {
          userId_year_month: {
            userId: session.user.id!,
            month: transaction.date.getUTCMonth(),
            year: transaction.date.getUTCFullYear(),
          },
        },
        data: {
          ...(transaction.type === 'EXPENSE' && {
            expense: {
              decrement: transaction.amount,
            },
          }),
          ...(transaction.type === 'INCOME' && {
            income: {
              decrement: transaction.amount,
            },
          }),
        },
      }),
    ]);

    // Revalidar las rutas necesarias para actualizar la UI
    revalidatePath('/transactions');
  } catch (error) {
    console.error('Error al eliminar la transacción:', error);
    throw new Error('Error al eliminar la transacción');
  }
}
