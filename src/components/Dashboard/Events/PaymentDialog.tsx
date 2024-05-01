import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CircleDollarSign, Loader2 } from 'lucide-react';
import React from 'react';

interface PaymentDialogProps {
  open: boolean;
  loading: boolean;
  handleAccountCreation: () => void;
  setPaymentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlePayments: () => void;
  feeData: {
    fee: number;
    feeDescription: string;
    feeServiceCharge: boolean;
  };
}

const PaymentDialog = ({
  open,
  loading,
  handleAccountCreation,
  setPaymentDialogOpen,
  handlePayments,
  feeData,
}: PaymentDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogTrigger>
        <div
          onClick={handlePayments}
          className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 mt-4 hover:cursor-pointer hover:shadow-sm hover:bg-gray-50'
        >
          <CircleDollarSign className='h-6 w-6 text-green-700' />
          {feeData.fee === 0 ? (
            <p>Registration Fee</p>
          ) : (
            <p>Registration Fee: ${feeData.fee}</p>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className=''>
          <DialogTitle>Create a payout method</DialogTitle>
          <DialogDescription>
            To collect money you need to have a payout method. The payout method
            is used to transfer money to you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-10'>
          <DialogClose>
            <div
              onClick={() => setPaymentDialogOpen(false)}
              className={cn(buttonVariants({ variant: 'ghost' }), 'mr-10')}
            >
              Cancel
            </div>
          </DialogClose>
          <Button type='button' onClick={() => handleAccountCreation()}>
            {loading ? (
              <>
                <Loader2 className='h-4 w-4 text-white animate-spin mr-2' />
                <p> Loading...</p>
              </>
            ) : (
              'Create Payout Method'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
