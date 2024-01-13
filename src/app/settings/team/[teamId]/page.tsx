import React from 'react';
import { db } from '@/db';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
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
    <TeamDetails coach={coach} team={team} members={team?.members} />
  );
};

export default Page;
