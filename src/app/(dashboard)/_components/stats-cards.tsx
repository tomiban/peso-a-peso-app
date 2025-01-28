'use client';
import { UserSettings } from '@prisma/client';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import SkeletonWrapper from '@/components/skeleton-wrapper';
import { useTransactions } from '@/contexts/transaction-context';
import { DateToUTCDate, GetFormattedForCurrency } from '@/helpers/helpers';

import { StatCard } from './stat-card';

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

interface StatsData {
  expense: number;
  income: number;
}

interface APIResponse {
  success: boolean;
  status: number;
  data: StatsData;
}

const StatsCards = ({ from, to, userSettings }: Props) => {
  const [stats, setStats] = useState<StatsData>({ expense: 0, income: 0 });
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useTransactions();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: APIResponse = await response.json();
      setStats(result.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [from, to]); // Solo depende de from y to

  // Efecto para la carga inicial y cuando cambian las fechas o configuración
  useEffect(() => {
    fetchStats();
  }, [fetchStats, userSettings]);

  // Efecto separado para manejar el refresh
  useEffect(() => {
    fetchStats();
  }, [refreshKey, fetchStats]);

  const formatter = useMemo(
    () => GetFormattedForCurrency(userSettings.currency),
    [userSettings.currency],
  );

  const income = stats.income || 0;
  const expense = stats.expense || 0;
  const balance = income - expense;

  return (
    <>
      <SkeletonWrapper isLoading={loading} fullWidth={true}>
        <StatCard
          title="Ingresos"
          icon={<TrendingUp />}
          value={income}
          formatter={formatter}
          className="bg-emerald-400/10 text-green-500"
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={loading} fullWidth={true}>
        <StatCard
          title="Egresos"
          icon={<TrendingDown />}
          value={expense}
          formatter={formatter}
          className="bg-red-400/10 text-red-500"
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={loading} fullWidth={true}>
        <StatCard
          title="Balance"
          icon={<Wallet />}
          value={balance}
          formatter={formatter}
          className="text-primary"
        />
      </SkeletonWrapper>
    </>
  );
};

export default StatsCards;
