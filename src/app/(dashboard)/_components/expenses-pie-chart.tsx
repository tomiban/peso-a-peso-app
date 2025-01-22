'use client';
import { ShoppingBag } from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { Card } from '@/components/ui/card';

const data = [
  { name: 'Alimentación', value: 500 },
  { name: 'Transporte', value: 300 },
  { name: 'Entretenimiento', value: 200 },
  { name: 'Servicios', value: 400 },
  { name: 'Otros', value: 150 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const ExpensesPieChart = () => {
  return (
    <Card className="glass-card p-6 animate-in">
      <div className="mb-6 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Distribución de Gastos</h3>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--primary))',
                accentColor: 'hsl(var(--secondary))',
                border: '1px solid hsl(var(--border))',
              }}
              formatter={(value: number) => [`$${value}`, 'Monto']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
