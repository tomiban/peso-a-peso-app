'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UpdateUserCurrencySchema } from '@/schema/user-settings';

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({ currency });

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return prisma.userSettings.update({
    where: { userId: session?.user?.id },
    data: { currency: parsedBody.data.currency },
  });
}

export async function GetUserSettings() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }
  return prisma.userSettings.findUnique({
    where: { userId: session?.user?.id },
  });
}
