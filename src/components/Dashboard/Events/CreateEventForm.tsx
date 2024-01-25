import { trpc } from '@/app/_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { CircleDollarSign, File, Link2, Plus, Trash } from 'lucide-react';
import { MultiSelect } from 'react-multi-select-component';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

interface CreateEventFormProps {
  user: {
    groupsAsCoach: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
    groupsAsMember: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
  } & User;
}

const eventFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  startDateTime: z.string().min(1, { message: 'Date is required' }),
  endDateTime: z.string().optional(),
  invitees: z.array(z.string()).optional(),
  notificationDate: z.string().default('immediately'),
  reminders: z.boolean().default(false).optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

type Option = {
  label: string;
  value: string;
};

declare global {
  interface Window {
    initGooglePlaces: (form: any) => void;
  }
}

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

const options = ['john', 'jared'];

const CreateEventForm = ({ user }: CreateEventFormProps) => {
  const router = useRouter();
  const [inputOpen, setInputOpen] = React.useState(false);
  const [endTimeInput, setEndTimeInput] = React.useState(false);
  const [groupId, setGroupId] = React.useState('');
  const [invitees, setInvitees] = React.useState<Option[]>([]);
  const [teamMembers, setTeamMembers] = React.useState<Option[]>([]);
  const [fetchTeamMembers, setFetchTeamMembers] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);

  
  const [files, setFiles] = React.useState<File[]>([]);

  const [formData, setFormData] = React.useState({
    postBody: '',
    groupId: '',
  });
  const ref = React.useRef<HTMLDivElement>(null);
  const TextAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const userGroups = [...user.groupsAsCoach, ...user.groupsAsMember];
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: members, isLoading } = trpc.getTeamMembers.useQuery(
    { groupId: groupId },
    {
      enabled: fetchTeamMembers,
    }
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the clicked area is outside the ref and not part of the select component
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.select-class')
      ) {
        setInputOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  React.useEffect(() => {
    if (inputOpen && TextAreaRef.current) {
      TextAreaRef.current.focus();
    }
  }, [inputOpen]);

  const addressInputRef = React.useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    React.useState<google.maps.places.Autocomplete | null>(null);
  const onAddressInputMount = mergeRefs(
    addressInputRef,
    form.register('address').ref
  );

  React.useEffect(() => {
    loadGooglePlacesScript(() => initGooglePlaces(form));
  }, [form]);

  React.useEffect(() => {
    if (groupId) {
      setFetchTeamMembers(true);
    }
  }, [groupId]);

  React.useEffect(() => {
    if (members) {
      const newMembers: Option[] = members.map((member) => ({
        label: member.name,
        value: member.id,
      }));
      setTeamMembers(newMembers);
    }
  }, [members]);

  const handleAttachments = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        newFiles.push(files[i]);
      }
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handlePayments = () => {
    if (!user.paymentsSetup){
      setPaymentDialogOpen(true);
    }
  }

  const onSubmit = () => {
    if (TextAreaRef.current) {
      const newFormData = {
        postBody: TextAreaRef.current.value,
        groupId: groupId,
      };
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          ref={ref}
          className='flex flex-col w-full bg-white shadow-sm rounded-md items-center justify-center mb-6'
        >
          <div className='flex flex-row items-start w-full p-4'>
            <Avatar>
              <AvatarImage
                src={user.imageURL ? user.imageURL : ''}
                alt='profile pic'
              />
              <AvatarFallback>
                {user.name.split(' ').map((name) => name[0])}
              </AvatarFallback>
            </Avatar>
            <Select
              onValueChange={(value) => setGroupId(value)}
              className='select-class'
            >
              <SelectTrigger
                className={cn(
                  'w-[250px] text-xs ml-4 select-class focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0'
                )}
              >
                <SelectValue placeholder='Pick a Team to Schedule Event' />
              </SelectTrigger>
              <SelectContent className='select-class focus-visible:ring-0'>
                {userGroups.map((group) => (
                  <SelectItem
                    className='select-class focus-visible:ring-0'
                    key={group.id}
                    value={group.id}
                    onChange={(value) => setGroupId(group.id)}
                  >
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            className={cn(
              'flex flex-col w-full px-6 h-30 min-h-fit transition-all duration-100 ease-in-out mb-6'
            )}
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Title of event' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Provide some details about the event.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Place</FormLabel>
                  <FormControl>
                    <Input
                      ref={onAddressInputMount}
                      id='address'
                      defaultValue={field.value}
                      onChange={field.onChange} // Bind the onChange event
                      onBlur={field.onBlur} // Bind the onBlur event
                      placeholder="Where's the event?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-wrap items-end gap-2 mt-3'>
              <FormField
                control={form.control}
                name='startDateTime'
                render={({ field }) => (
                  <FormItem className='mt-4'>
                    <FormLabel>
                      {endTimeInput ? 'Start Time' : 'Event Time'}
                    </FormLabel>
                    <FormControl>
                      <input
                        className='flex h-10 w-full rounded-md border border-gray-200 bg-white px-0.5 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300'
                        type='datetime-local'
                        placeholder='Title of event'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!endTimeInput && (
                <div
                  onClick={() => setEndTimeInput(true)}
                  className='flex flex-row items-center mb-3 ml-2'
                >
                  <Plus className='h-4 w-4 text-green-700' />
                  <p className='text-xs'>Add end time</p>
                </div>
              )}

              {endTimeInput && (
                <FormField
                  control={form.control}
                  name='endDateTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <input
                          className='flex h-10 w-full rounded-md border border-gray-200 bg-white px-0.5 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300'
                          type='datetime-local'
                          placeholder='Title of event'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name='invitees'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Invitees</FormLabel>
                  <FormControl>
                    <MultiSelect
                      className='w-full'
                      options={teamMembers}
                      value={invitees}
                      onChange={setInvitees}
                      labelledBy='Select Chemicals'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notificationDate'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Send Invite</FormLabel>
                  <FormControl>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-200 bg-white px-0.5 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300'
                      type='datetime-local'
                      placeholder='Immediately'
                      defaultValue='immediately'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='reminders'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-x-3 space-y-0 mt-6'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      Would you like to send automatic reminders?
                    </FormLabel>
                    <FormDescription>
                      Reminders are sent 72 and 24 hours before the event.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div
              onClick={handleAttachments}
              className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 mt-4 hover:cursor-pointer hover:shadow-sm hover:bg-gray-50'
            >
              <Link2 className='h-6 w-6 text-green-700' />
              <p>Attachments</p>
              <input
                type='file'
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
              />
            </div>

            <div
              onClick={handlePayments}
              className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 mt-4 hover:cursor-pointer hover:shadow-sm hover:bg-gray-50'
            >
              <CircleDollarSign className='h-6 w-6 text-green-700' />
              <p>Registration Fee</p>
            </div>

            {files.length > 0 && (
              <div className='grid grid-cols-1 gap-2'>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className='flex flex-row items-start border rounded-md p-2 my-2'
                  >
                    <File className='h-6 w-6 text-blue-600 mr-2' />
                    <p className='text-sm text-gray-500'>{file.name}</p>
                    <Trash
                      className='h-4 w-4 text-red-500 ml-auto hover:cursor-pointer self-center'
                      onClick={() => {
                        setFiles((prevFiles) =>
                          prevFiles.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className='flex flex-row justify-between mt-6'>
              <Button
                onClick={onSubmit}
                disabled={formData.postBody.length === 0}
                size='xs'
                className='self-end max-w-fit rounded-full bg-blue-600 disabled:bg-gray-200 hover:bg-blue-400 disabled:text-gray-600'
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateEventForm;