'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleOff, PlusCircle } from 'lucide-react';
import { useState } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/category';

interface Props {
  type: TransactionType;
  onSuccess?: (data: CreateCategorySchemaType) => void;
}

export function CreateCategoryDialog({ type, onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      icon: '',
    },
  });

  const onSubmit = (data: CreateCategorySchemaType) => {
    onSuccess?.(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 rounded-none"
        >
          <PlusCircle className="h-4 w-4" />
          Crear nueva categoría
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Nueva categoría de
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
                    <Popover>
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
                                Click para cambiar
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-12 w-12 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                Click para seleccionar
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
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className={cn(
                  type === 'INGRESO'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600',
                )}
              >
                Crear categoría
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
