import React from 'react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Group, User } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TeamDetailsProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    coachId: string;
    createdAt: Date;
    logoURL: string | null;
    members: User[];
    }
  coach: User;
}

const TeamDetails = ({ team, coach }: TeamDetailsProps) => {
  return (
    <div className='flex flex-col w-full bg-white shadow-md rounded-md h-full p-6'>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col items-start'>
          <h1 className='text-2xl tex-gray-900 font-semibold tracking-wide'>
            {team?.name}
          </h1>
          <h2 className='text-md text-gray-600'>Coach {coach?.name}</h2>
          <h2 className='text-md text-gray-600'>{team?.description}</h2>
        </div>
        <Image
          src={team?.logoURL || '/GSlogo.png'}
          alt='Logo'
          width={100}
          height={100}
        />
      </div>

      <Separator className='mt-2 mb-6' />
      <div className='flex flex-wrap items-center text-center justify-center'>
        <Button className='w-1/4 my-6'>Add Member</Button>

        <div className='flex flex-col items-center justify-center w-[300px]'>
          <h3 className='text-xl text-gray-900 font-semibold'>Team Members</h3>
          <Separator className='mt-2 mb-6 w-full' />
          <ScrollArea className='w-full'>
            <Table className=''>
              <TableCaption>Team Members</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-gray-900'>Member Name</TableHead>
                  <TableHead className='text-gray-900'>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {team?.members.map((member) => (
                    <>
                      <TableCell key={member.id}>{member.name}</TableCell>
                      <TableCell key={member.id}>{member.email}</TableCell>
                    </>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
