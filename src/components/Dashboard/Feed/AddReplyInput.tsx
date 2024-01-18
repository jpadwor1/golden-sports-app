'use client';

import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Post, Reply } from '@/lib/utils';
import { UserRole, User as UserType, Like } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface AddReplyInputProps {
  comment: {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    timestamp: Date;
    replyToId: string | null;
    replies: Reply[];
    author: UserType;
    likes: Like[];
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    createdAt: Date;
    imageURL: string | null;
    isProfileComplete: boolean;
    parentId: string | null;
  } ;
}

const AddReplyInput = ({ comment, user }: AddReplyInputProps) => {
  const router = useRouter();

  const [replyData, setReplyData] = React.useState({
    content: '',
    authorId: user.id,
    postId: comment.postId,
    replyToId: comment.id,
  });
  const addReply = trpc.createReply.useMutation();

  const handleReply = () => {
    console.log(replyData);

    addReply.mutate(
      { ...replyData },
      {
        onSuccess: () => {
          setReplyData({
            content: '',
            authorId: user.id,
            postId: comment.postId,
            replyToId: comment.id,
          });
          router.refresh();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: 'Oops, something went wrong.',
            description: 'Please try again later.',
          });
        },
      }
    );
  };
  return (
    <div className='flex flex-row w-full mb-6 px-2 relative'>
      <Avatar className='h-10 w-10 relative bg-gray-200'>
        {user?.imageURL ? (
          <div className='relative bg-white aspect-square h-full w-full'>
            <Image
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              src={user.imageURL}
              alt='profile picture'
              referrerPolicy='no-referrer'
            />
          </div>
        ) : (
          <AvatarFallback className='bg-white'>
            <span className='sr-only'>{user?.name}</span>
            <User className='h-4 w-4 text-gray-900' />
          </AvatarFallback>
        )}
      </Avatar>

      <Input
        onChange={(e) =>
          setReplyData({ ...replyData, content: e.target.value })
        }
        className='w-full ml-2 rounded-full relative'
        type='text'
        placeholder='Reply to this comment...'
        aria-label='Reply to this comment'
      />

      <Send
        onClick={handleReply}
        className='h-5 w-5 text-gray-600 absolute right-5 top-3 hover:cursor-pointer'
      />
    </div>
  );
};

export default AddReplyInput;
