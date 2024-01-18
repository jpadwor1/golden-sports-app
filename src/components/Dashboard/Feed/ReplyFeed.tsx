import React from 'react';
import Reply from './Reply';
import { Reply as ReplyType } from '@/lib/utils';

interface ReplyFeedProps {
  replies: ReplyType[];
}

const ReplyFeed = ({ replies }: ReplyFeedProps) => {
  return (
    <div>
      {replies.map((reply) => (
        <Reply key={reply.id} reply={reply} />
      ))}
    </div>
  );
};

export default ReplyFeed;
