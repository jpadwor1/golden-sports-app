import React from 'react';
import SidebarNav from '@/components/Layout/SidebarNav';
import MarginWidthWrapper from '@/components/Layout/margin-width-wrapper';
import Header from '@/components/Layout/header';
import HeaderMobile from '@/components/Layout/header-mobile';
import PageWrapper from '@/components/Layout/page-wrapper';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

interface GroupLayoutProps {
  children: React.ReactNode;
}

export default async function GroupLayout({ children }: GroupLayoutProps) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) redirect('/auth-callback?origin=dashboard');
    return (
        <div className='flex'>
        <SidebarNav userId={user.id}/>
        <main className='flex-1'>
            <MarginWidthWrapper>
            <Header />
            <HeaderMobile />
            <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
        </main>
        </div>
    );
}
