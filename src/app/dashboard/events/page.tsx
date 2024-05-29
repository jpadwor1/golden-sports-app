import React from 'react';
import Events from './Events';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import { Group, Participant, Payment, Event } from '@prisma/client';

export type ExtendedEvent = Event & {
  invitees: Participant[];
  group: Group;
  payments: Payment[];
};

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

  const dbEvents: ExtendedEvent[] = await db.event.findMany({
    where: {
      invitees: {
        some: {
          userId: user.id,
        },
      },
      groupId: {
        in: groups.map((g) => g.id),
      },
    },
    include: {
      payments: true,
      invitees: true,
      group: true,
    },
  });

  const groupIds = groups.map((g) => g.id);

  return <Events events={dbEvents} user={dbUser} groupId={groupIds} />;
};

export default Page;
