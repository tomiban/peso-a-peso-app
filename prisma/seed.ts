import { TipoCategoria, TipoCuenta } from '@prisma/client';

import prisma from '@/lib/db';

async function main() {
  // Limpiar la base de datos
  await prisma.transaction.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.paymentReminder.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.currency.deleteMany();

  // Crear monedas básicas
  const currencies = await Promise.all([
    prisma.currency.create({
      data: {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      },
    }),
    prisma.currency.create({
      data: {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
      },
    }),
    prisma.currency.create({
      data: {
        code: 'ARS',
        name: 'Peso Argentino',
        symbol: '$',
      },
    }),
  ]);

  // Usuario de ejemplo
  const user = await prisma.user.create({
    data: {
      email: 'usuario@ejemplo.com',
      name: 'Usuario Demo',
      currencyId: currencies[2].id, // USD como moneda predeterminada
      password: 'password',
    },
  });

  // Categorías predeterminadas de gastos
  const gastosCategorias = [
    { name: 'Alimentación', icon: '🍽️', color: '#FF5733' },
    { name: 'Transporte', icon: '🚗', color: '#33FF57' },
    { name: 'Vivienda', icon: '🏠', color: '#3357FF' },
    { name: 'Servicios', icon: '📱', color: '#FF33F6' },
    { name: 'Entretenimiento', icon: '🎮', color: '#33FFF6' },
    { name: 'Salud', icon: '⚕️', color: '#F6FF33' },
  ];

  // Categorías predeterminadas de ingresos
  const ingresosCategorias = [
    { name: 'Salario', icon: '💰', color: '#33FF57' },
    { name: 'Inversiones', icon: '📈', color: '#5733FF' },
    { name: 'Ventas', icon: '🏷️', color: '#FF5733' },
    { name: 'Regalos', icon: '🎁', color: '#33FFF6' },
  ];

  // Crear categorías
  for (const cat of gastosCategorias) {
    await prisma.category.create({
      data: {
        ...cat,
        type: TipoCategoria.GASTO,
        userId: user.id,
      },
    });
  }

  for (const cat of ingresosCategorias) {
    await prisma.category.create({
      data: {
        ...cat,
        type: TipoCategoria.INGRESO,
        userId: user.id,
      },
    });
  }

  // Crear cuentas de ejemplo
  const cuentas = [
    {
      name: 'Efectivo',
      type: 'EFECTIVO',
      currentBalance: 1000,
    },
    {
      name: 'Cuenta Bancaria',
      type: 'CUENTA_BANCO',
      currentBalance: 5000,
    },
    {
      name: 'Tarjeta de Crédito',
      type: 'TARJETA_CREDITO',
      currentBalance: 0,
    },
  ];

  for (const cuenta of cuentas) {
    await prisma.account.create({
      data: {
        ...cuenta,
        userId: user.id,
        name: cuenta.name,
        type: cuenta.type as TipoCuenta,
        currencyId: currencies[0].id,
        currentBalance: cuenta.currentBalance,
      },
    });
  }

  // Crear meta de ahorro de ejemplo
  await prisma.savingsGoal.create({
    data: {
      userId: user.id,
      name: 'Vacaciones',
      targetAmount: 5000,
      currentAmount: 1000,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  });

  // Crear recordatorio de pago de ejemplo
  await prisma.paymentReminder.create({
    data: {
      userId: user.id,
      title: 'Pago de Renta',
      amount: 800,
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      frequency: 'MENSUAL',
    },
  });

  console.log('Base de datos poblada con datos de ejemplo!');
}

main()
  .catch(error => {
    console.error(error);
    throw error;
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .finally(async () => {
    await prisma.$disconnect();
  });
