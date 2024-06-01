import { ExtendedUser } from '@/types/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
import { format } from 'date-fns';
import { CalendarIcon, TrashIcon } from 'lucide-react';

const pollFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  options: z.array(
    z.object({
      option: z.string().min(2, {
        message: 'Option must be at least 2 characters.',
      }),
    })
  ),
  hideVotes: z.boolean().optional(),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  allowComments: z.boolean().optional(),
});

type PollFormValues = z.infer<typeof pollFormSchema>;

interface CreatePollFormProps {
  setPollFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: ExtendedUser;
  groupId: string;
}

const CreatePollForm = ({ user, setPollFormOpen, groupId }: CreatePollFormProps) => {
  const [inputOpen, setInputOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    postBody: '',
  });

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    mode: 'onChange',
    defaultValues: {
      options: [{ option: '' }, { option: '' }],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const addPoll = trpc.createPoll.useMutation();
  function onSubmit(data: PollFormValues) {
    const formData = {
      ...data,
      groupId,
    };

    addPoll.mutate(formData, {
      onSuccess: () => {
        toast({
          title: 'Poll created',
          description: 'Your poll has been created successfully.',
        })
        setPollFormOpen(false);
      },
      onError: (error: any) => {
        toast({
          title: 'Oops, Something went wrong!',
          description: 'Try reloading the page and try again.',
          
        })
      },
    
    })

  }

  return (
    <div className='max-w-xl p-6 bg-white rounded-lg shadow-sm mb-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>Create poll in Test Group</h3>
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
                    <Input placeholder='Write a question...' {...field} />
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
                    <Textarea placeholder='Description (optional)' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id} className='flex items-center space-x-3'>
                <div className='flex flex-col items-start space-y-1 w-full'>
                  <Label>Option {index + 1}</Label>
                  <Input
                    placeholder='Add an option'
                    {...form.register(`options.${index}.option` as const)}
                  />
                </div>

                <Button
                  className='mt-4'
                  variant='ghost'
                  type='button'
                  onClick={() => remove(index)}
                >
                  <TrashIcon className='h-5 w-5 text-red-400' />
                  <span className='sr-only'>Remove option</span>
                </Button>
                {errors.options && errors.options[index] && (
                  <p className='text-red-500'>
                    {errors.options[index]?.message}
                  </p>
                )}
              </div>
            ))}
            <Button
              variant='secondary'
              type='button'
              onClick={() => append({ option: '' })}
              className='my-2 w-full self-center'
            >
              + Add option
            </Button>

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
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The poll will close at the end of the day on the selected
                    date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center space-x-2'>
              <Checkbox id='hide-votes' />
              <Label htmlFor='hide-votes'>Hide votes</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox className='data-[state=checked]:bg-green-900' id='allow-comments' defaultChecked />
              <Label htmlFor='allow-comments'>Allow comments</Label>
            </div>
          </div>
          <div className='flex w-full items-end justify-end'>
            <Button className='mt-6 bg-green-900'>Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePollForm;
