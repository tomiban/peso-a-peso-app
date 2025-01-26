/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(_: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, message: 'No session found' },
        { status: 401 },
      );
    }

    const userSettings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {},
      create: {
        userId: session.user.id,
        currency: 'ARS',
      },
    });

    console.log('userSettings:', userSettings);

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: {
          currency: userSettings.currency,
          userId: userSettings.userId,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {

    console.error('Error:', error instanceof Error ? error.message : error);

    return new NextResponse(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500 },
    );
  }
}
