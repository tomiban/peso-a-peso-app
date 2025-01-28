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
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import SkeletonWrapper from '@/components/skeleton-wrapper';
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
import { SideBarFooterContent } from './sidebar-footer-content';
import SideBarItem from './sidebar-item';

const SideBar = () => {
  const { open, toggleSidebar } = useSidebar();
  const { data, status } = useSession();
  const user = data?.user;

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

        <SidebarFooter className={cn('p-4')}>
          <SidebarSeparator className="mb-4" />
          <SidebarMenu>
            <SkeletonWrapper isLoading={status === 'loading'}>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full py-6">
                      <SideBarFooterContent {...user} />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem
                      onClick={async () => await logout()}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SkeletonWrapper>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default SideBar;
