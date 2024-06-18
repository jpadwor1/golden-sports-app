'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import TeamFileCard from './team-file-card';
import { trpc } from '@/app/_trpc/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Trash } from 'lucide-react';
import { getFileIcon } from '@/hooks/getIcon';
import { startFileUpload } from '@/lib/actions';
import { toast } from '@/components/ui/use-toast';
import { File as DBFileType } from '@prisma/client';
import { ExtendedUser, FileType } from '@/types/types';

interface TeamFilePageProps {
  user: ExtendedUser;
}
export function TeamFilePage({user}: TeamFilePageProps) {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.getTeamFiles.useQuery(groupId as string);
  const [files, setFiles] = React.useState<File[]>([]);
  const isCoach = user.groupsAsCoach.some((group) => group.id === groupId);
  const addTeamFiles = trpc.uploadTeamFile.useMutation();
  const handleAttachments = () => {
    fileInputRef.current?.click();
  };
  if (isLoading) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
          <h3 className='font-semibold text-xl'>Hang on just a moment...</h3>
          <p>We are organizing your digital shelves.</p>
        </div>
      </div>
    );
  }
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

  const handleUpload = async () => {
    let uploadedFilesData: FileType = [];
    if (files && files.length > 0) {
      uploadedFilesData = await Promise.all(
        files.map(async (file) => {
          const uploadResult = await startFileUpload({ file });
          if (!uploadResult) {
            throw new Error('Upload failed');
          }
          const { downloadURL } = uploadResult;
          return {
            key: downloadURL,
            fileName: file.name,
            fileType: file.type,
            uploadDate: new Date().toDateString(),
            downloadURL: downloadURL,
          };
        })
      );
    }

    const formData = {
      groupId: groupId as string,
      files: uploadedFilesData,
    };

    addTeamFiles.mutate(formData, {
      onSuccess: () => {
        setFiles([]);
        utils.getTeamFiles.invalidate();
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: 'Oops, something went wrong!',
          description: 'Reload the page and try again.',
        });
      },
    });
  };

  const groupFiles = data;
  return (
    <div className='container mx-auto py-12 px-4 md:px-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>File Storage</h1>
        <p className='text-gray-500 text-lg'>
          Securely store and manage your files.
        </p>
      </div>
      <div className='flex justify-between items-center mb-6'>
        <Button className='bg-green-800 hover:bg-green-600' onClick={handleAttachments} size='lg'>
          Upload File
          <input
            type='file'
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
        </Button>
        <Input
          className='max-w-md w-full'
          placeholder='Search files...'
          type='search'
        />
      </div>
      {files.length > 0 && (
        <>
          <div className='grid grid-cols-2 gap-2'>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex flex-row items-start border rounded-md p-2 my-2 bg-white'
              >
                {getFileIcon(file.name)}
                <p className='text-sm text-gray-500 truncate w-[200px]'>{file.name}</p>
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
          <div className='flex space-x-4 my-8'>
            <Button onClick={handleUpload} className='bg-green-800 hover:bg-green-600'>
              Submit
            </Button>
            <Button variant='outline' onClick={() => setFiles([])}>
              Cancel
            </Button>
          </div>
        </>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {groupFiles && groupFiles.length > 0 ? (
          groupFiles.map((file: DBFileType) => <TeamFileCard isCoach={isCoach} file={file} key={file.id} />)
        ) : (
          <div className='md:col-span-2 text-center mt-8'>
            <h1 className='text-2xl font-bold mb-2 '>No Files Found</h1>
            <p className='text-gray-500 text-lg'>
              Upload files to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
