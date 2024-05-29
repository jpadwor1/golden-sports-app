import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './sidebarNav';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import Navbar from '@/components/Navigation/Navbar';

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/settings',
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
  },
  {
    title: 'Billing',
    href: '/settings/billing',
  },
  {
    title: 'Team',
    href: '/settings/team',
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

 

  return (
    <>
    <Navbar />
      <div className='space-y-6 p-10 pb-16 block '>
        <div className='space-y-0.5'>
          <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
          <p className='text-muted-foreground'>
            Manage your account settings and view service history.
          </p>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='-mx-4 lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex-1 lg:max-w-3xl'>{children}</div>
        </div>
      </div>
    </>
  );
}
