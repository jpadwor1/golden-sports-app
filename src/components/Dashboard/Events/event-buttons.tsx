'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Pen, UserPlus } from 'lucide-react';
import { ExtendedEvent } from './Events';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog';
import UpdateEventForm from './UpdateEventForm';
import { Children, User } from '@prisma/client';


interface EventButtonProps {
    user: User & {
        Children: Children[];
    };
  event: ExtendedEvent;
}

const EventButtons = ({ event, user }: EventButtonProps) => {
  const [eventFormOpen, setEventFormOpen] = React.useState(false);

  const sendReminder = () => {
    console.log('send reminder');
  }

  const addInvitees = () => {
    console.log('add invitees');
  }


  return (
    <>
      <Button onClick={sendReminder} size='xs' variant='secondary' className='mr-2'>
        <Bell className='mr-2 h-4 w-4' /> Send reminder to unanswered
      </Button>
      <Button size='xs' variant='secondary' className='mr-2'>
        <UserPlus className='mr-2 h-4 w-4' /> Add
      </Button>
      
      <Dialog>
        <DialogTrigger>
        <Button
        size='xs'
        variant='secondary'
      >
        <Pen className='mr-2 h-4 w-4' /> Edit
      </Button>
        </DialogTrigger>
      <DialogContent className=''>
          <DialogHeader className=''>
            <DialogTitle>Event Responses</DialogTitle>
            <DialogDescription>
              View who is attending, hasn&apos;t responded, and declined the
              event.
            </DialogDescription>
          </DialogHeader>
          <UpdateEventForm user={user} groupId={event.groupId} setEventFormOpen={setEventFormOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventButtons;
