import Link from 'next/link';
import { redirect } from 'next/navigation';

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

import RegisterForm from './register-form';

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect('/');

  return (
    <div className="container flex items-center justify-center">
      <Card className="glass-card mx-auto w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Regístrate para acceder a todo el contenido
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <RegisterForm />
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button asChild variant="link" className="h-auto">
            <Link href="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
