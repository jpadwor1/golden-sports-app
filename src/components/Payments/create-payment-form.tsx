import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { ExtendedUser } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { MultiSelect } from 'react-multi-select-component';
import * as z from 'zod';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const paymentFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  basePrice: z.string(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface CreatePaymentFormProps {
  setPaymentFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: ExtendedUser;
  groupId: string;
}

type Option = {
  label: string;
  value: string;
};

const CreatePaymentForm = ({
  user,
  setPaymentFormOpen,
  groupId,
}: CreatePaymentFormProps) => {
  const router = useRouter();
  const [transactionFeeDetails, setTransactionFeeDetails] =
    React.useState<boolean>(false);
  const [teamMembers, setTeamMembers] = React.useState<Option[]>([]);
  const [invitees, setInvitees] = React.useState<Option[]>([]);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const { data, isLoading } = trpc.getGroup.useQuery(groupId);
  const group = data;
  const members = group?.members;
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    mode: 'onChange',
    defaultValues: {},
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (members) {
      const newMembers: Option[] = members.map((member: ExtendedUser) => ({
        label: member.firstName + ' ' + member.lastName,
        value: member.id,
      }));
      setTeamMembers(newMembers);
    }
  }, [members]);

  const basePrice = parseFloat(form.watch('basePrice'));

  React.useEffect(() => {
    const calculateTransactionFee = () => {
      if (transactionFeeDetails) {
        const fee = basePrice * 0.05 + 1;
        setTotalPrice(basePrice + fee);
      } else {
        setTotalPrice(basePrice);
      }
    };
    calculateTransactionFee();
  }, [basePrice, transactionFeeDetails, form]);


  const addPayment = trpc.createPayment.useMutation();
  function onSubmit(data: PaymentFormValues) {
    const formData = {
      ...data,
      groupId,
      dueDate: data.dueDate.toString(),
      totalPrice: totalPrice,
      basePrice: parseFloat(data.basePrice),
      invitees: invitees.map((invitee) => invitee.value),
      addTransactionFee: transactionFeeDetails,
    };
    addPayment.mutate(formData, {
      onSuccess: () => {
        toast({
          title: 'Payment created',
          description: 'Your payment has been created successfully.',
        });
        setPaymentFormOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        console.error(error);
        toast({
          title: 'Oops, Something went wrong!',
          description: 'Try reloading the page and try again.',
          variant: 'destructive',
        });
      },
    });
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='max-w-xl p-6 bg-white rounded-lg shadow-sm mb-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>
          Create payment in {group.name + ' ' + group.description}
        </h3>
        <Button
          onClick={() => setPaymentFormOpen(false)}
          variant='ghost'
          className='text-sm'
        >
          ✕
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                    className='mb-6'
                      placeholder='Tell more about the payment request (optional)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-6'>
            <FormLabel>Attendees</FormLabel>
            <MultiSelect
              className='w-full'
              options={teamMembers}
              value={invitees}
              onChange={setInvitees}
              labelledBy='Select Members'
            />
            </div>
            

            <FormField
              control={form.control}
              name='dueDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The payment will be due at the end of the day on the
                    selected date. Members can still make payments after the due
                    date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='basePrice'
              render={({ field }) => (
                <FormItem className='mt-8'>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input
                      min={2}
                      max={500}
                      type='number'
                      placeholder='Base Price'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        onClick={() => {
                          setTransactionFeeDetails(!transactionFeeDetails);
                        }}
                        id='hide-votes'
                      />
                      <Label htmlFor='hide-votes'>
                        Add transaction fee to price
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className='w-4 h-4' />
                          </TooltipTrigger>
                          <TooltipContent align='end'>
                            <p className='max-w-[225px]'>
                              By default the transaction fee is added to the
                              price. This means that the payers will cover the
                              fee. The payers will not see the fee, they will
                              only see the total price including the fee. If you
                              choose to cover the transaction fee yourself, the
                              fee will automatically be deducted before you
                              receive money from the payors.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                 
          
            {transactionFeeDetails && form.getValues('basePrice') ? (
              <div className='flex flex-col items-start space-y-2 border p-6'>
                <div className='flex flex-row justify-between items-center w-full'>
                  <Label className='font-normal'>You will receive</Label>
                  <span>
                    ${parseFloat(form.getValues('basePrice')).toFixed(2)}
                  </span>
                </div>
                <div className='flex flex-row justify-between items-center w-full'>
                  <Label className='font-normal'>Transaction Fee</Label>
                  <span>
                    $
                    {(
                      parseFloat(form.getValues('basePrice')) * 0.05 +
                      1
                    ).toFixed(2)}
                  </span>
                </div>
                <div className='flex flex-row justify-between items-center w-full'>
                  <Label className='font-medium'>Total Price</Label>
                  <span className='font-medium'>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ) : null}
          </div>
          <div className='flex w-full items-end justify-end'>
            <Button className='mt-6 bg-green-900'>Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePaymentForm;
