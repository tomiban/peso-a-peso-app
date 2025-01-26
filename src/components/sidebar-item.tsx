import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { buttonVariants } from './ui/button';

export default function SideBarItem({
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
