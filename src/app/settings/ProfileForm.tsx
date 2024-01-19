'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
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
import { toast } from '@/components/ui/use-toast';
import { trpc } from '../_trpc/client';
import { User } from './page';
import { Upload } from 'lucide-react';
import UploadDropzone from '@/components/UploadDropzone';

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 40 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  phone: z.string().min(10).max(15),
  children: z
    .array(
      z.object({
        name: z.string().min(1, "Child's name is required"),
        age: z.number().min(0, 'Age must be a positive number'),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
}

interface FileData {
  id: string | undefined;
  downloadURL: string;
  fileName: string;
  uploadDate: Date;
  fileType: string;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const defaultValues: Partial<ProfileFormValues> = {
    fullName: user?.name,
    email: user?.email,
    phone: user?.phone,
    children: user?.Children,
  };
  const [fileData, setFileData] = useState<FileData>({
    id: '',
    downloadURL: '',
    fileName: '',
    uploadDate: new Date(),
    fileType: '',
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
  });

  const mutation = trpc.updateUserProfileSettings.useMutation();

  const handleFileUpload = (
    downloadURL: string,
    fileName: string,
    fileType: string
  ) => {
    setFileData((prevData) => ({
      ...prevData,
      downloadURL,
      fileName,
      id: '',
      fileType,
      uploadDate: new Date(),
    }));
  };

  function onSubmit(data: ProfileFormValues) {
    const formData = {
      ...data,
      files: { ...fileData },
    };
    mutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: 'Updated Successfully',
          description: <p>Your profile settings have been updated</p>,
        });
        router.refresh();
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Oops, something went wrong!',
          description: (
            <p>
              <span className='font-medium'>{error.message}</span>
            </p>
          ),
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col space-y-8'
      >
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder={user?.name} {...field} />
              </FormControl>
              <FormDescription>This should be your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder={user?.phone} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={user?.email} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((field, index) => (
          <div key={field.id} className='flex items-center space-x-3'>
            <Input
              placeholder={`Child ${index + 1} Name`}
              {...form.register(`children.${index}.name` as const)}
            />
            <Controller
              name={`children.${index}.age` as const}
              control={control}
              render={({ field }) => (
                <Input
                  type='number'
                  placeholder={`Child ${index + 1} Age`}
                  {...field}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                />
              )}
            />
            <button type='button' onClick={() => remove(index)}>
              Remove
            </button>
            {errors.children && errors.children[index]?.age && (
              <p className='text-red-500'>
                {errors.children[index]?.age?.message}
              </p>
            )}
          </div>
        ))}
        <Button
          type='button'
          onClick={() => append({ name: '', age: 0 })}
          className='my-2 w-[40%] self-center bg-blue-600 hover:bg-blue-400'
        >
          Add Child
        </Button>

        <div>
          <h2 className='text-lg font-semibold tracking-tight'>
            Upload a Profile Picture
          </h2>
          <UploadDropzone onFileUpload={handleFileUpload} />
        </div>
        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  );
}
