import { UserRound } from 'lucide-react';
import Image from 'next/image';

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function SideBarFooterContent({ name, email, image }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        {image ? (
          <Image
            width={40}
            height={40}
            src={image}
            alt={name || ''}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <UserRound className="h-8 w-8 text-primary" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="max-w-[150px] truncate text-xs text-muted-foreground">
          {email}
        </span>
      </div>
    </div>
  );
}
