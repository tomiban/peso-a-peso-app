import React from 'react';

import Logo from '@/components/logo';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex h-14 w-full items-center justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </main>
  );
}
