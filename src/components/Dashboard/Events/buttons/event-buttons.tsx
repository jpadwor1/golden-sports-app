'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Bell, Pen} from 'lucide-react';
import { ExtendedEvent } from '../Events';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog';
import UpdateEventForm from '../UpdateEventForm';
import { Children, User } from '@prisma/client';
import { cn } from '@/lib/utils';
import InviteUserButton from './invite-user-button';


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


  return (
    <>
      <Button onClick={sendReminder} size='xs' variant='secondary' className='mr-2'>
        <Bell className='mr-2 h-4 w-4' /> Send reminder to unanswered
      </Button>
      <InviteUserButton event={event} />
      
      <Dialog open={eventFormOpen} onOpenChange={setEventFormOpen}>
        <DialogTrigger className={cn(buttonVariants({
          size: 'xs',
          variant: 'secondary',
        }))}>
        <Pen className='mr-2 h-4 w-4' /> Edit
        </DialogTrigger>
      <DialogContent className='overflow-y-auto max-h-screen'>
          <DialogHeader className=''>
            <DialogTitle>Event Responses</DialogTitle>
            <DialogDescription>
              View who is attending, hasn&apos;t responded, and declined the
              event.
            </DialogDescription>
          </DialogHeader>
          <UpdateEventForm event={event} user={user} groupId={event.groupId} setEventFormOpen={setEventFormOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventButtons;
