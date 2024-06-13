'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Bell, Pen, Trash2} from 'lucide-react';
import { ExtendedEvent } from '@/types/types';
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
import { IconDotsVertical } from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';
interface EventButtonProps {
    user: User & {
        Children: Children[];
    };
  event: ExtendedEvent;
}

const EventButtons = ({ event, user }: EventButtonProps) => {
  const router = useRouter();
  const [eventFormOpen, setEventFormOpen] = React.useState(false);

  const sendInviteesReminder = trpc.sendInviteeEventReminder.useMutation();
  const sendReminder = () => {
    sendInviteesReminder.mutate(event.invitees,{
      onSuccess: () => {
        toast({
          title: 'Reminder sent',
          description: 'The reminder was sent to all invitees who have not responded yet.'
        })
      },
      onError: (error) => {
        console.error(error)
        toast({
          title: 'Oops, something went wrong',
          description: 'The reminder was not sent. Reload the page and try again.'
        })
      }
    });
  }

  const deleteEvent = trpc.deleteEvent.useMutation();

  const handleDeleteEvent = () => {
    const formData = {
      eventId: event.id,
      groupId: event.groupId
    }

    deleteEvent.mutate(formData,{
      onSuccess: () => {
        router.push(`/dashboard/group/${event.groupId}`, {scroll: false})
      },
      onError: (error) => {
        console.error(error)
        toast({
          title: 'Oops, something went wrong',
          description: "The event wasn't IconGitBranchDeleted. Reload the page and try again."
        })
      }
    })
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
      
  <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-6 w-6 ml-2">
                  <IconDotsVertical className="h-5 w-5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDeleteEvent()}>
                  <Trash2 className='h-4 w-4 text-red-400 mr-2' /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

    </>
  );
};

export default EventButtons;
