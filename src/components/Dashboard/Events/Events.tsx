'use client';

import React from 'react';
import CreateEventForm from '@/components/Dashboard/Events/CreateEventForm';
import MiniEventCard from '@/components/Dashboard/Events/MiniEventCard';
import MiniNewsCard from '@/components/Dashboard/MiniNewsCard';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { Group, Participant, Payment, User,Event } from '@prisma/client';
import EventCard from '@/components/Dashboard/Events/EventCard';

export type ExtendedEvent = Event & {
  invitees: Participant[];
  group: Group;
  payments: Payment[];
};

interface EventsPageProps {
  groupId: string;
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
  events: ExtendedEvent[];
}

const testEvent: ExtendedEvent = {
  id: '1',
  groupId: '1',
  title: 'Test Event',
  description: 'Test Event Description',
  startDateTime: new Date(),
  endDateTime: new Date(),
  address: 'Test Location',
  maxParticipants: 10,
  invitees: [],
  reminders: true,
  payments: [],
  group: {
    id: '1',
    name: 'Test Group',
    description: 'Test Group Description',
    coachId: '1',
    createdAt: new Date(),
    logoURL: null,
  },
  notificationDate: new Date(),
  feeAmount: 0,
  feeServiceCharge: 0,
  feeDescription: 'Free Event',
  repeatFrequency: 'none',
  recurringEndDate: new Date(),
  parentEventId: null,  
};

const Events = ({ user, events, groupId }: EventsPageProps) => {
  const [eventFormOpen, setEventFormOpen] = React.useState(false);
  const isUserCoachOfGroup = user.role === 'COACH' && user.groupsAsCoach.some(group => group.id === groupId);
  return (
    <div className='flex flex-col space-y-8 md:flex-row md:items-start md:justify-between md:space-x-2 lg:space-y-0 px-8'>
      <div className='flex flex-col items-center justify-center space-y-2 mt-2 w-full md:w-3/4 max-w-lg'>
        <div className='flex flex-row w-full justify-between'>
          <h2 className='text-2xl font-bold tracking-wide '>Events</h2>
          {!eventFormOpen && isUserCoachOfGroup && (
            <button
              onClick={() => setEventFormOpen(true)}
              className='flex flex-row items-center justify-center space-x-1 hover:bg-gray-200 hover:cursor-pointer px-2 py-1 rounded-full'
            >
              <Plus className='h-3 w-3 text-blue-500' />
              <p className='text-sm text-blue-500 pr-1 mb-0.5'>Create Event </p>
            </button>
          )}
        </div>
        <div className='flex flex-col min-h-[calc(100vh-20rem)] w-full'>
          {eventFormOpen && (
            <CreateEventForm setEventFormOpen={setEventFormOpen} user={user} />
          )}
          {events.map((event) => (
            <EventCard key={event.id} event={event} user={user} groupId={groupId} />
          ))}
        </div>
      </div>

      <div className='flex-col hidden md:flex md:w-1/2 md:py-8 md:mt-2 md:px-6 max-w-xs'>
        <div className='bg-white min-h-[300px]  shadow-md rounded-md mt-3 '>
          <h2 className='text-md font-semibold tracking-wide ml-3 my-2 '>
            Upcoming Events
          </h2>
          <Separator className='text-gray-200' />
          <MiniEventCard />
        </div>
        <div className='bg-white min-h-[300px]  shadow-md rounded-md mt-6'>
          <h2 className='text-md font-semibold tracking-wide ml-3 my-2'>
            Top News
          </h2>
          <Separator className='text-gray-200' />
          <MiniNewsCard />
        </div>
      </div>
    </div>
  );
};

export default Events;
