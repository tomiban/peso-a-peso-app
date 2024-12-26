import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Resumen</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por categoría</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            <div className="text-center">
              <p>No hay datos para el período seleccionado</p>
              <p>
                Intenta seleccionar un período diferente o agregar nuevos
                ingresos
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos por categoría</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            <div className="text-center">
              <p>No hay datos para el período seleccionado</p>
              <p>
                Intenta seleccionar un período diferente o agregar nuevos gastos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Historial</h2>
        <Card>
          <CardContent className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            <div className="text-center">
              <p>No hay datos para el período seleccionado</p>
              <p>
                Intenta seleccionar un período diferente o agregar nuevas
                transacciones
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
