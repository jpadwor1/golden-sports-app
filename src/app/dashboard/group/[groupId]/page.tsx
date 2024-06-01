import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import { Group, Participant, Payment, Event } from '@prisma/client';
import HorizontalNavbar from '@/components/Navigation/horizontal-navbar';
import Image from 'next/image';

export type ExtendedEvent = Event & {
  invitees: Participant[];
  group: Group;
  payments: Payment[];
};

interface PageProps {
  params: {
    groupId: string;
  };
}

const Page = async ({params}: PageProps) => {
  const groupId = params.groupId;
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

  const dbEvents: ExtendedEvent[] = await db.event.findMany({
    where: {
      invitees: {
        some: {
          userId: user.id,
        },
      },
      groupId: groupId,
    },
    include: {
      payments: true,
      invitees: true,
      group: true,
    },
  });

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

  const groupIds = groups.map((g) => g.id);

  const polls = await db.poll.findMany({
    where: {
      groupId: groupId
    },
    include: {
      options: true,
      votes: true,
      PollComment:true
    }
  })

  return (
    <>
    <div className='w-full h-[300px] overflow-hidden mb-0'>
              <Image
                src='/flex-ui-assets/images/blog-content/content-photo1.jpg'
                alt='Team Banner'
                layout='responsive'
                width={500}
                height={300}
              />
            </div>
    <HorizontalNavbar polls={polls} posts={dbPosts} groupId={groupId} events={dbEvents} user={dbUser}/>
    </>
  );
};

export default Page;
