import React from 'react';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { Loader2 } from 'lucide-react';

const Page = async () => {
  let user = null;
  let dbUser = null;
  try {
    const { getUser } = getKindeServerSession();
    user = await getUser();

    if (!user || !user.id) throw new Error('User not found');

    dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
      include: {
        groupsAsCoach: true,
        groupsAsMember: true,
      },
    });
console.log(dbUser)
    if (!dbUser || dbUser === null)
      throw new Error('User not found in database');
  } catch (error) {
    console.error(error);
  }

  if (!dbUser || dbUser === null) {
    redirect('/auth-callback?origin=dashboard/group');
  }

  const groups = [...dbUser.groupsAsCoach, ...dbUser.groupsAsMember];

  if (groups.length > 0) redirect(`/dashboard/group/${groups[0].id}`);

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>
          Getting you over to your group...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
