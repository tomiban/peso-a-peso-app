import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import db from '@/lib/db';

import CategoriesStats from './_components/categories-stats';
import DashboardOverview from './_components/dashboard-overview';
import { RecentTransactions } from './_components/recent-transaction';

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

      <div className="grid w-full grid-cols-1 gap-4 sm:gap-6">
        {<CategoriesStats userSettings={userSettings} />}
      </div>
    </div>
  );
}
