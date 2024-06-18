import React from 'react';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '../ui/separator';
import { ExtendedPoll, ExtendedUser } from '@/types/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Trash2Icon, User } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { formatDate } from '@/lib/actions';

interface PaymentCardProps {
  user: ExtendedUser;
  poll: ExtendedPoll;
}
export default function PaymentCardCard({ user, poll }: PaymentCardProps) {
  const [comment, setComment] = React.useState('');
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const author = poll.author;
  const authorInitials = author.firstName[0] + author.lastName[0];
  const userVoted = poll.votes.some((vote) => vote.userId === user.id);
  const userVote = poll.votes.find((vote) => vote.userId === user.id);
  const [hasVoted, setHasVoted] = React.useState(false);
  const TextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const utils = trpc.useUtils();
  const {data, isLoading} = trpc.getPollComments.useQuery(poll.id);

 
  const totalVotes = poll.votes.length;

  const addVote = trpc.createVote.useMutation();
  const handleVote = (optionId: string) => {
    const voteData = {
      pollId: poll.id,
      optionId,
    };
    addVote.mutate(voteData, {
      onSuccess: () => {
        setHasVoted(true);
      },
      onError: (error: any) => {
        console.error(error);
        toast({
          title: 'Oops, Sometihng went wrong',
          description: 'Please try again later',
        });
      },
    });
  };

  const addPollComment = trpc.createPollComment.useMutation();
  const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentData = {
      pollId: poll.id,
      comment,
    };
    addPollComment.mutate(commentData, {
      onSuccess: () => {
        setComment('');
        utils.getPollComments.invalidate(poll.id);
      },
      onError: (error: any) => {
        console.error(error);
        toast({
          title: 'Oops, Something went wrong',
          description: 'Please try again later',
        });
      },
    });
  };

  return (
    <Card className='w-full max-w-lg mx-auto mb-6'>
      <CardHeader className='flex flex-row items-start justify-between px-4 py-3 bg-white dark:bg-gray-800'>
        <div className='flex flex-row items-start gap-2'>
          <Avatar className='w-8 h-8 mt-1'>
            <AvatarImage
              alt={author.firstName}
              src={user.imageURL ? user.imageURL : ''}
            />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div className='text-sm'>
            <div className='font-medium'>{author.firstName + ' ' + author.lastName}</div>
            <div className='text-gray-500 dark:text-gray-400'>
              {formatDate(new Date(poll.createdAt))}
            </div>
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
                <DropdownMenuItem className='text-red-600 flex justify-between'>
                  Delete
                  <Trash2Icon className='mr-2 h-4 w-4' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <Separator />

      <CardContent className='px-6 py-8'>
        <h3 className='text-2xl font-bold'>{poll.title}</h3>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          {poll.description}
        </p>
        <div className='grid gap-4'>
          {hasVoted || userVoted
            ? poll.options.map((option) => {
                const voteCount = poll.votes.filter(
                  (vote) => vote.optionId === option.id
                ).length;
                const votePercent =
                  totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                return (
                  <Button
                    key={option.id}
                    className='justify-start shadow-md relative w-full'
                    variant='outline'
                    disabled
                    style={{
                      background: `linear-gradient(to right, green ${votePercent}%, white ${votePercent}%)`,
                    }}
                  >
                    {option.text}
                    <span className='ml-2'>({voteCount} votes)</span>
                  </Button>
                );
              })
            : poll.options.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  className='justify-start shadow-md w-full'
                  variant='outline'
                >
                  {option.text}
                </Button>
              ))}
        </div>

        <div className='text-center my-6'>
          <p className='text-gray-600'>
            Due by:{' '}
            {format(
              poll.expiresAt ? poll.expiresAt : new Date(),
              'eeee MMM dd, yyyy'
            )}
          </p>
        </div>
        <div
          onClick={() => setCommentsVisible(!commentsVisible)}
          className='hover:cursor-pointer hover:underline mt-1'
        >
          {poll.PollComment.length > 0 ? (
            <div className='flex flex-row items-center justify-end space-x-1 mt-1 mb-4'>
              <p className='text-xs text-gray-600 ml-1'>
                {poll.PollComment.length} comments
              </p>
            </div>
          ) : null}
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
