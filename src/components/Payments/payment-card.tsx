import React from 'react';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '../ui/separator';
import { ExtendedUser } from '@/types/types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Loader2, Trash2Icon } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { formatDate } from '@/lib/actions';
import { Payment } from '@prisma/client';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface PaymentCardProps {
  user: ExtendedUser;
  payment: Payment;
}
export default function PaymentCard({ user, payment }: PaymentCardProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: author, isLoading } = trpc.getUser.useQuery(
    payment.authorId as string
  );
  const deletePayment = trpc.deletePayment.useMutation();
  if (!author || isLoading) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
      </div>
    );
  }

  const authorInitials = author.firstName[0] + author.lastName[0];

  const handleDeletePayment = () => {
    deletePayment.mutate(payment.id, {
      onSuccess: () => {
        toast({
          title: 'Payment deleted',
          description: 'The payment has been successfully deleted',
          duration: 5000,
        })
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          title: 'Oops, Something went wrong',
          description: 'Please try again later',
        });
        console.error(error);
      }
    });
  }
  return (
    <Card className='w-full max-w-lg mx-auto mb-6'>
      <CardHeader className='flex flex-row items-start justify-between px-4 py-3 bg-white dark:bg-gray-800'>
        <div className='flex flex-row items-start gap-2'>
          <Avatar className='w-8 h-8 mt-1'>
            <AvatarImage
              alt={author.firstName}
              src={author.imageURL ? author.imageURL : ''}
            />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div className='text-sm'>
            <div className='font-medium'>
              {author.firstName + ' ' + author.lastName}
            </div>
            <div className='text-gray-500 dark:text-gray-400'>{formatDate(payment.createdAt)}</div>
          </div>
        </div>
        <div>
          {user.id === author.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='rounded-full'>
                  <Ellipsis />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={handleDeletePayment} className='text-red-600 flex justify-between'>
                  Delete
                  <Trash2Icon className='mr-2 h-4 w-4' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <Separator />

      <CardContent className='px-6 py-2'>
        <h3 className='text-2xl font-bold'>{payment.title}</h3>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          {payment.description ? payment.description : ''}
        </p>

        <div className=''>
          <p className='text-gray-600'>
            Due by:{' '}
            {formatDate(payment.dueDate)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Ellipsis() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('lucide lucide-ellipsis-vertical')}
    >
      <circle cx='12' cy='12' r='1' />
      <circle cx='12' cy='5' r='1' />
      <circle cx='12' cy='19' r='1' />
    </svg>
  );
}
