import { ThemeProvider } from 'next-themes';
import React from 'react';

import { SidebarProvider } from '../ui/sidebar';
import { TooltipProvider } from '../ui/tooltip';

function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <SidebarProvider> {children}</SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default RootProviders;
