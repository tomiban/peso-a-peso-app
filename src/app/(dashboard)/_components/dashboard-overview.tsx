'use client';
import { UserSettings } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const DateRangePicker = dynamic(
  () =>
    import('@/components/ui/date-range-picker').then(
      module_ => module_.DateRangePicker,
    ),
  {
    ssr: false,
  },
);
import { useTransactions } from '@/contexts/transaction-context';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';

import { ActionButtons } from './action-buttons';
import StatsCards from './stats-cards';

type Props = {
  userSettings: UserSettings;
};

export default function DashboardOverview({ userSettings }: Props) {
  const { dateRange, setDateRange } = useTransactions();
  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Panel Financiero
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gestiona tus finanzas con facilidad
          </p>
        </div>
        <DateRangePicker
          locale="es-ES"
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={values => {
            const { from, to } = values.range;
            if (!from || !to) return;
            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
              toast.error(
                `La fecha seleccionada es demasiado grande. El rango maximo es ${MAX_DATE_RANGE_DAYS}`,
              );
              return;
            }
            setDateRange({ from, to });
          }}
        />
      </div>
      <div className="">
        <ActionButtons />
      </div>
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
}
