'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
} from '@tabler/icons-react';
import { trpc } from '@/app/_trpc/client';
import { Participant as ParticipantType, User } from '@prisma/client';

type Participant = ParticipantType & {
    user: User;
};

interface ParticipationDialogProps {
  eventId: string;
  attending: {
    userId: string;
    eventId: string;
    status: string;
  }[];
  unanswered: {
    userId: string;
    eventId: string;
    status: string;
  }[];
  declined: {
    userId: string;
    eventId: string;
    status: string;
  }[];
}

export default function ParticipationDialog({
  eventId,
  attending,
  unanswered,
  declined,
}: ParticipationDialogProps) {
  const [defaultTab, setDefaultTab] = React.useState('attending');
  const [open, setOpen] = React.useState(false);
  const { data, isLoading } = trpc.getParticipants.useQuery(eventId);
  let attendingParticipants: Participant[] = [];
  let unansweredParticipants: Participant[] = [];
  let declinedParticipants: Participant[] = [];
  if (data && data.participants) {
    attendingParticipants = data.participants.filter(
      (user: Participant) => user.status === 'ATTENDING'
    );
    unansweredParticipants = data.participants.filter(
      (user: Participant) => user.status === 'UNANSWERED'
    );
    declinedParticipants = data.participants.filter(
      (user: Participant) => user.status === 'DECLINED'
    );
  }
  const handleDialog = (tab: string) => {
    setDefaultTab(tab);
    setOpen(true);
  };
  
  return (
    <div>
      <div className='flex'>
        <Badge
          onClick={() => handleDialog('attending')}
          className='mr-2 hover:cursor-pointer'
          variant='secondary'
        >
          <IconCircleCheck
            color='green'
            size={18}
            className='mr-1'
            stroke={2}
          />
          {attending.length} Attending
        </Badge>
        <Badge
          onClick={() => handleDialog('unanswered')}
          className='mr-2 hover:cursor-pointer'
          variant='secondary'
        >
          <IconHelpCircle stroke={2} size={18} className='mr-1' />
          {unanswered.length} Unanswered
        </Badge>
        <Badge
          onClick={() => handleDialog('declined')}
          variant='secondary'
          className='hover:cursor-pointer'
        >
          <IconCircleX color='red' stroke={2} size={18} className='mr-1' />
          {declined.length} Declined
        </Badge>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='min-h-[500px] max-h-[500px]'>
          <DialogHeader className=''>
            <DialogTitle>Event Responses</DialogTitle>
            <DialogDescription>
              View who is attending, hasn&apos;t responded, and declined the
              event.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={defaultTab} className='w-full'>
            <TabsList className='border-b w-full justify-stretch'>
              <TabsTrigger value='attending'>Attending</TabsTrigger>
              <TabsTrigger value='unanswered'>Unanswered</TabsTrigger>
              <TabsTrigger value='declined'>Declined</TabsTrigger>
              <TabsTrigger value='all'>All</TabsTrigger>
            </TabsList>
            <TabsContent value='attending' className='p-4 max-h-[300px] min-h-[300px] overflow-y-auto justify-start self-start'>
              {isLoading && <p>Loading...</p>}
              {attendingParticipants.map((user: Participant) => (
                <div key={user.user.id} className='flex items-center gap-4 mb-2'>
                  <Avatar>
                    <AvatarImage src={user.user.imageURL ? user.user.imageURL : ''} alt={user.user.firstName} />
                    <AvatarFallback>{user.user.firstName[0] + user.user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{user.user.firstName + user.user.lastName}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value='unanswered' className='p-4 max-h-[300px] min-h-[300px] overflow-y-auto justify-start self-start'>
            {isLoading && <p>Loading...</p>}
              {unansweredParticipants.map((user: Participant) => (
                <div key={user.user.id} className='flex items-center gap-4 mb-2'>
                  <Avatar>
                    <AvatarImage src={user.user.imageURL ? user.user.imageURL : ''} alt={user.user.firstName} />
                    <AvatarFallback>{user.user.firstName[0] + user.user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{user.user.firstName + user.user.lastName}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value='declined' className='p-4 max-h-[300px] min-h-[300px] overflow-y-auto justify-start self-start'>
            {isLoading && <p>Loading...</p>}
            {declinedParticipants.map((user: Participant) => (
                <div key={user.user.id} className='flex items-center gap-4 mb-2'>
                  <Avatar>
                    <AvatarImage src={user.user.imageURL ? user.user.imageURL : ''} alt={user.user.firstName} />
                    <AvatarFallback>{user.user.firstName[0] + user.user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{user.user.firstName + user.user.lastName}</p>
                  </div>
                </div>
              ))} 
            </TabsContent>
            <TabsContent value='all' className='p-4 max-h-[300px] min-h-[300px] w-full flex flex-col justify-start self-start overflow-y-auto'>

            {isLoading && <p>Loading...</p>}
              {data?.participants.map((user: Participant) => (
                <div key={user.user.id} className='flex items-center gap-4 mb-2'>
                  <Avatar>
                    <AvatarImage src={user.user.imageURL ? user.user.imageURL : ''} alt={user.user.firstName} />
                    <AvatarFallback>{user.user.firstName[0] + user.user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{user.user.firstName + user.user.lastName}</p>
                  </div>
                </div>
                
              ))}
              
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
