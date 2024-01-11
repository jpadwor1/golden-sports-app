import React from 'react';
import Reply from './Reply';
import { Post } from '@/lib/utils';

interface ReplyFeedProps {
  postContent: Post;
}

const ReplyFeed = (postContent: ReplyFeedProps) => {
  return (
    <div>
      <Reply postContent={postContent.postContent} />
    </div>
  );
};

export default ReplyFeed;
