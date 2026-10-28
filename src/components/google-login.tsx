'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Google } from '@/components/ui/google';
import { googleLogin } from '@/lib/actions';

import { Alert, AlertDescription } from './ui/alert';

export const GoogleLogin = ({ enabled }: { enabled: boolean }) => {
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  return (
    <div>
      <form
        action={async () => {
          setError(null);
          try {
            await googleLogin();
          } catch {
            setError('Error al iniciar sesión con Google');
          }
        }}
      >
        <Button className="glass-card w-full" variant="outline">
          <Google size={20} />
          Accede con Google
        </Button>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
