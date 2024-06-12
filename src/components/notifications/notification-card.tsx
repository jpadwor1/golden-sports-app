import React from 'react';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import Link from 'next/link';
import { Notification } from '@prisma/client';

interface NotificationCardProps {
  notification?: Notification;
}
const NotificationCard = ({ notification }: NotificationCardProps) => {
  return (
    <div className='flex items-start gap-3'>
      <div className='flex-shrink-0'>
        <Avatar>
          <AvatarImage alt='@shadcn' src='/placeholder-user.jpg' />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex-1 space-y-1'>
        <p className='text-sm font-medium'>
          <Link className='hover:underline' href='#'>
            Shadcn
          </Link>
          commented on your post
        </p>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          This is a great idea!
        </p>
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          2 hours ago
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
