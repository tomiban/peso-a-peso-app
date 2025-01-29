import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import db from '@/lib/db';

// Esquema de validación común
const querySchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME']).optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect('/login');

  try {
    const { searchParams } = new URL(request.url);

    // Parsear y validar parámetros
    const params = querySchema.safeParse({
      type: searchParams.get('type') || undefined, // Convertir null a undefined
      limit: searchParams.get('limit'),
    });

    if (!params.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros inválidos',
          details: params.error.flatten(),
          status: 400,
        },
        { status: 400 },
      );
    }

    const { type, limit } = params.data;

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        ...(type && { type }), // Filtro opcional por tipo
      },
      orderBy: { date: 'desc' },
      take: limit, // Usar limit si viene
    });

    return NextResponse.json(
      {
        success: true,
        data: transactions,
        status: 200,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        status: 500,
      },
      { status: 500 },
    );
  }
}
