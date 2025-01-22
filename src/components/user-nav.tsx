import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  Crown,
  LogOut,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-md p-3 hover:bg-neutral-800">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="TB" />
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span>shadcn</span>
            <span className="text-xs text-muted-foreground">m@example.com</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={0}
        alignOffset={0}
        className="mb-2 ml-3 w-56 space-y-1 rounded-md bg-neutral-900 shadow-lg"
      >
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">shadcn</p>
            <p className="text-xs text-muted-foreground">m@example.com</p>
          </div>
        </div>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-sm p-2 text-sm hover:bg-neutral-800">
          <Crown className="h-4 w-4" />
          Upgrade to Pro
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-sm p-2 text-sm hover:bg-neutral-800">
          <User className="h-4 w-4" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-sm p-2 text-sm hover:bg-neutral-800">
          <CreditCard className="h-4 w-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-sm p-2 text-sm hover:bg-neutral-800">
          <Bell className="h-4 w-4" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-neutral-800" />
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-sm p-2 text-sm hover:bg-neutral-800">
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
