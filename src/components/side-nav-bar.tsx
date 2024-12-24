'use client';

import { LayoutDashboard, Receipt, Settings } from 'lucide-react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import Logo from './logo';
import { UserNav } from './user-nav';

const SideBar = () => {
  const { toggleSidebar } = useSidebar();

  const navItems = [
    {
      title: 'Inicio',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Transacciones',
      href: '/dashboard/transactions',
      icon: Receipt,
    },
    {
      title: 'Administración',
      href: '/dashboard/manage',
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <div className="relative">
        {' '}
        <div className="absolute -right-8 top-5 z-50">
          <SidebarTrigger onClick={toggleSidebar} className="shadow-md" />
        </div>
        <SidebarHeader className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative w-12 translate-y-[-2px]">
                <Logo />
              </div>
            </div>
          </div>
        </SidebarHeader>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'w-full justify-start gap-2',
                        'hover:bg-accent hover:text-accent-foreground',
                        'transition-colors duration-200',
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
