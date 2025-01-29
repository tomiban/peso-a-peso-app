import { type User } from 'next-auth';

import SideBar from '@/components/side-nav-bar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';

import Loading from '../loading';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as User;

  if (!session?.user) {
    return <Loading />;
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SideBar user={user} />
        <main className="flex-1 px-4">
          <div className="container">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
