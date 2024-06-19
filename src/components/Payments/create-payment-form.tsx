import { ExtendedUser } from '@/types/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format, set } from 'date-fns';
import { CalendarIcon, TrashIcon, Info } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { MultiSelect } from 'react-multi-select-component';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const paymentFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  invitees: z.array(z.string()),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  basePrice: z
  .string()
  .refine((val) => !isNaN(parseFloat(val)), {
    message: 'Base price must be a valid number.',
  })
  .transform((val) => parseFloat(val))
  .refine((val) => val > 0, {
    message: 'Base price must be a positive number.',
  })
  .refine((val) => val >= 2, {
    message: 'Base price must be at least $2.',
  })
  .refine((val) => val <= 500, {
    message: 'Base price must be less than $500.',
  }),
  addTransactionFee: z.boolean(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface CreatePaymentFormProps {
  setPollFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: ExtendedUser;
  groupId: string;
}

type Option = {
  label: string;
  value: string;
};

const CreatePaymentForm = ({
  user,
  setPollFormOpen,
  groupId,
}: CreatePaymentFormProps) => {
  const [inputOpen, setInputOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    postBody: '',
  });
  const [transactionFeeDetails, setTransactionFeeDetails] = React.useState<boolean>(false)
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

  React.useEffect(() => {
    if (members) {
      const newMembers: Option[] = members.map((member: ExtendedUser) => ({
        label: member.firstName + ' ' + member.lastName,
        value: member.id,
      }));
      setTeamMembers(newMembers);
    }
  }, [members]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const calculateTransactionFee = () => {
    const basePrice = form.getValues('basePrice');
    const addTransactionFee = form.getValues('addTransactionFee');
    if (transactionFeeDetails) {
      setTotalPrice(basePrice + (basePrice * 0.05) + 1);
    } else {
      setTotalPrice(basePrice);
    }
  };
  const addPayment = trpc.createPayment.useMutation();
  function onSubmit(data: PaymentFormValues) {
    const formData = {
      ...data,
      groupId,
      dueDate: data.dueDate.toString(),
    };

    addPayment.mutate(formData, {
      onSuccess: () => {
        toast({
          title: 'Poll created',
          description: 'Your poll has been created successfully.',
        });
        setPollFormOpen(false);
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

  if(isLoading) return <div>Loading...</div>;

  return (
    <div className='max-w-xl p-6 bg-white rounded-lg shadow-sm mb-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>Create payment in {group.name + ' ' + group.description}</h3>
        <Button
          onClick={() => setPollFormOpen(false)}
          variant='ghost'
          className='text-sm'
        >
          ✕
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-5'>
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
                    <Textarea placeholder='Tell more about the payment request (optional)' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='invitees'
              render={({ field }) => (
                <FormItem className='mt-8'>
                  <FormLabel>Invitees</FormLabel>
                  <FormControl>
                    <MultiSelect
                      className='w-full'
                      options={teamMembers}
                      value={invitees}
                      onChange={setInvitees}
                      labelledBy='Select Members'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Input type='number' placeholder='Base Price' {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='addTransactionFee'
              render={({ field }) => (
                <FormItem className='mt-8'>
                  <FormControl>
                    <div  className='flex items-center space-x-2'>
                      <Checkbox onClick={() => {
                        setTransactionFeeDetails(!transactionFeeDetails);
                        calculateTransactionFee();
                      }} id='hide-votes' />
                      <Label {...field} htmlFor='hide-votes'>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {transactionFeeDetails && form.getValues('basePrice') ? (
              <div className='flex items-center space-x-2'>
                <Label>Base Price</Label>
                <span>${form.getValues('basePrice')}</span>
                <Label>Transaction Fee</Label>
                <span>${form.getValues('basePrice') * 0.05 + 1}</span>
                <Label>Total Price</Label>
                <span>${totalPrice}</span>
              </div>
            ):null}
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
