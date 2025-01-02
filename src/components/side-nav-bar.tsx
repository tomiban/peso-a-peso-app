import {
  CreditCard,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Settings,
  UserRound,
  Wallet,
} from 'lucide-react';
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
  SidebarSeparator,
} from '@/components/ui/sidebar';

const SideBar = () => {
  //const { toggleSidebar } = useSidebar();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      url: '/',
    },
    {
      title: 'Transacciones',
      icon: CreditCard,
      url: '/transacciones',
    },
    {
      title: 'Presupuestos',
      icon: Wallet,
      url: '/presupuestos',
    },
    {
      title: 'Ahorros',
      icon: PiggyBank,
      url: '/ahorros',
    },
    {
      title: 'Análisis',
      icon: LineChart,
      url: '/analisis',
    },
    {
      title: 'Configuración',
      icon: Settings,
      url: '/configuracion',
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-lg font-semibold text-transparent">
          PxP Gestión Financiera
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="transition-colors duration-200"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
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
      <SidebarFooter className="p-4">
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
  );
};

export default SideBar;
