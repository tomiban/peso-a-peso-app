# Peso a Peso — gestor de finanzas personales

Aplicación web para registrar ingresos y egresos, agruparlos por categoría y seguir el balance
mensual y anual. Cada usuario ve solo sus datos, con autenticación propia y dashboards con
filtros por período.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components) + TypeScript |
| UI | Tailwind CSS + shadcn/ui (Radix), Recharts, sonner |
| Datos | PostgreSQL con Prisma ORM |
| Sesión | NextAuth v5 (Auth.js): credenciales con bcrypt y Google opcional |
| Formularios y estado | React Hook Form + Zod, Zustand |

## Puesta en marcha

Requisitos: Node 20+ y una base PostgreSQL accesible.

```bash
npm ci
cp .env.example .env.local   # completá DATABASE_URL, NEXTAUTH_URL y AUTH_SECRET
npx prisma migrate deploy    # crea el esquema
npm run dev
```

La app queda en `http://localhost:3000`. Las rutas protegidas redirigen a la pantalla de login
(`/`), y desde ahí se puede crear una cuenta en `/register`.

## Variables de entorno

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Conexión a PostgreSQL que usa Prisma (en Neon, la pooled) |
| `DATABASE_URL_UNPOOLED` | Recomendada | Conexión directa para migraciones (`directUrl`) |
| `NEXTAUTH_URL` | Sí | URL pública de la app, usada para construir los callbacks de sesión |
| `AUTH_SECRET` | Sí | Firma de los JWT de sesión (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | No | Login con Google; si faltan, el botón no se muestra |

## Base de datos en Neon

El repositorio está linkeado con la CLI de Neon (archivo `.neon`, config en `neon.ts`) al
proyecto `winter-field-82057025`, branch `production`. `neon env pull` escribe en `.env.local`:

| Variable | Para qué |
| --- | --- |
| `DATABASE_URL` | Conexión **pooled** (host con `-pooler`); es la que usa la app en runtime |
| `DATABASE_URL_UNPOOLED` | Conexión **directa**; es la que usan las migraciones vía `directUrl` |
| `NEON_BRANCH` | Branch activa según la CLI |

`prisma/schema.prisma` declara `directUrl`, así que `prisma migrate` va por la conexión directa
mientras la app sigue usando la pooled. Migrar a través de PgBouncer falla con errores que no
nombran el pooling (`prepared statement "s0" already exists`).

```bash
neon env pull               # refresca las variables de la branch production
npx prisma migrate deploy   # aplica migraciones por la conexión directa
```

En Vercel (Fluid compute) la recomendación de las skills de Neon es `node-postgres` con
`attachDatabasePool` de `@vercel/functions`; hoy la app usa el engine TCP de Prisma contra la
URL pooled, que es suficiente para el volumen de esta demo.

## Deploy

1. Creá una base PostgreSQL administrada (Neon, Supabase o RDS), o linkeá este repo con
   `neon init` sobre un proyecto existente.
2. Importá el repositorio en Vercel y definí `DATABASE_URL`, `NEXTAUTH_URL` (el dominio de
   producción) y `AUTH_SECRET` en *Settings → Environment Variables*.
3. Aplicá las migraciones una vez, desde tu máquina y con la URL directa de la base:

   ```bash
   DATABASE_URL_UNPOOLED="postgresql://…" npx prisma migrate deploy
   ```

4. Deploy. El `next build` no necesita la base, pero sí las variables para hornerizar la
   configuración del cliente.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `src/app/` | Rutas del App Router: `/`, `/login`, `/register`, `/wizard`, `/transactions`, `/manage` y `/api/*` |
| `src/lib/` | Configuración de Prisma, NextAuth y utilidades |
| `src/components/` | Componentes de UI y de dominio |
| `src/schema/` | Esquemas de validación con Zod |
| `prisma/schema.prisma` | Modelo de datos |
| `prisma/migrations/` | Migraciones versionadas |

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run type-check` | Chequeo de tipos |
| `npm run format` | Prettier |
| `npm run prisma:deploy` | Migraciones + generación del cliente |
| `npm run prisma:migrate` | Crea una migración nueva |
| `npm run prisma:push` | Sincroniza el esquema sin migración (solo desarrollo) |
| `npm run prisma:studio` | Explorador de datos |

## Roadmap

- Cotizaciones de moneda con histórico propio.
- Importación de movimientos desde billeteras virtuales (Mercado Pago, Ualá).
- Exportación e importación de datos en CSV.
- Multi-cuenta y filtros avanzados por servicio y gasto recurrente.

## Licencia

GPL-3.0. Ver [LICENSE](LICENSE).
