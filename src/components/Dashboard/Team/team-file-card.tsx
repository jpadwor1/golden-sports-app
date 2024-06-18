import { trpc } from '@/app/_trpc/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { getFileIcon } from '@/hooks/getIcon';
import { cn } from '@/lib/utils';
import { File } from '@prisma/client';
import { DownloadIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface TeamFileCardProps {
  file: File;
  isCoach: boolean;
}
const TeamFileCard = ({ file, isCoach }: TeamFileCardProps) => {
  const deleteFile = trpc.deleteTeamFile.useMutation();
  const utils = trpc.useUtils();
  const handleFileDelete = () => {
    deleteFile.mutate(file.id, {
      onSuccess: () => {
        toast({
          title: 'File deleted successfully',
          description: 'The file has been deleted successfully',
        });
        utils.getTeamFiles.invalidate();
      },
      onError: (error: any) => {
        console.error(error);
        toast({
          title: 'Error deleting file',
          description:
            'An error occurred while deleting the file. Please try again later.',
        });
      },
    });
  };
  return (
    <Card className='p-2'>
      <CardContent className='pb-0 px-2'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center'>
            <div className='flex items-center gap-2'>
              {getFileIcon(file.fileName)}
            </div>
            <div>
              <h3 className='text-sm font-medium truncate md:w-[200px] w-[200px] '>
                {file.fileName}
              </h3>
            </div>
          </div>

          <Link
            href={file.url}
            target='_blank'
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              ''
            )}
          >
            <DownloadIcon className='w-5 h-5' />
          </Link>
          {isCoach && (
            <Button onClick={handleFileDelete} size='sm' variant='outline'>
              <Trash2 className='w-5 h-5 text-red-600' />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamFileCard;
