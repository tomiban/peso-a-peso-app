import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Skeleton } from './ui/skeleton';

// Componente que muestra un esqueleto de carga o el contenido real
export default function SkeletonWrapper({
  children, // Contenido a mostrar
  isLoading, // Si está cargando
  fullWidth = true, // Si ocupa todo el ancho disponible
  className,
}: {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  // Si no está cargando, muestra el contenido normal
  if (!isLoading) {
    return <>{children}</>;
  }

  // Si está cargando, muestra un esqueleto del mismo tamaño
  return (
    <Skeleton
      className={cn(
        'animate-pulse bg-muted/50',
        fullWidth && 'w-full',
        className,
      )}
    >
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
