import React from 'react';
import EventComment from './event-comment';
import { User } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExtendedPollComment } from '@/types/types';

interface EventCommentFeedProps {
  comments: ExtendedEventComment[];
  user: User;
}

const EventCommentFeed = ({ comments, user }: EventCommentFeedProps) => {

 
  return (
    <ScrollArea className='flex flex-col w-full px-4 max-h-[400px] mt-8'>
      {comments.map((comment: ExtendedPollComment) => (
        <EventComment key={comment.id} comment={comment} user={user}  />
      ))}
    </ScrollArea>
  );
};

export default EventCommentFeed;
