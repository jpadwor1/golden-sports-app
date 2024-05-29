'use client';

import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import Image from 'next/image';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import UserAccountNav from '../Navigation/UserAccountNav';
import NavbarMenu from '../Navigation/NavbarMenu';

interface HeaderProps {
  imageURL: string;
  email: string;
}

const Header = ({ imageURL, email }: HeaderProps) => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b bg-white border-gray-200`,
        {
          'border-b border-gray-200 bg-white backdrop-blur-lg': scrolled,
          'border-b border-gray-200 bg-white': selectedLayout,
        }
      )}
    >
      <div className='flex h-[65px] items-center justify-between px-4'>
        <div className='flex items-center space-x-4'>
          <Link
            href='/'
            className='flex flex-row space-x-3 items-center justify-center md:hidden'
          >
            <Image src='/GSlogo.png' width={40} height={40} alt='Logo' />
          </Link>
        </div>

        <div className='hidden md:flex flex-row items-center md:mr-20'>
          <NavbarMenu />
          <UserAccountNav
            name='Your Account'
            role='Customer'
            imageUrl={imageURL}
            email={email}
          />
        </div>
      </div>
    </div>
  );
};
export default Header;
