import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { OverviewQuerySchema } from '@/schema/overview';

// Tipo para la estadística de una categoría
type CategoryStat = {
  categoryId: string;
  category: {
    name: string;
  };
  _sum: {
    amount: number | null;
  };
};

// Tipo para la respuesta exitosa
type SuccessResponse = {
  success: true;
  status: 200;
  stats: CategoryStat[];
};

// Tipo para la respuesta de error
type ErrorResponse = {
  status: 400;
  json: {
    error: string;
  };
};

// Tipo para la respuesta completa del endpoint
export type CategoryStatsResponse = SuccessResponse | ErrorResponse;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  console.log(queryParams);

  if (!queryParams.success) {
    return NextResponse.json({
      status: 400,
      json: {
        error: queryParams.error.message,
      },
    });
  }

  console.log(session.user.id!, queryParams.data.from, queryParams.data.to);

  const stats = await getCategoriesStats(
    session.user.id!,
    queryParams.data.from,
    queryParams.data.to,
  );

  return NextResponse.json({
    success: true,
    status: 200,
    data: stats,
  });
}

// Tipo para el resultado de getCategoriesStats
export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

export async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ['type', 'category', 'categoryIcon'],
    where: {
      userId,
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  });

  return stats;
}
