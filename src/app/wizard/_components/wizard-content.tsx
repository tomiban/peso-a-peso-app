'use client';

import Link from 'next/link';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import CurrencySelector from './currency-selector';

function WizardContent({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl">
          ¡Bienvenido,{' '}
          <span className="font-bold">{name.toLocaleUpperCase()}! 💰</span>
        </h1>
        <h2 className="mt-4 text-lg text-muted-foreground">
          Configura tu moneda principal para gestionar tus finanzas
        </h2>
        <h3 className="mt-2 text-sm text-muted-foreground">
          Podrás personalizar esto y más opciones después en la configuración.
        </h3>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Selecciona tu Moneda</CardTitle>
          <CardDescription>
            Esta será la moneda predeterminada para tus transacciones,
            presupuestos y reportes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencySelector />
        </CardContent>
      </Card>

      <Button className="w-full" asChild>
        <Link href="/">Estoy listo para comenzar!</Link>
      </Button>

      <div className="flex justify-center pt-10">
        <Logo />
      </div>
    </div>
  );
}

export default WizardContent;
