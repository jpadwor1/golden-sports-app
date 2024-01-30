import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import Polls from './Polls';

const Page = async () => {
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

  const groups = [...dbUser.groupsAsCoach, ...dbUser.groupsAsMember];

  const dbPolls = await db.poll.findMany({
    where: {
      groupId: {
        in: groups.map((g) => g.id),
      },
    },
    include: {
      options: true,
      votes: true,
    },
  });

  return <Polls polls={dbPolls} user={dbUser} />;
};

export default Page;
