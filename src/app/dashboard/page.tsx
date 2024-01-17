import React from 'react';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { Posts } from '@/lib/utils';
import Dashboard from './Dashboard';

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

  const dbPosts = await db.post.findMany({
    where: {
      groupId: {
        in: groups.map((g) => g.id),
      },
    },
    include: {
      likes: true,
      comments: {
        include: {
          replies: true,
          author: true,
          likes: true,
        },
      },
      Files: true,
      author: true,
    },
  });

  return <Dashboard user={dbUser} posts={dbPosts} />;
};

export default Page;
