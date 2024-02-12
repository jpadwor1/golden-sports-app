import { ExtendedEvent } from '@/app/dashboard/events/page';
import { User } from '@prisma/client';
import React from 'react';

interface EventCardProps {
  event: ExtendedEvent;
  user: {
    groupsAsCoach: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
    groupsAsMember: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
  } & User;
}

const EventCard = ({ event, user }: EventCardProps) => {
  const hasAnswered = event.participants.some((p) => p.userId === user.id);

  return (
    <div className='flex flex-row items-center justify-start bg-white shadow-md rounded-md w-full mb-4 p-4 overflow-hidden h-[120px]'>
      <div className='w-1/4 bg-gray-200 flex flex-col p-4 rounded-sm items-center justify-center'>
        <h1 className='text-gray-900 font-medium text-3xl -m-2 p-0'>21</h1>
        <p className='text-gray-500 text-lg'>June</p>
      </div>
      <div className='w-3/4 flex flex-col p-4'>
        <h1 className='text-gray-900 font-medium text-lg'>event.name</h1>
        <p className='text-gray-500 text-sm'>event.description</p>
        <div className='flex flex-row justify-between'>
          <p className='text-gray-500 text-sm'>event.location</p>
          <p className='text-gray-500 text-sm'>event.time</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
