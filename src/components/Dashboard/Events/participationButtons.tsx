'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

interface ParticipationButtonProps {
  userId: string | undefined;
  eventId: string;
  participation: string | undefined;
}

const ParticipationButtons = ({
  userId,
  eventId,
  participation,
}: ParticipationButtonProps) => {
  const [participationStatus, setParticipationStatus] =
    React.useState(participation);
  const updateParticipationStatus = trpc.updateParticipantStatus.useMutation();
  const handleParticipation = async (status: string) => {
    const formData = {
      eventId: eventId,
      userId: userId as string,
      status: status,
    };
    updateParticipationStatus.mutate(formData, {
      onSuccess: () => {
        setParticipationStatus(status);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: 'Oops, something went wrong!',
          description: 'Trying again later.',
        });
      },
    });
  };
  return (
    <div className='flex'>
      {participationStatus === 'ATTENDING' ? (
        <p className='mr-2 self-center text-sm'>You are attending</p>
      ) : (
        <Button
          onClick={() => handleParticipation('ATTENDING')}
          className='mr-2'
          variant='secondary'
        >
          Accept
        </Button>
      )}

      {participationStatus === 'DECLINED' ? (
        <p className='mr-2 self-center text-sm'>You have declined</p>
      ) : (
        <Button
          onClick={() => handleParticipation('DECLINED')}
          variant='destructive'
        >
          Decline
        </Button>
      )}
    </div>
  );
};

export default ParticipationButtons;
