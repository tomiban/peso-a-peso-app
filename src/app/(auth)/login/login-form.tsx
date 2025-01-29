'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/actions';
import { LoginSchema } from '@/schema/auth';

interface LoginError {
  error: string;
  message?: string;
  status?: number;
}
interface LoginSuccess {
  success: true;
}

interface LoginError {
  error: string;
}

export type LoginResponse = LoginSuccess | LoginError;

function getErrorMessage(error: string): string {
  switch (error) {
    case 'Credenciales incorrectas': {
      return 'El correo o la contraseña son incorrectos';
    }
    case 'Error: Credenciales incorrectas': {
      return 'El correo o la contraseña son incorrectos';
    }
    case 'CallbackRouteError': {
      return 'El correo o la contraseña son incorrectos';
    }
    default: {
      return 'Ocurrió un error al iniciar sesión. Por favor intenta nuevamente';
    }
  }
}

export const LoginForm = () => {
  const [error, setError] = useState<LoginError | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError(null);
    startTransition(async () => {
      try {
        const response = (await login(values)) as LoginResponse;

        if ('error' in response) {
          setError({
            error: 'Error de autenticación',
            message: getErrorMessage(response.error),
          });
          return;
        }

        router.push('/');
      } catch {
        setError({
          error: 'Error del sistema',
          message:
            'No pudimos conectarnos al servidor. Por favor intenta más tarde.',
          status: 500,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-semibold">{error.error}</div>
              <div className="text-sm">{error.message}</div>
              {error.status && error.status >= 500 && (
                <div className="mt-1 text-xs">
                  Código de error: {error.status}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="usuario@email.com"
                  {...field}
                  type="email"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  {...field}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </Form>
  );
};
