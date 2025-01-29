'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
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
    console.log(parsedBody);
    const { note, amount, category, date, type } = parsedBody.data!;
    if (!parsedBody.success) {
      throw new Error('Datos de transacción inválidos');
    }

    const categoryRow = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        id: category,
      },
    });

    if (!categoryRow) {
      throw new Error('Category not found');
    }

    return await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          note,
          amount,
          category: categoryRow.name,
          categoryIcon: categoryRow.icon,
          categoryColor: categoryRow.color,
          type,
          date,
        },
      }),

      prisma.monthHistory.upsert({
        where: {
          userId_year_month_day: {
            userId: session.user.id!,
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            day: date.getUTCDate(),
          },
        },
        create: {
          userId: session.user.id!,
          year: date.getUTCFullYear(),
          month: date.getUTCMonth(),
          expense: type === 'EXPENSE' ? amount : 0,
          income: type === 'INCOME' ? amount : 0,
          day: date.getUTCDate(),
        },
        update: {
          expense: {
            increment: type === 'EXPENSE' ? amount : 0,
          },
          income: {
            increment: type === 'INCOME' ? amount : 0,
          },
        },
      }),

      prisma.yearHistory.upsert({
        where: {
          userId_year_month: {
            userId: session.user.id!,
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
          },
        },
        create: {
          userId: session.user.id!,
          year: date.getUTCFullYear(),
          month: date.getUTCMonth(),
          expense: type === 'EXPENSE' ? amount : 0,
          income: type === 'INCOME' ? amount : 0,
        },
        update: {
          expense: {
            increment: type === 'EXPENSE' ? amount : 0,
          },
          income: {
            increment: type === 'INCOME' ? amount : 0,
          },
        },
      }),
    ]);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al crear transacción',
    );
  }
}
