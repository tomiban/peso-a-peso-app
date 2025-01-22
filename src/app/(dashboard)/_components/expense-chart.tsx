'use client';
import { ChartColumnDecreasingIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Card } from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart';

// Datos de ejemplo
const data = [
  { name: 'Ene', amount: 100_000 },
  { name: 'Feb', amount: 300_000 },
  { name: 'Mar', amount: 200_000 },
  { name: 'Abr', amount: 278_000 },
  { name: 'May', amount: 189_000 },
  { name: 'Jun', amount: 23_900 },
];

// Componente Tooltip personalizado con tipos correctos
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="rounded-lg border border-border bg-background/95 p-3 shadow-lg">
        <p className="mb-1 font-medium">{label}</p>
        <p className="text-sm text-primary">
          Este año: ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
};

export const ExpenseChart = () => {
  return (
    <Card className="glass-card flex h-full flex-col p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-2">
        <ChartColumnDecreasingIcon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Tendencia de Gastos</h3>
      </div>

      <div className="min-h-[300px] w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              tickFormatter={value => `$${value}`}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
