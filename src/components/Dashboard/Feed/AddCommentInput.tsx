'use client';

import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Post } from '@/lib/utils';
import { User as UserType, UserRole } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

interface AddCommentInputProps {
  post: Post;
  user: UserType;
}

const AddCommentInput = ({ post, user }: AddCommentInputProps) => {
  const router = useRouter();
  const TextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [commentText, setCommentText] = React.useState('');
  const createComment = trpc.createComment.useMutation();
  const utils = trpc.useUtils();

  const handleAddComment = () => {
    if (!user) return;
    const commentData = {
      authorId: user.id,
      postId: post.id,
      groupId: post.groupId,
      content: commentText,
    };
    createComment.mutate(commentData, {
      onSuccess: () => {
        setCommentText('');
        utils.getComments.invalidate();
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
  };
  return (
    <div className='flex flex-row w-full mb-6 px-2 relative h-fit'>
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
          <AvatarFallback className='bg-gray-200'>
            <span className='sr-only'>{user?.firstName + ' ' + user?.lastName}</span>
            <User className='h-4 w-4 text-gray-900' />
          </AvatarFallback>
        )}
      </Avatar>

      <Textarea
        ref={TextareaRef}
        rows={1}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className='w-full ml-2 mb-0 focus-visible:ring-none focus:outline-none border-none focus-visible:outline-none focus-visible:border-none focus-visible:rounded-none relative resize-none focus-visible:ring-0 focus-visible:ring-offset-0'
        placeholder='Add a comment...'
        aria-label='Add a comment...'
        onInput={(e) => {
          if (TextareaRef.current) {
            TextareaRef.current.style.height = 'auto';
            TextareaRef.current.style.height =
              TextareaRef.current.scrollHeight + 'px';
          }
        }}
      />

      <Send
        onClick={handleAddComment}
        className='mt-2 mr-2 h-7 w-7 text-gray-600 hover:cursor-pointer'
      />
    </div>
  );
};

export default AddCommentInput;
