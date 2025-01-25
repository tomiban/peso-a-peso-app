'use client';
import { PlusCircle } from 'lucide-react';

import { TransactionDialog } from '@/app/(dashboard)/_components/transaction-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ActionButtons = () => {
  const { toast } = useToast();

  const handleAddIncome = () => {
    toast({
      title: 'Coming Soon',
      description: 'Add income functionality will be available soon!',
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <TransactionDialog
        trigger={
          <Button
            onClick={handleAddIncome}
            className="w-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Ingreso
          </Button>
        }
        type="INCOME"
      />

      <TransactionDialog
        trigger={
          <Button
            onClick={handleAddIncome}
            className="w-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Gasto
          </Button>
        }
        type="EXPENSE"
      />
    </div>
  );
};
