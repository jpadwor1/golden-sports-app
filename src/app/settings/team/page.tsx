import React from 'react';
import CreateTeamForm from './CreateTeamForm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
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

  const teams = dbUser.groupsAsCoach.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    createdAt: group.createdAt,
    logoURL: group.logoURL,
  }));

  return (
    <div className='flex flex-col w-full bg-white shadow-md rounded-md h-full p-6'>
      {dbUser.groupsAsCoach.length === 0 && <CreateTeamForm />}
      <h1 className='text-2xl tex-gray-900 font-semibold tracking-wide'>Your Teams</h1>
      <h2 className='text-md text-gray-600'>Select a team to view team details.</h2>
      <Separator className='mt-2 mb-6'/>
      <div className='grid md:grid-cols-3 gird-cols-1 gap-4'>
        {teams.map((team) => (
            <Link href={`/settings/team/${team.id}`} key={team.id}>
          <Card className='hover:scale-105 hover:shadow-lg'>
            <CardHeader>
              <Image
                src={team.logoURL || '/GSlogo.png'}
                alt='Logo'
                width={400}
                height={400}
              />
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
        
          </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
