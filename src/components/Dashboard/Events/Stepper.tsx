'use client';
import React from 'react';
import { Stepper, Step, Typography } from '@material-tailwind/react';
import { Button } from '@/components/ui/button';

import {
  UserIcon,
  CalendarClock,
  Check,
  ChevronsUpDown,
  Banknote,
} from 'lucide-react';
import MaxWidthWrapper from '@/components/Layout/MaxWidthWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Separator } from '@/components/ui/separator';
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
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-dropdown-menu';
declare global {
  interface Window {
    initGooglePlaces: (form: any) => void;
  }
}

type FormFields =
  | 'accountName'
  | 'accountType'
  | 'accountPurpose'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phoneNumber'
  | 'dateOfBirth'
  | 'SSN'
  | 'streetAddress'
  | 'city'
  | 'state'
  | 'zipcode'
  |'payoutSchedule'
  |'accountNumber'
  | undefined;

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const FormSchema = z.object({
  accountName: z
    .string({
      required_error: 'Please enter a nickname for this account.',
    })
    .min(1, 'Please enter a nickname for this account.'),
  accountType: z
    .string({
      required_error: 'Please select an account type.',
    })
    .min(1, 'Please enter a nickname for this account.'),
  accountPurpose: z.string().min(1, 'Please describe the accounts purpose.'),
  firstName: z.string().min(1, 'Please enter your first name.'),
  lastName: z.string().min(1, 'Please enter your last name.'),
  email: z.string().email('Please enter a valid email address.'),
  phoneNumber: z
    .string()
    .regex(phoneRegex, 'Please Enter a valid phone number.'),
  dateOfBirth: z.string().min(1, 'Please enter your date of birth.'),
  SSN: z.string().min(1, 'Please enter your SSN.'),
  streetAddress: z.string().min(1, 'Please enter your street address.'),
  city: z.string().min(1, 'Please enter your city.'),
  state: z.string().min(1, 'Please enter your state.'),
  zipcode: z.string().min(1, 'Please enter your zipcode.'),
  payoutSchedule: z.string().min(1, 'Please select preferred payout schedule.'),
  accountNumber: z.string().min(1, 'Please enter your account number.'),
});

const accountTypes = [
  { label: 'Private', value: 'private' },
  { label: 'Public', value: 'public' },
];
const frequencies = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

export default function StepperForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    formState: { errors, isValid },
  } = form;

  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Regular Pool Cleaning',
      href: '/services/regular-cleaning',
      description:
        'Routine cleaning services including skimming, vacuuming, and brushing to keep your pool pristine.',
    },
    {
      title: 'Chemical Balancing',
      href: '/services/chemical-balancing',
      description:
        'Expert testing and adjustment of pool water chemicals to ensure a safe and balanced swimming environment.',
    },
    {
      title: 'Algae Treatment',
      href: '/services/algae-treatment',
      description:
        'Effective solutions for algae removal and prevention, keeping your pool clean and clear.',
    },
    {
      title: 'Tile and Deck Cleaning',
      href: '/services/tile-deck-cleaning',
      description:
        'Specialized cleaning for pool tiles and decks to remove dirt, grime, and mildew, ensuring a spotless pool area.',
    },
    {
      title: 'Pool Opening & Closing',
      href: '/services/opening-closing',
      description:
        'Seasonal services to prepare your pool for the summer and winterize it for the off-season.',
    },
  ];
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    service: '',
  });

  const stepFields: FormFields[][] = [
    ['accountName', 'accountType'], // Fields for step 0
    [
      'accountPurpose',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'dateOfBirth',
      'SSN',
      'streetAddress',
      'city',
      'state',
      'zipcode',
    ], // Fields for step 1
    ['payoutSchedule', 'accountNumber'], // Fields for step 2
  ];

  const handleNext = async (step?: number) => {
    const currentFields = stepFields[activeStep] as Array<
      keyof typeof FormSchema.shape
    >;
    const isStepValid = await form.trigger(currentFields);

    if (!isStepValid) {
      step ? setActiveStep(step) : setActiveStep((cur) => cur + 1);
    } else {
      toast({
        title: 'Oops, something went wrong!',
        description: <p>Please correct the errors before proceeding. </p>,
      });
    }
  };
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = {
      ...data,
    };
  }

  return (
    <MaxWidthWrapper>
      <div className='px-2 py-2'>
        <Stepper
          activeLineClassName='bg-green-700'
          placeholder='false'
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
        >
          <Step
            activeClassName='bg-green-700 items-center justify-center'
            completedClassName='bg-green-700 items-center justify-center'
            placeholder='false'
            onClick={() => setActiveStep(0)}
          >
            <Banknote className='h-5 w-5' />
            <div className='absolute -bottom-[2.5rem] w-max text-center'>
              <Typography
                placeholder='false'
                variant='h6'
                color={activeStep === 0 ? 'green' : 'gray'}
                className='hidden md:block'
              >
                Basics
              </Typography>
            </div>
          </Step>
          <Step
            activeClassName='bg-green-700 items-center justify-center'
            completedClassName='bg-green-700 items-center justify-center'
            placeholder='false'
            onClick={() => (activeStep === 2 ? handlePrev() : handleNext(1))}
          >
            <UserIcon className='h-5 w-5' />
            <div className='absolute -bottom-[2.5rem] w-max text-center'>
              <Typography
                placeholder='false'
                variant='h6'
                color={activeStep === 1 ? 'green' : 'gray'}
                className='hidden md:block'
              >
                Account Information
              </Typography>
            </div>
          </Step>
          <Step
            activeClassName='bg-green-700 items-center justify-center'
            completedClassName='bg-green-700 items-center justify-center'
            placeholder='false'
            onClick={() => handleNext(2)}
          >
            <CalendarClock className='h-5 w-5' />
            <div className='absolute -bottom-[2.5rem] w-max text-center'>
              <Typography
                placeholder='false'
                variant='h6'
                color={activeStep === 2 ? 'green' : 'gray'}
                className='hidden md:block'
              >
                Date & Time
              </Typography>
            </div>
          </Step>
        </Stepper>
        <div className='mt-10 py-5 flex flex-col items-center'>
          <>
            <Separator className='my-4 mx-2 ' />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full space-y-6 flex items-center justify-center'
              >
                {activeStep === 0 ? (
                  <div className='flex flex-col -mx-4 rounded-md w-3/4 text-center gap-2 min-h-[475px]'>
                    <h2 className='text-2xl font-bold'>
                      Payout account Information
                    </h2>
                    <div className='px-4 mt-6 mb-2'>
                      <FormField
                        control={form.control}
                        name='accountName'
                        defaultValue=''
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full mt-0'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Account Nickname
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='My payout account'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />

                              <FormDescription className='text-left mt-2'>
                                The account name is never exposed to the
                                receiver. It makes it easy for you to recognize
                                multiple payout accounts.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='px-4 mt-6 mb-2'>
                      <FormField
                        control={form.control}
                        name='accountType'
                        defaultValue=''
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full mt-0'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Account Type
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2 ml-8'>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-[200px] justify-between',
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field.value
                                        ? accountTypes.find(
                                            (type) => type.value === field.value
                                          )?.label
                                        : 'Select Type'}
                                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className='w-[200px] p-0'>
                                  <Command>
                                    <CommandEmpty>
                                      No language found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {accountTypes.map((type) => (
                                        <CommandItem
                                          value={type.label}
                                          key={type.value}
                                          onSelect={() => {
                                            form.setValue(
                                              'accountType',
                                              type.value
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              type.value === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {type.label}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />

                              <FormDescription className='text-left mt-2'>
                                Choose private if the collected money should be
                                transferred to your personal bank account.
                                Choose company If the money should be
                                transferred to an account belonging to a company
                                or organization.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                {activeStep === 1 ? (
                  <>
                    <div className='flex flex-col items-center min-h-[475px] '>
                      <h2 className='text-2xl font-bold'>
                        Account Information
                      </h2>

                      <FormField
                        control={form.control}
                        name='accountPurpose'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-8'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Account purpose
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Textarea
                                  placeholder='Training and participation fees for XYZ Team'
                                  className='resize-none'
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage className='text-left mt-2' />
                              <FormDescription className='text-left mt-2'>
                                For legal reasons, Stripe is required to know
                                the intended purpose of this account.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              First Name
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='Enter your first name'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Last Name
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='Enter your last name'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Email
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  type='email'
                                  placeholder='Enter your email'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Phone Number
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  type='tel'
                                  placeholder='Enter your phone number'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='dateOfBirth'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Date of Birth
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  type='date'
                                  placeholder='Select your date of birth'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='SSN'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Last Four of SSN
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <div className='flex flex-row items-center align-middle h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300'>
                                  <Label className='text-gray-500 flex items-center align-middle h-10'>
                                    <span className='text-xl mt-0.5'>
                                      &#x2022;&#x2022;&#x2022;
                                    </span>{' '}
                                    -{' '}
                                    <span className='text-xl mt-0.5'>
                                      &#x2022;&#x2022;
                                    </span>{' '}
                                    -{' '}
                                    <input
                                      className='focus-visible:outline-none focus-visible:ring-none m;-0.5'
                                      placeholder='XXXX'
                                      {...field}
                                    />
                                  </Label>
                                </div>
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='streetAddress'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Street Address
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='Enter your street address'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='city'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              City
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='Enter your city'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='state'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              State
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='Enter your state'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='zipcode'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Zip Code
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='Enter your zip code'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : null}

                {activeStep === 2 ? (
                <div>
<FormField
                        control={form.control}
                        name='payoutSchedule'
                        defaultValue=''
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full mt-0'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Payout Schedule
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2 ml-8'>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-[200px] justify-between',
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field.value
                                        ? frequencies.find(
                                            (frequency) => frequency.value === field.value
                                          )?.label
                                        : 'Select Frequency'}
                                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className='w-[200px] p-0'>
                                  <Command>
                                    
                                    <CommandGroup>
                                      {frequencies.map((frequency) => (
                                        <CommandItem
                                          value={frequency.label}
                                          key={frequency.value}
                                          onSelect={() => {
                                            form.setValue(
                                              'payoutSchedule',
                                              frequency.value
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              frequency.value === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {frequency.label}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />

                              <FormDescription className='text-left mt-2'>
                                Choose private if the collected money should be
                                transferred to your personal bank account.
                                Choose company If the money should be
                                transferred to an account belonging to a company
                                or organization.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

<FormField
                        control={form.control}
                        name='zipcode'
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-start w-full my-4'>
                            <FormLabel className='min-w-fit mr-6 mt-6'>
                              Zip Code
                            </FormLabel>
                            <div className='flex flex-col justify-center items-start w-full mb-2'>
                              <FormControl>
                                <Input
                                  placeholder='Enter your zip code'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-left mt-2' />
                            </div>
                          </FormItem>
                        )}
                      />
                </div>
                ) : null}
              </form>
            </Form>
          </>
        </div>
        <div className='mt-32 flex justify-between'>
          <Button onClick={handlePrev} disabled={isFirstStep}>
            Prev
          </Button>
          <Button
            className={cn(isLastStep ? 'hidden' : '')}
            onClick={() => handleNext()}
            disabled={isLastStep}
          >
            Next
          </Button>
          <Button
            className={cn(isLastStep ? '' : 'hidden')}
            onClick={form.handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
