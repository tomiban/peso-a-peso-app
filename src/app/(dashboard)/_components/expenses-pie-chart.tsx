'use client';

import { UserSettings } from '@prisma/client';
import { Loader2, ShoppingBag } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { CategoryStatsResponse } from '@/app/api/stats/categories/route';
import { Card } from '@/components/ui/card';
import { DateToUTCDate, GetFormattedForCurrency } from '@/helpers/helpers';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

type Props = {
  userSettings: UserSettings;
  from: Date;
  to: Date;
};

type ProcessedData = {
  name: string;
  value: number;
};

export const ExpensesPieChart = ({ userSettings, from, to }: Props) => {
  const [stats, setStats] = useState<ProcessedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CategoryStatsResponse = await response.json();

        if ('success' in data && data.success) {
          // Procesar los datos para el formato que necesita el PieChart
          const processedData = data.stats.map(stat => ({
            name: stat.category.name,
            value: stat._sum.amount || 0,
          }));

          setStats(processedData);
        } else {
          setError('error');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [from, to]);

  const formatter = useMemo(() => {
    return GetFormattedForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  if (loading) {
    return (
      <Card className="glass-card flex h-full items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin sm:h-12 sm:w-12" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card h-full p-4 sm:p-6">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (stats.length === 0) {
    return (
      <Card className="glass-card h-full p-4 sm:p-6">
        No hay gastos registrados
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Distribución de Gastos</h3>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              label={({ name, value }) =>
                `${name} (${formatter.format(value)})`
              }
            >
              {stats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              formatter={(value: number) => [formatter.format(value), 'Monto']}
            />
            <Legend
              formatter={value => value}
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
