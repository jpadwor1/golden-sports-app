import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './sidebarNav';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import Image from 'next/image';
import { Calendar, LayoutDashboard, Vote } from 'lucide-react';
const sidebarNavItems = [
  {
    title: 'Your Feed / Posts',
    href: '/dashboard',
    icon: <LayoutDashboard className='h-6 w-6 ml-3 mr-5' />,
  },
  {
    title: 'Events',
    href: '/dashboard/events',
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

  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  return (
    <div className='flex flex-row w-full'>
      <aside className='md:block hidden min-h-[calc(100vh-5rem)] lg:w-1/4 bg-white'>
        <SidebarNav items={sidebarNavItems} user={user} />
      </aside>

      <div>
        {children}
      </div>
    </div>
  );
}
