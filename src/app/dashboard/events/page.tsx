import React from 'react';
import Events from './Events';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import { Group, Participant, Payment, EventType } from '@prisma/client';

export type ExtendedEvent = {
  id: string;
  groupId: string;
  name: string;
  description: string | null;
  startDateTime: Date;
  endDateTime: Date;
  location: string | null;
  maxParticipants: number | null;
  eventType: EventType;
} & {
  payments: Payment[];
  participants: Participant[];
  group: Group;
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
      groupId: {
        in: groups.map((g) => g.id),
      },
    },
    include: {
      payments: true,
      participants: true,
      group: true,
    },
  });

  return <Events events={dbEvents} user={dbUser} />;
};

export default Page;
