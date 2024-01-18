import React from 'react';
import Comment from './Comment';
import { Post } from '@/lib/utils';
import { Like, User, UserRole } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommentFeedProps {
  postId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    imageURL: string | null;
    createdAt: Date;
    isProfileComplete: boolean;
    parentId: string | null;
  } | null;
}

type Comment = {
  id: string;
  authorId: string;
  postId: string;
  content: string;
  timestamp: Date;
  likes: Like[];
  author: User;
  replies: Comment[];
  replyTo: Comment | null;
  replyToId: string | null;
};
const CommentFeed = ({ postId, user }: CommentFeedProps) => {
  const { data, isLoading } = trpc.getComments.useQuery(postId);

 

  if (isLoading)
    return (
      <div className='flex flex-col items-center'>
        <Loader2 className='h-4 w-4 text-green-950 animate-spin' />
        <p className='text-gray-900'>Loading...</p>
      </div>
    );
  if (!data)
    return <div className='flex flex-col items-center'>No comments</div>;

  return (
    <ScrollArea className='flex flex-col w-full px-4 max-h-[400px] -mt-8'>
      {data.comments.map((comment: Comment) => (
        <Comment key={comment.id} comment={comment} user={user}  />
      ))}
    </ScrollArea>
  );
};

export default CommentFeed;
