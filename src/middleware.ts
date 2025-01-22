import NextAuth from 'next-auth';

import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from '@/lib/routes';

import { authConfig } from './lib/auth.config';

// Inicializa NextAuth con la configuración proporcionada
const { auth } = NextAuth(authConfig);

export default auth(request => {
  const { nextUrl } = request;
  // Verifica si el usuario está autenticado
  const isAuthenticated = !!request.auth;
  // Comprueba si la ruta actual es pública
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // Si el usuario está autenticado y trata de acceder a una ruta pública redirige al destino por defecto
  if (isPublicRoute && isAuthenticated) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }


  // Si el usuario NO está autenticado y trata de acceder a una ruta protegida, redirige a la página de login
  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(ROOT, nextUrl));
  }

});

// Configuración del matcher para el middleware
export const config = {
  // Aplica el middleware a todas las rutas excepto:
  // - api routes (/api/*)
  // - archivos estáticos (_next/static/*)
  // - archivos de imagen (_next/image/*)
  // - favicon.ico
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
