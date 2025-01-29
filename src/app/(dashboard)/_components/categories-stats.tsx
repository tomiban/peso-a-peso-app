/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { UserSettings } from '@prisma/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTransactions } from '@/contexts/transaction-context';
import { DateToUTCDate, GetFormattedForCurrency } from '@/helpers/helpers';
import { TransactionType } from '@/lib/types';

interface Props {
  userSettings: UserSettings;
}

function CategoriesStats({ userSettings }: Props) {
  const [stats, setStats] = useState<GetCategoriesStatsResponseType | null>(
    null,
  );
  const { refreshKey, dateRange } = useTransactions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      console.log(refreshKey);
      try {
        const response = await fetch(
          `/api/stats/categories?from=${DateToUTCDate(dateRange.from)}&to=${DateToUTCDate(dateRange.to)}`,
          {
            headers: {
              'Cache-Control': 'no-cache',
            },
          },
        );

        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        console.log(data);
        setStats(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [dateRange.from, dateRange.to, refreshKey]);

  const formatter = useMemo(() => {
    return GetFormattedForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isLoading}>
        <CategoriesCard
          formatter={formatter}
          type="INCOME"
          data={stats || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isLoading}>
        <CategoriesCard
          formatter={formatter}
          type="EXPENSE"
          data={stats || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType;
}) {
  const filteredData = data.filter(element => element.type === type);
  const total = filteredData.reduce(
    (accumulator, element) => accumulator + (Number(element._sum?.amount) || 0),
    0,
  );

  return (
    <Card className="glass-card col-span-2 h-80 w-full">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === 'INCOME' ? 'Ingresos' : 'Gastos'} por categoría
        </CardTitle>
      </CardHeader>

      <div className="flex w-full flex-wrap gap-2 md:flex-nowrap lg:col-span-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No hay datos para ese periodo
            <p className="text-sm text-muted-foreground">
              Seleccioná un período diferente o intentá agregar uno nuevo{' '}
              {type === 'INCOME' ? 'incomes' : 'expenses'}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map(item => {
                const amount = Number(item._sum.amount) || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === 'INCOME' ? 'bg-emerald-500' : 'bg-red-500'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
