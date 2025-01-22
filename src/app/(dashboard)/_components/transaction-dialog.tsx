import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CreateTransactionSchemaType } from '@/schema/transaction';

import { CategoryPicker } from './category-picker';

interface Props {
  trigger: ReactNode;
  type: TransactionType;
  onSubmit?: (data: CreateTransactionSchemaType) => void;
}

export function TransactionDialog({ trigger, type, onSubmit }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    defaultValues: {
      type,
      date: new Date(),
      amount: 0,
      description: '',
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    onSubmit?.(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center">
            Nueva transacción de
            <span
              className={cn(
                'mx-2 font-medium',
                type === 'INGRESO' ? 'text-green-500' : 'text-red-500',
              )}
            >
              {type === 'INGRESO' ? 'Ingreso' : 'Egreso'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Salario mensual"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="h-10"
                      {...field}
                      value={field.value.toISOString().slice(0, 16)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <CategoryPicker type={type} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="secondary"
                type="submit"
                className={cn('w-full text-white')}
              >
                Guardar {type === 'INGRESO' ? 'Ingreso' : 'Egreso'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
