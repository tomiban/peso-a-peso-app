import Link from 'next/link';
import { redirect } from 'next/navigation';

import { GoogleLogin } from '@/components/google-login';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';

import { LoginForm } from './login-form';

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect('/');

  return (
    <div className="container flex items-center justify-center">
      <Card className="glass-card mx-auto w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Iniciar sesión
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <GoogleLogin />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-t-secondary/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground">
                O continua con tu email
              </span>
            </div>
          </div>

          <LoginForm />
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button asChild variant="link" className="h-auto">
            <Link href="/register">¿No tienes una cuenta? Regístrate</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
