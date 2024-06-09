import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface EventPaymentDialogProps {
  clientSecret: string;
  setParticipationStatus: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  handleParticipationAfterPayment: (status: string) => void;
  eventId: string;
  userId: string | undefined;
  open: boolean;
}
const EventPaymentDialog = ({
  clientSecret,
  setParticipationStatus,
  handleParticipationAfterPayment,
  open,
}: EventPaymentDialogProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(open);
  const options = {
    clientSecret: clientSecret,
    onComplete: () => {
      setParticipationStatus('ATTENDING');
      handleParticipationAfterPayment('ATTENDING');
      setDialogOpen(false);
    },
  };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
    <EmbeddedCheckout />
  </EmbeddedCheckoutProvider>
    
  );
};

export default EventPaymentDialog;
