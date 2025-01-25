import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import db from '@/lib/db';

import { ActionButtons } from './_components/action-buttons';
import { ExpenseChart } from './_components/expense-chart';
import { ExpensesPieChart } from './_components/expenses-pie-chart';
import { RecentTransactions } from './_components/recent-transaction';
import { SavingsGoal } from './_components/saving-goals';
import { StatCard } from './_components/stat-card';

export default async function DashboardPage() {
  const session = await auth();
  const userSettings = await db.userSettings.findUnique({
    where: { userId: session?.user?.id },
  });

  if (!userSettings) {
    redirect('/wizard');
  }

  return (
    <div className="space-y-6 py-8 sm:space-y-8">
      <div>
        <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Panel Financiero
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gestiona tus finanzas con facilidad
        </p>
      </div>

      <ActionButtons />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Balance Total"
          value="$12,750.85"
          icon={<Wallet className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Ingresos Mensuales"
          value="$4,250.00"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Gastos Mensuales"
          value="$2,850.00"
          icon={<TrendingDown className="h-6 w-6" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Tasa de Ahorro"
          value="32.9%"
          icon={<DollarSign className="h-6 w-6" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <ExpensesPieChart />
        <SavingsGoal />
      </div>
    </div>
  );
}
