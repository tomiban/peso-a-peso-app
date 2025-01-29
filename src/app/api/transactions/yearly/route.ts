import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { MONTHS } from '@/lib/months';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();

    const expenses = await prisma.$queryRaw<
      Array<{ month: number; total: number }>
    >`
    SELECT 
      MONTH(t.date) as month,
    SUM(t.amount) as total 
    FROM Transaction t
    WHERE 
      t.userId = ${session.user.id}
      AND t.type = 'EXPENSE'
      AND t.date >= ${startOfYear}
    GROUP BY MONTH(t.date)  -- Agrupa correctamente por año y mes
    ORDER BY month;
  `;

    const formattedExpenses = expenses.map(expense => ({
      month: MONTHS[Number(expense.month)],
      total: expense.total,
    }));

    return NextResponse.json(
      { success: true, data: formattedExpenses },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
