import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { OverviewQuerySchema } from '@/schema/overview';

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

  if (!queryParams.success) {
    return {
      status: 400,
      json: {
        error: queryParams.error.message,
      },
    };
  }

  const stats = await getBalanceStats(
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

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ['type'],
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
  });
  return {
    expense: totals.find(t => t.type === 'EXPENSE')?._sum.amount || 0,
    income: totals.find(t => t.type === 'INCOME')?._sum.amount || 0,
  };
}
