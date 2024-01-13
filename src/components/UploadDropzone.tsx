'use client';
import { useState } from 'react';
import { Progress } from './ui/progress';
import Dropzone, { useDropzone } from 'react-dropzone';
import { Cloud, File, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { startFileUpload } from '@/lib/actions';
import { set } from 'date-fns';

interface FileDropzoneProps {
    onFileUpload: (downloadURL: string, fileName: string, fileType: string) => void;
  }

const UploadDropzone: React.FC<FileDropzoneProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const { toast } = useToast();
 
  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    return interval;
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    startSimulatedProgress();

    try {
      await Promise.all(files.map(async (file) => {
        const uploadResult = await startFileUpload({ file });
        if (uploadResult) {
          const { downloadURL } = uploadResult;
          onFileUpload(downloadURL, file.name, file.type);
        } else {
          throw new Error('Upload failed');
        }
      }));
      setUploadProgress(100);
  
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
      setUploadProgress(0);
    } finally {
        setTimeout(() => {
            setUploadProgress(0);
            setIsUploading(false);
          }, 1000); 
    }
  };

  const { open, getRootProps, getInputProps } = useDropzone({
    accept: {
        'image/jpeg': [],
        'image/png': []
      },
    onDrop: (acceptedFiles: File[]) => {
      // Only taking the first file, as multiple is set to false
      setFile(acceptedFiles);
    },
    
    multiple: false,
  });

  return (
    <Dropzone
      multiple={false}
      maxFiles={1}
      onDrop={handleUpload}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border m-4 border-dashed border-gray-300 rounded-lg h-full'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex items-center justify-center w-full h-full'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Cloud className='h-6 w-6 text-zinc-500 mb-2 ' />
                <p className='mb-2 text-small text-zinc-700'>
                  <span className='font-semibold'>Click to Upload </span>
                  or drag and drop
                </p>
                <p className='text-xs text-zinc-500'>
                (Only *.jpeg and *.png images will be accepted)
                </p>
              </div>
            <div className='grid grid-cols-2 gap-2 mb-4'>
              {acceptedFiles && acceptedFiles[0] ? acceptedFiles.map((file) => {
                return (
                  <div key={file.name} className='mt-1 max-w-[240px] bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                    <div className='px-3 py-2 h-full grid place-items-center'>
                      <File className='h-4 w-4 text-blue-500' />
                    </div>
                    <div className='px-3 py-2 h-full text-sm truncate'>
                      {file.name}
                    </div>
                  </div>
                );
              }) : null}
            </div>
              {isUploading ? (
                <div className='w-full mt-4 mb-4 max-w-xs mx-auto'>
                  <Progress
                    value={uploadProgress}
                    className='h-1 w-full bg-zinc-200'
                  />
                  
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type='file'
                id='dropzone-file'
                className='hidden'
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};


export default UploadDropzone;