import SideBar from '@/components/side-nav-bar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBar />
      <div className="mx-auto">{children}</div>
    </SidebarProvider>
  );
}
