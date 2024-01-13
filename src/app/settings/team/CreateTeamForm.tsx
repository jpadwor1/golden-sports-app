'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
import UploadDropzone from '@/components/UploadDropzone';
import { File } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';

interface FileData {
  id: string | undefined;
  downloadURL: string;
  fileName: string;
  uploadDate: Date;
  fileType: string;
}

const user = {
  team: null,
};

const teamFormSchema = z.object({
  teamName: z.string().min(1, 'Team name is required.'),
  description: z.string().min(1, 'Description is required.'),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

const CreateTeamForm = () => {
  const [fileData, setFileData] = React.useState<FileData>();
  const router = useRouter();
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    mode: 'onChange',
  });
  const { handleSubmit, control } = form;
  const mutation = trpc.createGroup.useMutation();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (data) => {},
    retry: true,
    retryDelay: 500,
  });
  const { mutate: createFile } = trpc.getCreateFile.useMutation({
    onSuccess: (data) => {
      setFileData((prevData) => ({
        ...prevData,
        downloadURL: data?.key || '',
        fileName: data?.fileName || '',
        id: data?.id || '',
        fileType: data?.fileType || '',
        uploadDate: new Date(data?.uploadDate || new Date()),
      }));
    },
  });

  const onSubmit = (data: TeamFormValues) => {
    const formData = {
      ...data,
      files: { ...fileData },
      name: data.teamName,
    };
    console.log(formData);

    try {
      mutation.mutate(
        {
          ...formData,
          files: {
            fileName: fileData?.fileName || '',
            id: fileData?.id || '',
            fileType: fileData?.fileType || '',
            downloadURL: fileData?.downloadURL || '',
          },
        },
        {
          onSuccess: () => {
            toast({
              title: 'Service Event Created',
              description: (
                <>
                  <p>Succesfully created a new team.</p>
                  <p>Now, invite some players.</p>
                </>
              ),
            });
            router.push('/settings');
          },
          onError: (error: any) => {
            toast({
              title: 'Oops Something went wrong',
              description: (
                <>
                  <p>try again later</p>
                  <p>{error.message}</p>
                </>
              ),
            });
            router.push('/settings');
          },
        }
      );
    } catch (error: any) {
      toast({
        title: 'Oops Something went wrong',
        description: (
          <>
            <p>try again later</p>
            <p>{error.message}</p>
          </>
        ),
      });
      router.push('/settings');
    }
  };

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

  return (
      
        <div>
          <h2 className='text-xl font-bold tracking-tight'>Create a Team</h2>
          <p className='text-muted-foreground'>
            Create a team to manage your organization.
          </p>
          <Separator className='mt-2 mb-6' />
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col space-y-8'
            >
              <FormField
                control={control}
                name='teamName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your team&apos;s name.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Describe your team.</FormDescription>
                  </FormItem>
                )}
              />

              {/* Dropzone for uploading team logo */}
              <FormItem>
                <FormLabel>Team Logo</FormLabel>
                <UploadDropzone onFileUpload={handleFileUpload} />
              </FormItem>

              <Button className='md:w-1/4'>Create Team</Button>
            </form>
          </Form>
        </div>
      
  );
};

export default CreateTeamForm;
