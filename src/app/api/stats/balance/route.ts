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
  const queryParams = OverviewQuerySchema.safeParse({
    from: searchParams.get('from'),
    to: searchParams.get('to'),
  });

  if (!queryParams.success) {
    return NextResponse.json(
      { error: queryParams.error.message },
      { status: 400 },
    );
  }

  const stats = await getBalanceStats(
    session.user.id!,
    queryParams.data.from,
    queryParams.data.to,
  );

  return NextResponse.json(
    {
      success: true,
      data: stats,
    },
    { status: 200 },
  );
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
