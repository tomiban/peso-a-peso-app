import { redirect } from 'next/navigation';

import { GetFormattedForCurrency } from '@/helpers/helpers';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { OverviewQuerySchema } from '@/schema/overview';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(
    session.user.id,
    queryParams.data.from,
    queryParams.data.to,
  );

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    throw new Error('user settings not found');
  }

  const formatter = GetFormattedForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return transactions.map(transaction => ({
    ...transaction,
    // lets format the amount with the user currency
    formattedAmount: formatter.format(Number(transaction.amount)),
  }));
}
