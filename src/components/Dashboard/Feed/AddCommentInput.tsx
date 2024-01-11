import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Post } from '@/lib/utils';
import { UserRole } from '@prisma/client';

interface AddCommentInputProps {
  postContent: Post;
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
  } | null;
}

const AddCommentInput = ({ postContent, user }: AddCommentInputProps) => {
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
        className='w-full ml-2 rounded-full relative'
        type='text'
        placeholder='Add a comment...'
        aria-label='Add a comment...'
      />

      <Send
        onClick={() => console.log('clicked')}
        className='h-5 w-5 text-gray-600 absolute right-5 top-3 hover:cursor-pointer'
      />
    </div>
  );
};

export default AddCommentInput;
