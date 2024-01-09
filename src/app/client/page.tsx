import React from 'react';
import { ProfileForm } from './ProfileForm';
import { Separator } from '@/components/ui/separator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  
  return (
    <div className='space-y-6 bg-white shadow-md p-6 rounded-md'>
      {!dbUser?.isProfileComplete && (
        <div>
        <h1 className='text-destructive text-xl font-medium'>Please complete profile information to continue.</h1>
      </div>
        )}
      
      <div>
        <h3 className='text-lg font-medium'>Account</h3>
        <p className='text-sm text-muted-foreground'>
          Update your account settings.
        </p>
      </div>
      <Separator />
      <ProfileForm user={dbUser} />
    </div>
  );
};

export default Page;
