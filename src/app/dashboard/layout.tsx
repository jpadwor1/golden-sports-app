import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { Calendar, LayoutDashboard, Vote } from 'lucide-react';
import MaxWidthWrapper from '@/components/Layout/MaxWidthWrapper';
import { redirect } from 'next/navigation';
import { User } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './sidebarNav';
import Image from 'next/image';
const sidebarNavItems = [
  {
    title: 'Your Feed / Posts',
    href: '/dashboard',
    icon: <LayoutDashboard className='h-6 w-6 ml-3 mr-5' />,
  },
  {
    title: 'Events',
    href: '/dashboard/group',
    icon: <Calendar className=' h-6 w-6 ml-3 mr-5' />,
  },
  {
    title: 'Polls',
    href: '/dashboard/polls',
    icon: <Vote className='h-6 w-6 ml-3 mr-5' />,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
    include: {
      groupsAsCoach: true,
      groupsAsMember: true,
    },
  });

  if (!dbUser) {
    redirect('/auth-callback?origin=dashboard');
  }
  return (
    // <MaxWidthWrapper className='md:px-2'>
    //   <div className='space-y-6 md:p-10 p-4 pb-16 block '>
    //     <div className='space-y-0.5 '>
    //       <Image src='/logo.svg' width={200} height={50} alt='logo' />
    //     </div>
    //     <Separator className='my-6' />
    //     <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
    //       {/* <aside className='md:-mx-4 lg:w-1/5'>
    //         <SidebarNav user={dbUser} items={sidebarNavItems} />
    //       </aside> */}
    //       <div className='flex-1 lg:max-w-3xl'>{children}</div>
    //     </div>
    //   </div>
    // </MaxWidthWrapper>
    <>{children}</>
  );
}
