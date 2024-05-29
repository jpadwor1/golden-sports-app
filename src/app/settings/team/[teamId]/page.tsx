import React from 'react';
import { db } from '@/db';
import TeamDetails from './TeamDetails';

interface PageProps {
  params: {
    teamId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const team = await db.group.findFirst({
    where: {
      id: params.teamId,
    },
    include: {
      members: true,
    },
  });

  const coach = await db.user.findFirst({
    where: {
      id: team?.coachId,
    },
  });

  return (
    <TeamDetails coach={coach} team={team} members={team?.members}/>
  );
};

export default Page;
