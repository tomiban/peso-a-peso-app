'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CircleOff, PlusCircle } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTransactions } from '@/contexts/transaction-context';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/category';

import { createCategory } from '../_actions/categories';

interface Props {
  type: TransactionType;
  onSuccess?: (category: Category) => void;
  onCreated?: () => void;
  trigger?: ReactNode;
  className?: string;
}

export function CreateCategoryDialog({
  type,
  onCreated,
  onSuccess,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { triggerRefresh } = useTransactions();

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
      icon: '',
      name: '',
    },
  });

  const onSubmit = useCallback(
    async (data: CreateCategorySchemaType) => {
      setIsSubmitting(true);
      const toastId = toast.loading('Creando categoría...');
      try {
        const result = await createCategory(data);
        if (result) {
          toast.success(`Categoría ${result.name} creada exitosamente`, {
            id: toastId,
          });
          form.reset();

          setTimeout(() => {
            setOpen(false);
            onSuccess?.(result);
            onCreated?.();
          }, 1000);
          triggerRefresh();
        }
      } catch (error) {
        console.error('Error al crear categoría:', error);
        toast.error('Error al crear la categoría', {
          id: toastId,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onSuccess, onCreated, triggerRefresh],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            className ?? 'w-full',
            'justify-start gap-2 rounded-sm',
          )}
        >
          <PlusCircle className="h-4 w-4" />
          Crear nueva categoría
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Nueva categoría de
            <span
              className={cn(
                'm-1',
                type === 'INCOME' ? 'text-green-500' : 'text-red-500',
              )}
            >
              {type === 'INCOME' ? 'Ingreso' : 'Egreso'}
            </span>
          </DialogTitle>
          <DialogDescription>
            Las categorías son utilizadas para agrupar tus transacciones
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Salario, Alquiler..."
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícono</FormLabel>
                  <FormControl>
                    <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-24 w-full"
                          type="button"
                        >
                          {field.value ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-4xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Haz clic para cambiar
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-12 w-12 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                Haz clic para seleccionar
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        side="right"
                        align="start"
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                            setEmojiOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
