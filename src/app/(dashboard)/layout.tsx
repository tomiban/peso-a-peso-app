import SideBar from '@/components/side-nav-bar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SideBar />
        <main className="flex-1 px-4">
          <div className="container">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
