import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Skeleton } from './ui/skeleton';

// Componente que muestra un esqueleto de carga o el contenido real
export default function SkeletonWrapper({
  children, // Contenido a mostrar
  isLoading, // Si está cargando
  fullWidth = true, // Si ocupa todo el ancho disponible
}: {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}) {
  // Si no está cargando, muestra el contenido normal
  if (!isLoading) {
    return <>{children}</>;
  }

  // Si está cargando, muestra un esqueleto del mismo tamaño
  return (
    <Skeleton className={cn(fullWidth && 'w-full')}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
