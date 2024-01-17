import React from 'react';
import Comment from './Comment';
import { Post } from '@/lib/utils';
import { UserRole } from '@prisma/client';

interface CommentFeedProps {
  post: Post;
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
const CommentFeed = ({ post, user }: CommentFeedProps) => {
  return (
    <div className='flex flex-col w-full px-4'>
      {post.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentFeed;
