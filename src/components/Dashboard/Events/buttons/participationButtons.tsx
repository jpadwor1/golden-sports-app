'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import React from 'react';
import { IconCircleX, IconCircleCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import EventPaymentDialog from '../payment/event-payment-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExtendedEvent } from '@/types/types';
import { X } from 'lucide-react';

interface ParticipationButtonProps {
  userId: string | undefined;
  event: ExtendedEvent;
  participation: string | undefined;
}

const ParticipationButtons = ({
  userId,
  event,
  participation,
}: ParticipationButtonProps) => {
  const eventId = event.id;
  const router = useRouter();
  const [participationStatus, setParticipationStatus] =
    React.useState(participation);
  const updateParticipationStatus = trpc.updateParticipantStatus.useMutation();
  const [clientSecret, setClientSecret] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);

  const handleParticipation = async (status: string) => {
    const formData = {
      eventId: eventId,
      userId: userId as string,
      status: status,
    };

    const paymentData = {
      eventTitle: event.title,
      feeAmount: event.totalFeeAmount,
      eventId: eventId,
      returnUrl: `${window.location.href}?session_id={CHECKOUT_SESSION_ID}`,
      coachId: event.group.coachId,
    };
    if (event.feeAmount && event.feeAmount > 0 && status === 'ATTENDING') {
      try {
        const response = await fetch(
          '/api/event-payments/create-payment-intent',
          {
            method: 'POST',
            body: JSON.stringify({
              ...paymentData,
            }),
            headers: {
              'Content-Type': 'application/json',
              Signature: process.env.SECRET_TOKEN as string,
            },
          }
        );
        const clientSecret = await response.text();
        setClientSecret(clientSecret);

        setIsLoading(false);
        setPaymentDialogOpen(true);
      } catch (e: any) {
        console.error(e.message);
      }
    } else {
      updateParticipationStatus.mutate(formData, {
        onSuccess: () => {
          setParticipationStatus(status);
          router.refresh();
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: 'Oops, something went wrong!',
            description: 'Trying again later.',
          });
        },
      });
    }
  };

  const handleParticipationAfterPayment = async (status: string) => {
    const formData = {
      eventId: eventId,
      userId: userId as string,
      status: status,
    };
    updateParticipationStatus.mutate(formData, {
      onSuccess: () => {
        setParticipationStatus(status);
        router.refresh();
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
      {(event.feeAmount && event.feeAmount > 0) ? (
        <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={participationStatus === 'ATTENDING' || isLoading}
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
        </DialogTrigger>
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogClose asChild>
              <X className='h-6 w-6 self-end' />
          </DialogClose>
          <EventPaymentDialog
            clientSecret={clientSecret}
            setParticipationStatus={setParticipationStatus}
            handleParticipationAfterPayment={handleParticipationAfterPayment}
            eventId={eventId}
            userId={userId}
            open={paymentDialogOpen}
          />
        </DialogContent>
      </Dialog>
      ): (
        <Button
            disabled={participationStatus === 'ATTENDING' || isLoading}
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
      )}
      

      <Button
        disabled={participationStatus === 'DECLINED' || isLoading}
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
