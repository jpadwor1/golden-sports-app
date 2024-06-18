import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFileIcon } from '@/hooks/getIcon';
import { cn } from '@/lib/utils';
import { File } from '@prisma/client';
import { DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TeamFileCardProps {
  file: File;
}
const TeamFileCard = ({ file }: TeamFileCardProps) => {
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
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), '')}
        >
          <DownloadIcon className='w-5 h-5' />
        </Link>
      </div>
      </CardContent>
    </Card>
  );
};

export default TeamFileCard;
