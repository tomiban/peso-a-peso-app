import { getDaysInMonth } from 'date-fns';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Period, Timeframe } from '@/lib/types';

const getHistoryDataSchema = z.object({
  timeframe: z.enum(['month', 'year']),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe');
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(
    session.user.id,
    queryParams.data.timeframe,
    {
      month: queryParams.data.month,
      year: queryParams.data.year,
    },
  );

  return Response.json(data);
}

export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period,
) {
  switch (timeframe) {
    case 'year': {
      return await getYearHistoryData(userId, period.year);
    }
    case 'month': {
      return await getMonthHistoryData(userId, period.year, period.month);
    }
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ['month'],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: 'asc',
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  for (let index = 0; index < 12; index++) {
    let expense = 0;
    let income = 0;

    const month = result.find(row => row.month === index);
    if (month) {
      expense = Number(month._sum.expense) || 0;
      income = Number(month._sum.income) || 0;
    }

    history.push({
      year,
      month: index,
      expense,
      income,
    });
  }

  return history;
}

async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number,
) {
  const result = await prisma.monthHistory.groupBy({
    by: ['day'],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: 'asc',
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let index = 1; index <= daysInMonth; index++) {
    let expense = 0;
    let income = 0;

    const day = result.find(row => row.day === index);
    if (day) {
      expense = Number(day._sum.expense) || 0;
      income = Number(day._sum.income) || 0;
    }

    history.push({
      expense,
      income,
      year,
      month,
      day: index,
    });
  }

  return history;
}
