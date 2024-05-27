'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Group, User } from '@prisma/client';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
  user: User & {
    groupsAsCoach: Group[];
    groupsAsMember: Group[];
  }
}

export function SidebarNav({
  className,
  items,
  user,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const groups = [...user.groupsAsCoach, ...user.groupsAsMember];

  return (
    <nav
      className={cn(
        'flex flex-wrap space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {groups.length > 0 ? 
      groups.map((group) => (
        <Link
          key={group.id}
          href={`/dashboard/group/${group.id}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === `/dashboard/groups/${group.id}`
              ? 'bg-primary text-white hover:bg-primary hover:text-white'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {group.description + ' ' + group.name}
        </Link>
      )) : null
      }
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-primary text-white hover:bg-primary hover:text-white'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
