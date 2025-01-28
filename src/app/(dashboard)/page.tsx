import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import db from '@/lib/db';

import DashboardOverview from './_components/dashboard-overview';
import { RecentTransactions } from './_components/recent-transaction';
import { SavingsGoal } from './_components/saving-goals';

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
      <DashboardOverview userSettings={userSettings} />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          {/*  <ExpenseChart userSettings={userSettings} /> */}
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/*   <ExpensesPieChart
          userSettings={userSettings}
          from={new Date('2025-01-01T00:00:00.000Z')}
          to={new Date('2025-01-31T23:59:59.999Z')}
        /> */}
        <SavingsGoal />
      </div>
    </div>
  );
}
