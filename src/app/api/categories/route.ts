import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const { searchParams } = new URL(request.url);

  const parameterType = searchParams.get('type');

  const validator = z.enum(['EXPENSE', 'INCOME']).nullable(); // si no pasamos el filtro traemos todas las categorias
  const queryParams = validator.safeParse(parameterType);

  if (!queryParams.success) {
    return NextResponse.json({
      success: false,
      message: queryParams.error,
      status: 400,
    });
  }

  const type = queryParams.data;

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.id,
      ...(type && { type }), // incluye el type en la consulta si  viene en los parametros
    },
    orderBy: {
      name: 'asc',
    },
  });

  return NextResponse.json({
    success: true,
    status: 200,
    data: categories,
  });
}
