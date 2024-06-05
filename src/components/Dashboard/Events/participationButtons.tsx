'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import React from 'react';
import { IconCircleX, IconCircleCheck } from '@tabler/icons-react';
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
      <Button
        onClick={() => handleParticipation('ATTENDING')}
        className={cn(
          participationStatus === 'ATTENDING'
            ? 'bg-green-700 text-white'
            : 'bg-gray-300',
          'mr-2'
        )}
        variant='secondary'
      >
        <IconCircleCheck size={18} className='mr-1' stroke={2} />
        {participationStatus === 'ATTENDING' ? 'Attending' : 'Attend'}
      </Button>

      <Button
        onClick={() => handleParticipation('DECLINED')}
        variant='destructive'
        className={cn(
          participationStatus === 'DECLINED'
            ? 'bg-red-500 text-white'
            : 'bg-gray-300 text-black'
        )}
      >
        <IconCircleX size={18} className='mr-1' stroke={2} />
        {participationStatus === 'DECLINED' ? 'Declined' : 'Decline'}
      </Button>
    </div>
  );
};

export default ParticipationButtons;
