import React, { FormEvent } from 'react';
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
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface EventFeeDialogProps {
  open: boolean;
  setFeeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setFeeData: React.Dispatch<
    React.SetStateAction<{
      fee: number;
      feeDescription: string;
      feeServiceCharge: boolean;
    }>
  >;
  feeData: {
    fee: number;
    feeDescription: string;
    feeServiceCharge: boolean;
  };
}
const EventFeeDialog = ({
  open,
  setFeeDialogOpen,
  loading,
  setFeeData,
  feeData
}: EventFeeDialogProps) => {
  const [fee, setFee] = React.useState<number>(feeData.fee || 0);
  const [feeDescription, setFeeDescription] = React.useState<string>(feeData.feeDescription || '');
  const [feeServiceCharge, setFeeServiceCharge] =
    React.useState<boolean>(feeData.feeServiceCharge || false);

  const setEventFee = () => {
    setFeeData({
      fee,
      feeDescription,
      feeServiceCharge,
    });
    console.log(feeData);
    setFeeDialogOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader className=''>
          <DialogTitle>Add a fee for this event</DialogTitle>
          <DialogDescription>
            Each attendee will be charged this fee when they register for this
            event.
          </DialogDescription>
        </DialogHeader>
        <form className='flex flex-col space-y-4'>
          <Label htmlFor='feeDescription'>Fee Description</Label>
          <Input
            required
            name='feeDescription'
            placeholder='Fee Description'
            defaultValue={feeDescription}
            maxLength={100}
            onChange={(e) => setFeeDescription(e.target.value)}
          />
          <Label htmlFor='fee'>Fee</Label>
          <Input
            required
            type='number'
            name='fee'
            placeholder='$100.50'
            defaultValue={fee}
            onChange={(e) => setFee(parseFloat(e.target.value))}
          />
          <div className='flex items-center space-x-2'>
            <Checkbox
              name='feeServiceCharge'
              checked={feeServiceCharge}
              onCheckedChange={(checked) =>
                setFeeServiceCharge(
                  checked === true || checked === false ? checked : false
                )
              }
            />
            <Label htmlFor='feeServiceCharge'>
              Check if you would you like to charge the attendee the service
              fee?
            </Label>
          </div>
        </form>
        <DialogFooter className='mt-10'>
          <DialogClose>
            <div
              onClick={() => setFeeDialogOpen(false)}
              className={cn(buttonVariants({ variant: 'ghost' }), 'mr-10')}
            >
              Cancel
            </div>
          </DialogClose>
          <Button type='button' onClick={setEventFee}>
            {loading ? (
              <>
                <Loader2 className='h-4 w-4 text-white animate-spin mr-2' />
                <p> Loading...</p>
              </>
            ) : (
              'Add Fee'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventFeeDialog;
