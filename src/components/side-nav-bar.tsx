'use client';

import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LineChart,
  LogOut,
  type LucideIcon,
  PiggyBank,
  Settings,
  UserRound,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { signOut } from '@/lib/auth';
import { cn } from '@/lib/utils';

import Logo from './logo';
import { buttonVariants } from './ui/button';

const SideBar = () => {
  const { open, toggleSidebar } = useSidebar();
  const { data, status } = useSession();
  const { user } = data || {};
  const isLoading = status === 'loading';

  const menuItems = [
    { label: 'Inicio', icon: LayoutDashboard, link: '/' },
    { label: 'Transacciones', icon: CreditCard, link: '/transactions' },
    { label: 'Presupuestos', icon: Wallet, link: '/budgets' },
    { label: 'Ahorros', icon: PiggyBank, link: '/savings' },
    { label: 'Análisis', icon: LineChart, link: '/analytics' },
    { label: 'Configuración', icon: Settings, link: '/settings' },
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
            <SidebarMenuItem>
              <SkeletonWrapper isLoading={isLoading}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {user?.image ? (
                            <Image
                              width={40}
                              height={40}
                              src={user?.image}
                              alt={user?.name || ''}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <UserRound className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user?.name}
                          </span>
                          <span className="max-w-[150px] truncate text-xs text-muted-foreground">
                            {user?.email}
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
                      className="cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SkeletonWrapper>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

function SideBarItem({
  link,
  icon: Icon,
  label,
  isOpen,
}: {
  link: string;
  icon: LucideIcon;
  label: string;
  isOpen: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-full justify-start gap-2 text-base text-muted-foreground hover:text-foreground',
          isActive && 'text-foreground',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span
          className={cn('transition-all duration-200', !isOpen && 'hidden')}
        >
          {label}
        </span>
      </Link>
    </div>
  );
}

export default SideBar;
