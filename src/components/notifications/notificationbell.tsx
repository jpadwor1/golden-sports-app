import { Button } from '@/components/ui/button';
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from '@/components/ui/popover';
import NotificationList from './notification-list';
import { UserWithNotifications } from '@/types/types';
import { trpc } from '@/app/_trpc/client';
import { Notification } from '@prisma/client';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  user: UserWithNotifications;
  className?: string;
}
export function NotificationBell({ user, className }: NotificationBellProps) {
  const {data} = trpc.getNotifications.useQuery(user.id)
  
  const notifications: Notification[] = data;
  return (
    <Popover>
      <PopoverTrigger className='relative' asChild>
        <Button className={cn(className,'')} size='icon' variant='ghost'>
          <BellIcon className='relative w-6 h-6' />
          {notifications && notifications.filter((n)=> !n.read).length > 0 && (
            <span
              aria-hidden
              className='absolute top-1 right-2 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white'
            ></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-[350px] p-0'>
        <NotificationList notifications={notifications} />
      </PopoverContent>
    </Popover>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
      <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
    </svg>
  );
}
