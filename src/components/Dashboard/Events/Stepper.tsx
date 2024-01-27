'use client';
import React from 'react';
import { Stepper, Step, Typography } from '@material-tailwind/react';
import { Button } from '@/components/ui/button';

import { CogIcon, UserIcon, CalendarClock } from 'lucide-react';
import MaxWidthWrapper from '@/components/Layout/MaxWidthWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    initGooglePlaces: (form: any) => void;
  }
}

type FormFields =
  | 'fullName'
  | 'email'
  | 'phoneNumber'
  | 'address'
  | 'service'
  | undefined;

const initGooglePlaces = (form: any) => {
  // Ensure that the Google Maps API script has loaded
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error('Google Maps API script not loaded');
    return;
  }

  // Select the input element for the address field
  const addressInput = document.getElementById('address') as HTMLInputElement;
  if (!addressInput) {
    console.error('Address input not found');
    return;
  }

  // Create a new instance of the Google Places Autocomplete
  const autocomplete = new google.maps.places.Autocomplete(addressInput, {
    types: ['address'],
  });

  // Add a listener for the 'place_changed' event
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    const address = place.formatted_address;
    if (address) {
      form.setValue('address', address, { shouldValidate: true });
    }
  });
};

const loadGooglePlacesScript = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    const isScriptLoaded = document.querySelector(
      "script[src*='maps.googleapis.com/maps/api/js']"
    );
    if (!isScriptLoaded) {
      window.initGooglePlaces = callback;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlaces`;
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      callback();
    }
  }
};

const mergeRefs = (...refs: React.Ref<any>[]) => {
  return (element: HTMLInputElement) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref != null) {
        (ref as React.MutableRefObject<HTMLInputElement>).current = element;
      }
    });
  };
};

const FormSchema = z.object({
  fullName: z.string({
    required_error: 'Please enter your full name.',
  }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  phoneNumber: z.string({
    required_error: 'Please enter your phone number.',
  }),
  address: z.string().min(1, 'Please enter your address.'),
  service: z.string().min(1, 'Please select a service.'),
});

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

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState('');
  const addressInputRef = React.useRef<HTMLInputElement>(null);
  const onAddressInputMount = mergeRefs(
    addressInputRef,
    form.register('address').ref
  );
  const availableTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];
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
    ['fullName', 'email', 'address', 'phoneNumber'], // Fields for step 0
    ['service'], // Fields for step 1
  ];
  React.useEffect(() => {
    loadGooglePlacesScript(() => initGooglePlaces(form));
  }, [form]);

  const handleNext = async () => {
    const currentFields = stepFields[activeStep] as Array<
      keyof typeof FormSchema.shape
    >;
    const isStepValid = await form.trigger(currentFields);

    if (isStepValid) {
      setActiveStep((cur) => cur + 1);
    } else {
      toast({
        title: 'Oops, something went wrong!',
        description: <p>Please correct the errors before proceeding. </p>,
      });
    }
  };
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const getCombinedDateTime = () => {
    if (!date || !selectedTime) return '';

    const timeParts = selectedTime.split(/[:\s]/); // Split time string into components
    const hours = timeParts[0];
    const minutes = timeParts[1];
    const meridian = timeParts[2];

    const dateTime = new Date(date);
    dateTime.setHours(
      meridian === 'PM' ? parseInt(hours) + 12 : parseInt(hours)
    ); // Adjust for AM/PM
    dateTime.setMinutes(parseInt(minutes));

    return dateTime.toISOString();
  };


  function onSubmit(data: z.infer<typeof FormSchema>) {
    const combinedDateTime = getCombinedDateTime();
    const formData = {
      ...data,
      nextServiceDate: combinedDateTime,
    };

    
  }

  return (
    <MaxWidthWrapper>
      <div className='px-2 py-4'>
        <Stepper
          activeLineClassName='bg-blue-500'
          placeholder='false'
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
        >
          <Step
            activeClassName='bg-blue-500'
            completedClassName='bg-blue-500'
            placeholder='false'
            onClick={() => setActiveStep(0)}
          >
            <UserIcon className='h-5 w-5' />
            <div className='absolute -bottom-[2.5rem] w-max text-center'>
              <Typography
                placeholder='false'
                variant='h6'
                color={activeStep === 0 ? 'blue' : 'gray'}
                className='hidden md:block'
              >
                Contact Information
              </Typography>
            </div>
          </Step>
          <Step
            activeClassName='bg-blue-500'
            completedClassName='bg-blue-500'
            placeholder='false'
            onClick={() => setActiveStep(1)}
          >
            <CogIcon className='h-5 w-5' />
            <div className='absolute -bottom-[2.5rem] w-max text-center'>
              <Typography
                placeholder='false'
                variant='h6'
                color={activeStep === 1 ? 'blue' : 'gray'}
                className='hidden md:block'
              >
                Service
              </Typography>
            </div>
          </Step>
          <Step
            activeClassName='bg-blue-500'
            completedClassName='bg-blue-500'
            placeholder='false'
            onClick={() => setActiveStep(2)}
          >
            <CalendarClock className='h-5 w-5' />
            <div className='absolute -bottom-[2.5rem] w-max text-center'>
              <Typography
                placeholder='false'
                variant='h6'
                color={activeStep === 2 ? 'blue' : 'gray'}
                className='hidden md:block'
              >
                Date & Time
              </Typography>
            </div>
          </Step>
        </Stepper>
        <div className='mt-20 py-5 flex flex-col items-center'>
          <>
            <Separator className='my-4 mx-2 ' />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full space-y-6'
              >
                {activeStep === 0 ? (
                  <div className='flex flex-col -mx-4 mb-8 rounded-md w-full text-center gap-2'>
                    <h2 className='text-2xl font-bold'>
                      Enter Your Contact Information
                    </h2>
                    <div className='px-4 mt-6 mb-2'>
                      <FormField
                        control={form.control}
                        name='fullName'
                        defaultValue=''
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-center w-full mt-0'>
                            <FormLabel className='min-w-fit mr-2 mt-2'>
                              Full Name
                            </FormLabel>
                            <div className='flex flex-col justify-center items-center w-full mb-2'>
                              <FormControl>
                                <Input placeholder='Full Name' {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='px-4 my-2 flex flex-row items-center text-center align-middle '>
                      <FormField
                        control={form.control}
                        name='address'
                        defaultValue=''
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-center w-full mt-0'>
                            <FormLabel className='min-w-fit mr-2 mt-2'>
                              Home Address
                            </FormLabel>
                            <div className='flex flex-col justify-center items-center w-full'>
                              <FormControl>
                                <Input
                                  ref={onAddressInputMount}
                                  id='address'
                                  name='address'
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  placeholder='12348 Express Way'
                                  value={field.value}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='px-4 my-2 flex flex-row items-center text-center align-middle '>
                      <FormField
                        control={form.control}
                        name='email'
                        defaultValue=''
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-center w-full mt-0'>
                            <FormLabel className='min-w-fit mr-2 mt-2'>
                              Email Address
                            </FormLabel>
                            <div className='flex flex-col justify-center items-center w-full'>
                              <FormControl>
                                <Input
                                  placeholder='john@alwaysclean.com'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='px-4 my-2 flex flex-row items-center text-center align-middle '>
                      <FormField
                        control={form.control}
                        name='phoneNumber'
                        defaultValue=''
                        render={({ field }) => (
                          <FormItem className='flex flex-row justify-center items-center w-full mt-0'>
                            <FormLabel className='min-w-fit mr-2 mt-2'>
                              Phone Number
                            </FormLabel>
                            <div className='flex flex-col justify-center items-center w-full'>
                              <FormControl>
                                <Input placeholder='760-912-7396' {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                {activeStep === 1 ? (
                  <>
                    <div className='flex flex-col items-center'>
                      <h2 className='text-2xl font-bold'>Select a Service</h2>
                      <FormField
                        control={form.control}
                        name='service'
                        render={({ field }) => (
                          <FormItem className='w-1/2 mt-2'>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a service' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {components.map((component) => (
                                  <SelectItem
                                    onChange={() =>
                                      setFormData({
                                        ...formData,
                                        service: component.title,
                                      })
                                    }
                                    value={component.title}
                                    key={component.title}
                                  >
                                    {component.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : null}

                {activeStep === 2 ? (
                  <div className='flex flex-col items-center px-4'>
                    <div className='flex flex-col items-center px-4'>
                      <h2 className='text-2xl font-bold'>
                        Select a date and time
                      </h2>
                    </div>
                    <Separator className='my-1 mx-2 w-[50%]' />

                    <div className='flex md:flex-row flex-col items-center px-4 py-4 gap-4'>
                      <div className='flex flex-col items-center'>
                        <Calendar
                          mode='single'
                          selected={date}
                          onSelect={setDate}
                          className='rounded-md'
                        />
                      </div>
                      <div className='flex flex-col items-center mt-2'>
                        <h3 className='text-lg font-semibold'>
                          {date
                            ? format(date, 'EEEE, d MMMM')
                            : 'No date selected'}
                        </h3>

                        <div className='grid grid-cols-2 gap-2'>
                          {availableTimes.map((time) => (
                            <Button
                              type='button'
                              onClick={() => handleTimeSelect(time)}
                              key={time}
                              className={cn(
                                selectedTime === time
                                  ? 'bg-primary text-white'
                                  : 'bg-transparent text-slate-600',
                                ' hover:text-white border rounded-md px-4 py-2 my-2'
                              )}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
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
            onClick={handleNext}
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
