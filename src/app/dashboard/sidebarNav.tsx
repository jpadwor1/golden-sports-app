'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { User as UserIcon } from 'lucide-react';
import { User } from '@prisma/client';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
  user: User;
}

export function SidebarNav({
  className,
  items,
  user,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <nav
      className={cn('flex flex-col space-x-0 space-y-1 mt-10 ', className)}
      {...props}
    >
      <div className='w-full flex items-center justify-center'>
        <div className='border border-gray-200 rounded-xl bg-gray-100 max-w-fit p-1 mb-5'>
          <div className='flex flex-row items-start justify-start space-x-2 px-2 py-1'>
            <Avatar className='h-10 w-10 relative bg-white'>
              {user?.imageURL ? (
                <div className='relative bg-white aspect-square h-full w-full'>
                  <Image
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    src={user.imageURL}
                    alt='profile picture'
                    referrerPolicy='no-referrer'
                  />
                </div>
              ) : (
                <AvatarFallback className='bg-white'>
                  <span className='sr-only'>{user?.name}</span>
                  <UserIcon className='h-4 w-4 text-gray-900' />
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <div className='flex flex-col items-start justify-start '>
                <p className='text-sm font-medium text-gray-900'>{user.name}</p>
                <p className='text-xs text-gray-600 font-medium tracking-wider'>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? ' text-blue-600 border-l-4 border-blue-600 rounded-none hover:text-blue-600'
              : 'hover:bg-transparent hover:underline',
            'justify-start font-semibold text-md tracking-wider '
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
