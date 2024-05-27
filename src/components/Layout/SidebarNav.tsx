'use client';

import { trpc } from '@/app/_trpc/client';
import { SideNavItem } from '@/lib/types';
import { Group } from '@prisma/client';
import { ChevronDown, Folder, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface SidebarNavProps {
  userId: string;
}

const SidebarNav = ({userId}: SidebarNavProps) => {
  const { data: groups, isLoading } = trpc.getGroups.useQuery(userId)
  if (isLoading) {
    return <div>Loading...</div>
  }
  const NavItems: SideNavItem[] = [
    {
      title: 'Home',
      path: '/',
      icon: <Home className='w-6 h-6'/>,
    },
    {
      title: 'Your Groups',
      path: `/dashboard/group/${groups[0].id}`,
      icon: <Users className='w-6 h-6'/>,
      submenu: true,
      subMenuItems: groups.map((group: Group) => {
        return { title: group.name, path: `/dashboard/group/${group.id}` };
      }),
    },
    {
      title: 'Messages',
      path: '/messages',
      icon: <Folder className='w-6 h-6'/>,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <Folder className='w-6 h-6'/>,
      submenu: true,
      subMenuItems: [
        { title: 'Account', path: '/settings/account' },
        { title: 'Privacy', path: '/settings/privacy' },
      ],
    },
    {
      title: 'Help',
      path: '/help',
      icon: <Folder className='w-6 h-6'/>,
    },
  ];


  return (
    <div className='md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex'>
      <div className='flex flex-col space-y-6 w-full'>
        <Link
          href='/'
          className='flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full'
        >
          <span className='h-7 w-7 bg-zinc-300 rounded-lg' />
          <span className='font-bold text-xl hidden md:flex'>Logo</span>
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
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
              pathname.includes(item.path) ? 'bg-zinc-100' : ''
            }`}
          >
            <div className='flex flex-row space-x-4 items-center'>
              {item.icon}
              <span className='font-semibold text-xl  flex'>{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <ChevronDown className='w-6 h-6' />
            </div>
          </button>

          {subMenuOpen && (
            <div className='my-2 ml-12 flex flex-col space-y-4'>
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? 'font-bold' : ''
                    }`}
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
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
            item.path === pathname ? 'bg-zinc-100' : ''
          }`}
        >
          {item.icon}
          <span className='font-semibold text-xl flex'>{item.title}</span>
        </Link>
      )}
    </div>
  );
};
