import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, ThumbsUp, MessageSquareMore, Send, Divide } from 'lucide-react';
import { format } from 'date-fns';
import { Post, truncateText } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ReplyFeed from './ReplyFeed';

interface CommentProps {
  postContent: Post;
}

const Comment = ({ postContent }: CommentProps) => {
  const maxLength = 230;
  const [isTruncated, setIsTruncated] = React.useState(true);
  const [commentsVisible, setCommentsVisible] = React.useState(false);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedContent = isTruncated
    ? truncateText(postContent.postBody, maxLength)
    : postContent.postBody;

  return (
    <div className='flex flex-row items-start w-full'>
      <Avatar className='h-10 w-10 relative bg-gray-200'>
        {postContent.poster.imageURL ? (
          <div className='relative bg-white aspect-square h-full w-full'>
            <Image
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              src={postContent.poster.imageURL}
              alt='profile picture'
              referrerPolicy='no-referrer'
            />
          </div>
        ) : (
          <AvatarFallback className='bg-white'>
            <span className='sr-only'>{postContent.poster.name}</span>
            <User className='h-4 w-4 text-gray-900' />
          </AvatarFallback>
        )}
      </Avatar>
      <div className='flex flex-col'>
        <div className='flex flex-col w-full items-start justify-between px-2 bg-gray-100 mx-2 mb-0.5 rounded-br-lg rounded-tr-lg rounded-bl-lg relative'>
          <h1 className='text-sm text-gray-900 tracking-wide'>
            {postContent.poster.name}
          </h1>
          <p className='text-xs font-normal text-gray-500 mb-2'>
            {format(
              new Date(postContent.date),
              `MMM dd, yyyy ${String.fromCharCode(183)} HH:mm a`
            )}
          </p>
          <p className='text-sm font-light'>{truncatedContent}</p>
          {postContent.postBody.length > maxLength && isTruncated && (
            <Button
              className='absolute -bottom-0.5 right-3 bg-gray-100 px-0 py-0 my-0 h-6 font-light hover:font-normal hover:bg-transparent'
              variant='ghost'
              onClick={toggleTruncate}
            >
              {isTruncated ? '...see more' : ''}
            </Button>
          )}
        </div>
        <div className='flex flex-row items-center'>
          <Button
            onClick={() => console.log('Like')}
            variant='ghost'
            className='text-xs px-2 py-0 my-0 ml-2 max-w-fit h-6 '
          >
            Like
          </Button>
          {postContent.usersLiked.length > 0 && (
            <>
              <p>{String.fromCharCode(183)}</p>
              <ThumbsUp className='h-3 w-3 text-blue-500 ml-2' />
              {postContent.usersLiked.length > 0 && (
                <p className='text-xs text-gray-600 ml-1'>
                  {postContent.usersLiked.length}
                </p>
              )}
            </>
          )}
          <p className='mb-1 mx-2'>|</p>
          <Button
            onClick={() => console.log('reply')}
            variant='ghost'
            className='text-xs px-2 py-0 my-0 -ml-1 max-w-fit h-6 '
          >
            Reply
          </Button>
          {postContent.usersLiked.length > 0 && (
            <>
              <p>{String.fromCharCode(183)}</p>
              {postContent.usersLiked.length > 0 && (
                <p className='text-xs text-gray-600 ml-1'>
                  {postContent.usersLiked.length} replies
                </p>
              )}
            </>
          )}
        </div>
        {postContent.comments.length > 1 && (
          <p
            onClick={() => console.log('previous replies')}
            className='ml-2.5 my-1 text-xs font-light text-gray-900 hover:underline hover:cursor-pointer'
          >
            Load previous replies
          </p>
        )}

        {postContent.comments.length > 0 && <ReplyFeed postContent={postContent} />}
      </div>
    </div>
  );
};

export default Comment;
