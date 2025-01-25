import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/schema/transaction';

import { createTransaction } from '../_actions/transaction';
import { CategoryPicker } from './category-picker';

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

export function TransactionDialog({ trigger, type }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      amount: 0,
      date: new Date(),
    },
  });

  const onSubmit = useCallback(
    async (data: CreateTransactionSchemaType) => {
      const toastId = toast.loading('Creando transacción...');
      try {
        // TODO: Implementar server action para crear transacción
        console.log(data);
        const result = await createTransaction(data);
        if (result) {
          toast.success('Transacción creada exitosamente', {
            id: toastId,
          });
          form.reset();
          setOpen(false);
        }
      } catch (error) {
        console.error('Error al crear transacción:', error);
        toast.error('Error al crear la transacción', {
          id: toastId,
        });
      }
    },
    [form, setOpen],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        setOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Nueva transacción de
            <span
              className={cn(
                'mx-2 font-medium',
                type === 'INCOME' ? 'text-green-500' : 'text-red-500',
              )}
            >
              {type === 'INCOME' ? 'Ingreso' : 'Egreso'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="note"
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
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={data => {
                        field.onChange(
                          data.target.value
                            ? new Date(data.target.value)
                            : new Date(),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <CategoryPicker
                      type={type}
                      onChange={category => field.onChange(category?.id)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
