import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn('glass-card p-5 animate-in', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-green-500' : 'text-red-500',
            )}
          >
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            vs último mes
          </span>
        </div>
      )}
    </Card>
  );
};
