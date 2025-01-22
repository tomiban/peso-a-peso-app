import { ArrowDownIcon, ArrowUpIcon, TrendingUpDown } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const transactions = [
  {
    id: 1,
    description: 'Compra Shopping',
    amount: -82.55,
    date: '2024-04-10',
  },
  { id: 2, description: 'Deposito Salario', amount: 2500, date: '2024-04-09' },
  {
    id: 3,
    description: 'Netflix',
    amount: -15.99,
    date: '2024-04-08',
  },
  {
    id: 4,
    description: 'Pago Freelance',
    amount: 450,
    date: '2024-04-07',
  },
];

export const RecentTransactions = () => {
  return (
    <Card className="glass-card h-full p-6 animate-in">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUpDown className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Transacciones Recientes</h3>
      </div>

      <div className="space-y-4">
        {transactions.map(transaction => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  transaction.amount > 0
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600',
                )}
              >
                {transaction.amount > 0 ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date}
                </p>
              </div>
            </div>
            <p
              className={cn(
                'font-medium',
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600',
              )}
            >
              {transaction.amount > 0 ? '+' : ''}
              {transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
