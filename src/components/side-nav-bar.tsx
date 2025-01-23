'use client';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LineChart,
  type LucideIcon,
  PiggyBank,
  Settings,
  UserRound,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import Logo from './logo';
import { buttonVariants } from './ui/button';

const SideBar = () => {
  const { open, toggleSidebar } = useSidebar();

  const menuItems = [
    { title: 'Inicio', icon: LayoutDashboard, url: '/' },
    { title: 'Transacciones', icon: CreditCard, url: '/transactions' },
    { title: 'Presupuestos', icon: Wallet, url: '/budgets' },
    { title: 'Ahorros', icon: PiggyBank, url: '/savings' },
    { title: 'Análisis', icon: LineChart, url: '/analytics' },
    { title: 'Configuración', icon: Settings, url: '/settings' },
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
                {menuItems.map(item =>
                  SideBarItem({
                    link: item.url,
                    icon: item.icon,
                    label: item.title,
                  }),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className={cn('p-4', !open && 'hidden')}>
          <SidebarSeparator className="mb-4" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Tomás Banchio</span>
              <span className="text-xs text-muted-foreground">
                tbanchio15@gmail.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

function SideBarItem({
  link,
  icon: Icon,
  label,
}: {
  link: string;
  icon: LucideIcon;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-full justify-start text-base text-muted-foreground hover:text-foreground',
          isActive && 'text-foreground',
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </div>
  );
}

export default SideBar;
