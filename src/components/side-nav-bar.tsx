'use client';

import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSignIcon,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Settings,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';
import { type User } from 'next-auth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { logout } from '@/lib/actions';
import { cn } from '@/lib/utils';

import Logo from './logo';
import SideBarItem from './sidebar-item';

export type Props = {
  user: User;
};

const SideBar = ({ user }: Props) => {
  const { open, toggleSidebar } = useSidebar();

  const menuItems = [
    { label: 'Inicio', icon: LayoutDashboard, link: '/' },
    { label: 'Transacciones', icon: CreditCard, link: '/transactions' },
    { label: 'Ahorros', icon: PiggyBank, link: '/savings' },
    { label: 'Inversiones', icon: DollarSignIcon, link: '/investment' },
    { label: 'Administración', icon: Settings, link: '/settings' },
  ];

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className={cn(
          'absolute -right-8 top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-md',
          open && '-right-3',
        )}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <Sidebar>
        <SidebarHeader className="p-4">
          <Logo />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(item => (
                  <SideBarItem key={item.label} {...item} isOpen={open} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-3">
          <SidebarSeparator className="mb-3" />
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full rounded-lg px-3 py-6 transition hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-9 w-9 items-center justify-center rounded-full">
                        {user.image ? (
                          <Image
                            width={36}
                            height={36}
                            src={user.image}
                            alt={user.name || ''}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <UserRound className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {user.name}
                        </span>
                        <span className="max-w-[150px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem
                    onClick={async () => await logout()}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default SideBar;
