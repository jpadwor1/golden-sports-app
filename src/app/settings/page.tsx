import React from 'react';
import { ProfileForm } from './ProfileForm';
import { Separator } from '@/components/ui/separator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { UserRole } from '@prisma/client';

export type User =
  | ({
      Children: {
        id: string;
        name: string;
        age: number;
        parentId: string;
        createdAt: Date;
      }[];
    } & {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: UserRole;
      createdAt: Date;
      isProfileComplete: boolean;
      imageURL: string | null;
      parentId: string | null;
    })
  | null;

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser: User = await db.user.findFirst({
    where: {
      id: user?.id,
    },
    include: {
      Children: true,
    },
  });

  return (
    <div className='space-y-6 bg-white shadow-md p-6 rounded-md'>
      {!dbUser?.isProfileComplete && (
        <div>
          <h1 className='text-destructive text-xl font-medium'>
            Please complete profile information to continue.
          </h1>
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
