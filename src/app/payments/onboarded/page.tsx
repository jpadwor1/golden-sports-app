import React from 'react';
import { Loader2 } from 'lucide-react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { absoluteUrl } from '@/lib/utils';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect('/sign-in');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect('/auth-callback?origin=dashboard');
  }

  if (dbUser.stripeAccountComplete) {
    redirect('/dashboard');
  }

  if (!dbUser?.stripeAccountId) {
    const response = await fetch('/api/create-stripe-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (response.ok) {
      const url = await response.text();
      window.location.href = url;
    } else {
      console.error('Failed to create a Stripe account.');
    }
  } else {
    const response = await fetch(absoluteUrl('/api/verify-stripe-account'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stripeAccountId: dbUser.stripeAccountId }),
    });

    if (response.status === 200) {
      redirect('/dashboard');
    } else {
      console.error('Failed to verify Stripe account.');
      alert('Failed to verify Stripe account.');
      redirect('/dashboard');
    }
  }

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
