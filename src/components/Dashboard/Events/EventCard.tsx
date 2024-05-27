import { ExtendedEvent } from '@/app/dashboard/events/page';
import { cn } from '@/lib/utils';
import { User } from '@prisma/client';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
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
  const hasAnswered = event.invitees.some((p) => p.userId === user.id);

  return (
    <Link href={`/events/${event.id}`}>
      <div className='relative flex flex-row items-center justify-start bg-white shadow-md rounded-md w-full mb-4 p-2 overflow-hidden h-[120px]'>
        <div className={cn(!hasAnswered ? 'bg-red-500' : 'bg-green-500', 'w-[2px] h-full absolute left-0 top-0 bottom-0')}></div>
        <div className='w-1/4 bg-gray-200 flex flex-col p-4 rounded-sm items-center justify-center'>
          <h1 className='text-green-700 font-semibold text-3xl -m-2 p-0'>21</h1>
          <p className='text-gray-900 text-lg font-medium'>June</p>
        </div>
        <div className='w-3/4 flex flex-col ml-2 leading-6'>
          <h1 className='text-green-900 font-medium text-lg hover:underline'>
            Monday Practice
          </h1>
          <p className='text-gray-900 text-md'>Today at 5:30PM</p>
          <div className='flex flex-row items-center justify-start'>
            <MapPin className='h-4 w-4  text-green-900' />
            <p className='text-gray-700 text-sm hover:text-green-900'>
              2268 Seagull ct. San Jacinto, CA
            </p>
          </div>

          <p className='text-gray-700 text-sm'>
            Golden State Baseball &#x2022; 9U
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
