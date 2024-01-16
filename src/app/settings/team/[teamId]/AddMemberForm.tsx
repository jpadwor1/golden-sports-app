'use client';
import React from 'react';
import { addUser } from '@/lib/actions';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/client';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { set } from 'date-fns';

const addMemberSchema = z.object({
  member: z.array(
    z.object({
      name: z.string().min(1, "Member's name is required"),
      email: z.string().email(),
    })
  ),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

interface AddMemberForm {
  teamId: string;
}

const AddMemberForm = ({ teamId }: AddMemberForm) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    mode: 'onChange',
    defaultValues: {
      member: [{ name: '', email: '' }],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'member',
  });

  const addMember = trpc.addTeamMember.useMutation();
  const sendInvitationEmail = trpc.sendInvitationEmail.useMutation();
  const onSubmit = async (data: AddMemberFormValues) => {
    setIsLoading(true);
    const formData = {
      ...data,
      teamId: teamId,
    };

    addMember.mutate(formData, {
      onSuccess: async () => {
        toast({
          title: 'Member Added Successfully',
          description: `Member has been added to the team.`,
        });
        sendInvitationEmail.mutate(formData, {
          onSuccess: () => {
            router.push(`/settings/team`);
            setIsLoading(false);
          },
          onError: (error: any) => {
            toast({
              title: 'Error',
              description: error.message,
            });
          },
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message,
        });
        setIsLoading(false);
      },
    });
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='my-10'>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className='flex flex-row gap-3 items-center justify-center'
          >
            <div className='flex flex-col items-start w-full my-4'>
              <Input
                placeholder={`Member ${index + 1} Full Name`}
                {...form.register(`member.${index}.name` as const)}
              />
              <Label className='text-gray-400 mt-2 font-normal'>
                This should be the members full name.
              </Label>
            </div>
            <Controller
              name={`member.${index}.email` as const}
              control={control}
              render={({ field }) => (
                <div className='flex flex-col items-start w-full my-4'>
                  <Input placeholder={`Member ${index + 1} Email`} {...field} />
                  {errors.member && errors.member[index]?.email ? (
                    <Label className='text-red-500 mt-2'>
                      {errors.member[index]?.email?.message}
                    </Label>
                  ) : (
                    <Label className='text-gray-400 mt-2 font-normal'>
                      Ensure this is the members primary email.
                    </Label>
                  )}
                </div>
              )}
            />
            <Button
              className='mb-5'
              variant='ghost'
              size='sm'
              type='button'
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <div className='flex flex-row justify-between mt-8'>
          <Button
            type='button'
            onClick={() => append({ name: '', email: '' })}
            className='bg-blue-600 hover:bg-blue-400'
          >
            Add Additional Members
          </Button>

          <Button size='sm'>
            {isLoading ? (
              <Loader2 className='animate-spin h-4 w-4' />
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddMemberForm;
