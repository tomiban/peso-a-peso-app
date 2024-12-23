# Scripts del Proyecto

## Desarrollo

- `dev`: Inicia servidor de desarrollo Next.js con Turbopack
- `build`: Crea versión de producción
- `start`: Inicia servidor de producción
- `type-check`: Verifica tipos TypeScript

## Código

- `lint`: Detecta problemas con ESLint
- `format`: Formatea código con Prettier
- `lint:fix`: Corrige problemas de ESLint automáticamente
- `prepare`: Instala hooks de Husky

## Prisma

### Migraciones

- `prisma:migrate`: Crea migración (`npm run prisma:migrate nombre`)
- `prisma:deploy`: Aplica migraciones en producción
- `prisma:push`: Actualiza base de datos sin migraciones

### Desarrollo

- `prisma:studio`: Abre interfaz de base de datos
- `prisma:seed`: Carga datos iniciales de prueba
- `prisma:setup`: Genera cliente, aplica migraciones y actualiza esquema

### Reset

- `prisma:wipe`: Reinicia base de datos completamente
- `prisma:reset-dev`: Limpia DB, carga seeds e inicia desarrollo

Analizaré el modelo de datos para sugerir los endpoints necesarios, organizándolos por funcionalidad.

### Usuarios y Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /users/me` - Obtener perfil del usuario actual
- `PUT /users/me` - Actualizar perfil
- `PUT /users/preferences` - Actualizar preferencias (idioma, notificaciones)

### Cuentas
- `GET /accounts` - Listar cuentas del usuario
- `POST /accounts` - Crear nueva cuenta
- `GET /accounts/{id}` - Obtener detalles de una cuenta
- `PUT /accounts/{id}` - Actualizar cuenta
- `DELETE /accounts/{id}` - Desactivar cuenta
- `GET /accounts/{id}/balance-history` - Historial de balance

### Monedas disponibles
- `GET /currencies` - Listar monedas disponibles

### Categorías
- `GET /categories` - Listar categorías
- `POST /categories` - Crear categoría
- `PUT /categories/{id}` - Actualizar categoría
- `DELETE /categories/{id}` - Eliminar categoría
- `GET /categories/{id}/transactions` - Transacciones por categoría
- `GET /categories/expenses` - Listar solo categorías de gastos
- `GET /categories/income` - Listar solo categorías de ingresos

### Transacciones
- `GET /transactions` - Listar transacciones (con filtros)
- `POST /transactions` - Crear transacción
- `PUT /transactions/{id}` - Actualizar transacción
- `DELETE /transactions/{id}` - Eliminar transacción
- `GET /transactions/recurring` - Listar transacciones recurrentes
- `POST /transactions/{id}/attachments` - Subir comprobantes

### Transferencias
- `GET /transfers` - Listar transferencias
- `POST /transfers` - Crear transferencia
- `GET /transfers/{id}` - Obtener detalles de transferencia
- `DELETE /transfers/{id}` - Eliminar transferencia

### Metas de Ahorro
- `GET /savings-goals` - Listar metas de ahorro
- `POST /savings-goals` - Crear meta
- `PUT /savings-goals/{id}` - Actualizar meta
- `DELETE /savings-goals/{id}` - Eliminar meta
- `PUT /savings-goals/{id}/progress` - Actualizar progreso

### Recordatorios de Pago
- `GET /payment-reminders` - Listar recordatorios
- `POST /payment-reminders` - Crear recordatorio
- `PUT /payment-reminders/{id}` - Actualizar recordatorio
- `DELETE /payment-reminders/{id}` - Eliminar recordatorio
- `PUT /payment-reminders/{id}/status` - Actualizar estado

### Estadísticas e Informes
- `GET /statistics/monthly` - Resumen mensual
- `GET /statistics/yearly` - Resumen anual
- `GET /statistics/categories` - Gastos por categoría
- `GET /statistics/trends` - Tendencias de gastos/ingresos


