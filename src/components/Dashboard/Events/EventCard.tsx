import { cn } from '@/lib/utils';
import { User } from '@prisma/client';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ExtendedEvent } from './Events';

interface EventCardProps {
  groupId: string;
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

const EventCard = ({ event, user, groupId }: EventCardProps) => {
  const hasAnswered = event.invitees.some((p) => p.userId === user.id);
  const date = new Date(event.startDateTime);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const today = new Date();
  const eventDate = date;
  // Reset the time part to compare only the date part
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const dayDifference =
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  let displayDate;

  if (dayDifference === 0) {
    displayDate = `Today at ${format(date, 'hh:mm a')}`;
  } else if (dayDifference === 1) {
    displayDate = `Tomorrow at ${format(date, 'hh:mm a')}`;
  } else {
    displayDate = format(date, 'MM/dd/yyyy @ hh:mm a'); // This will display the actual date
  }

  return (
    <Link href={`/dashboard/group/${groupId}/events/${event.id}`}>
      <div className='relative flex flex-row items-center justify-start bg-white shadow-md rounded-md w-full mb-4 p-2 overflow-hidden h-[120px]'>
        <div
          className={cn(
            !hasAnswered ? 'bg-red-500' : '',
            'w-[2px] h-full absolute left-0 top-0 bottom-0'
          )}
        ></div>
        <div className='w-1/4 bg-gray-200 flex flex-col p-4 rounded-sm items-center justify-center'>
          <h1 className='text-green-700 font-semibold text-3xl -m-2 p-0'>
            {date.getDate()}
          </h1>
          <p className='text-gray-900 text-lg font-medium'>{months[date.getMonth()]}</p>
        </div>
        <div className='w-3/4 flex flex-col ml-2 leading-6'>
          <h1 className='text-green-900 font-medium text-lg hover:underline'>
            {event.title}
          </h1>
          <p className='text-gray-900 text-md'>{displayDate}</p>
          <div className='flex flex-row items-center justify-start'>
            <MapPin className='h-4 w-4  text-green-900' />
            <p className='text-gray-700 text-sm hover:text-green-900 truncate'>
              {event.address}
            </p>
          </div>

          <p className='text-gray-700 text-sm truncate'>
            {event.group.name + ' - ' + event.group.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
