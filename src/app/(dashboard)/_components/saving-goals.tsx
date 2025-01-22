'use client';
import { Target } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const goals = [
  {
    name: 'Fondo de Emergencia',
    current: 5000,
    target: 10_000,
    color: 'bg-blue-500',
  },
  { name: 'Vacaciones', current: 2000, target: 3000, color: 'bg-green-500' },
];

export const SavingsGoal = () => {
  return (
    <Card className="glass-card p-6 animate-in">
      <div className="mb-6 flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Objetivos de Ahorro</h3>
      </div>
      <div className="space-y-6">
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{goal.name}</span>
                <span className="text-muted-foreground">
                  ${goal.current.toLocaleString()} / $
                  {goal.target.toLocaleString()}
                </span>
              </div>
              <Progress value={progress} className={cn('h-2', goal.color)} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
