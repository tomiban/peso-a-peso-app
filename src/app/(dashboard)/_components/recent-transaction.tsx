'use client';
import { Transaction } from '@prisma/client';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Card } from '@/components/ui/card';
import { useTransactions } from '@/contexts/transaction-context';
import { formatDate } from '@/lib/date-format';
import { cn } from '@/lib/utils';

export const RecentTransactions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const { refreshKey } = useTransactions();
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transactions/monthly?limit=5');

      if (!response.ok) throw new Error('Error al obtener transacciones');

      const transactions = await response.json();

      if (transactions.success) {
        console.log(transactions);
        setRecentTransactions(transactions.data);
      } else {
        throw new Error(transactions.error || 'Error desconocido');
      }
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshKey]);

  return (
    <SkeletonWrapper isLoading={isLoading} fullWidth={true}>
      <Card className="glass-card h-full min-h-[400px] p-4 animate-in sm:p-6">
        <div className="mb-4 flex items-center gap-2 sm:mb-6">
          <TrendingUpDown className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          <h3 className="text-sm font-semibold sm:text-base">
            Transacciones Recientes
          </h3>
        </div>
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : recentTransactions.length === 0 ? (
          <p className="text-muted-foreground">
            No hay transacciones recientes
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50 sm:p-3"
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8',
                      transaction.type === 'INCOME'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600',
                    )}
                  >
                    {transaction.type === 'INCOME' ? (
                      <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mr-10 w-32 truncate text-sm font-medium sm:w-48 md:w-64">
                      {transaction.note ||
                        transaction.category ||
                        'Transacción'}
                    </p>
                    <p className="w-24 truncate text-xs text-muted-foreground sm:w-32">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    'ml-2 w-24 whitespace-nowrap text-start text-sm font-medium sm:w-32',
                    transaction.type === 'INCOME'
                      ? 'text-green-500'
                      : 'text-red-500',
                  )}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'} $
                  {transaction.amount.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};
