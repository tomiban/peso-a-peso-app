'use client';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';

const LogOut = () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex justify-center">
      <Button variant="destructive" onClick={handleSignOut}>
        Cerrar Sesión
      </Button>
    </div>
  );
};

export { LogOut };
