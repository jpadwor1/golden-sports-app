import Dashboard from '@/app/dashboard/Dashboard';
import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { currentUser } from '@clerk/nextjs/server';

const Page = async () => {
  const user = await currentUser();

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
      comments: true,
      Files: true,
      author: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
  return <Dashboard user={dbUser} posts={dbPosts} />;
};

export default Page;
