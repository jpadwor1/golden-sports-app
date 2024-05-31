'use client';

import { trpc } from '@/app/_trpc/client';
import { SideNavItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Group } from '@prisma/client';
import { ChevronDown, Folder, Home, Info, Loader2, MessageSquare, Settings, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface SidebarNavProps {
  userId: string;
}

const SidebarNav = ({ userId }: SidebarNavProps) => {
  const { data: groups, isLoading } = trpc.getGroups.useQuery(userId);

  if (isLoading) {
    return (
      <div className='md:w-[260px] bg-white h-screen flex-1 fixed hidden md:flex'>
        <div className='flex flex-col space-y-6 w-full'>
          <Link
            href='/'
            className='flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-r-none border-gray-200 h-[65px] w-full'
          >
            <Image src='/GSlogo.png' width={40} height={40} alt='Logo' />
          </Link>

          <div className='flex flex-col items-center space-y-2  md:px-6 '>
            <Loader2 className='animate-spin w-10 h-10' />
          </div>
        </div>
      </div>
    );
  }

  const NavItems: SideNavItem[] = [
    {
      title: 'Home',
      path: '/',
      icon: <Home className='w-6 h-6' />,
    },
    {
      title: 'Your Groups',
      path: `/dashboard/group/${groups[0].id}`,
      icon: <Users className='w-6 h-6' />,
      submenu: true,
      subMenuItems: groups.map((group: Group) => {
        return { title: group.name, path: `/dashboard/group/${group.id}` };
      }),
    },
    {
      title: 'Messages',
      path: '/dashboard/messages',
      icon: <MessageSquare className='w-6 h-6' />,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <Settings className='w-6 h-6' />,
      submenu: true,
      subMenuItems: [
        { title: 'Account', path: '/settings/account' },
        { title: 'Privacy', path: '/settings/privacy' },
      ],
    },
    {
      title: 'Help',
      path: '/help',
      icon: <Info className='w-6 h-6' />,
    },
  ];

  return (
    <div className='md:w-[260px] bg-white h-screen flex-1 fixed border-r border-gray-200 hidden md:flex'>
      <div className='flex flex-col space-y-6 w-full'>
        <Link
          href='/'
          className='flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-gray-200 h-[65px] w-full'
        >
          <Image src='/GSlogo.png' width={40} height={40} alt='Logo' />
        </Link>

        <div className='flex flex-col space-y-2  md:px-6 '>
          {NavItems.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className=''>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg w-full justify-between hover:bg-gray-100 ${
              pathname.includes(item.path) ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex flex-row space-x-4 items-center'>
              {item.icon}
              <span className='text-lg flex'>{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <ChevronDown className='w-6 h-6' />
            </div>
          </button>

          {subMenuOpen && (
            <div className='my-2 ml-12 flex flex-col space-y-4 group'>
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={cn(subItem.path === pathname ? 'font-bold' : '')}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-gray-100 ${
            item.path === pathname ? 'bg-gray-100' : ''
          }`}
        >
          {item.icon}
          <span className='text-xl flex'>{item.title}</span>
        </Link>
      )}
    </div>
  );
};
