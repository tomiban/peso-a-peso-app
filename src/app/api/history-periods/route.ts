/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const periods = await getHistoryPeriods(session?.user?.id);
  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ['year'],
    orderBy: [
      {
        year: 'asc',
      },
    ],
  });

  const years = result.map(element => element.year);
  if (years.length === 0) {
    // Return the current year
    return [new Date().getFullYear()];
  }

  return years;
}
