import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import HorizontalNavbar from '@/components/Navigation/horizontal-navbar';
import Image from 'next/image';
import { ExtendedEvent } from '@/types/types';
import { Payment } from '@prisma/client';

interface PageProps {
  params: {
    groupId: string;
  };
}

const Page = async ({ params }: PageProps) => {
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
      File: true,
    },
    orderBy: {
      startDateTime: 'asc',
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

  const polls = await db.poll.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
      votes: true,
      PollComment: {
        include: {
          author: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
      },
      author: true,
    },
  });
  const isCoach = dbUser.groupsAsCoach.some((group) => group.id === groupId);
  // let payments: Payment[];
  
  // if (isCoach) {
   const payments = await db.payment.findMany({
      where: {
        groupId: groupId,
      },
    });
  // }else{
  //   payments = await db.payment.findMany({
  //     where: {
  //       groupId: groupId,
  //       userId: user.id,
  //     },
  //   });
  // }

  


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
      <HorizontalNavbar
        polls={polls}
        posts={dbPosts}
        groupId={groupId}
        events={dbEvents}
        user={dbUser}
        payments={payments}
      />
    </>
  );
};

export default Page;
