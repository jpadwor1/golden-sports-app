import React from 'react';
import Comment from './Comment';
import { Post } from '@/lib/utils';
import { Like, User, UserRole } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';

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
}
const CommentFeed = ({ postId, user }: CommentFeedProps) => {
  const { data, isLoading} = trpc.getComments.useQuery(postId);
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No comments</div>;

  
  return (
    <div className='flex flex-col w-full px-4'>
      {data.comments.map((comment: Comment) => (
        <Comment key={comment.id} comment={comment} user={user} />
      ))}
    </div>
  );
};

export default CommentFeed;
