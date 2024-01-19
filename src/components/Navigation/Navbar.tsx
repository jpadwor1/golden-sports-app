import React from 'react';
import Link from 'next/link';
import MaxWidthWrapper from '@/components/Layout/MaxWidthWrapper';
import { buttonVariants } from '../ui/button';
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import MobileNav from './MobileNav';
import UserAccountNav from './UserAccountNav';
import NavbarMenu from './NavbarMenu';
import { db } from '@/db';

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
 let dbUser;
  if(user) {
     dbUser = await db.user.findUnique({
      where: {
        id: user?.id,
      },
    })
  }
  

  return (
    <nav className='sticky h-20 inset-x-0 top-0 z-40 w-flow border-b border-gray-200 bg-white/60 backdrop-blur-lg transtion-all'>
      <MaxWidthWrapper>
        <div className='flex h-20 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='flex z-40 font-semibold'>
            <Image
              className='w-12 h-auto'
              src='/GSlogo.png'
              width={300}
              height={222}
              alt='Always Clean'
            />
          </Link>

          <MobileNav />

          <div className='hidden items-center space-x-4 sm:flex'>
            <NavbarMenu />
            {!user ? (
              <>
                <LoginLink
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Login
                </LoginLink>

                <RegisterLink className={buttonVariants({ size: 'sm' })}>
                  Get Started <ArrowRight className='ml-1.5 h-5 w-5' />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href='/dashboard'
                  // href={dbCustomer?.role === 'ADMIN' ? '/dashboard' : '/client'}
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  {/* {dbCustomer?.role === 'ADMIN' ? 'Dashboard' : 'Service History'}
                   */}
                  Dashboard
                </Link>

                <UserAccountNav
                  name={
                    // !dbCustomer?.name ? 'Your Account' : `${dbCustomer?.name} `
                    'Your Account'
                  }
                  imageUrl={dbUser?.imageURL ?? ''}
                  email={user.email ?? ''}
                  // role={dbCustomer?.role ?? ''}
                  role='Customer'
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
