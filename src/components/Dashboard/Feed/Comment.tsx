import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User as UserIcon,
  ThumbsUp,
  MessageSquareMore,
  Send,
  Divide,
} from 'lucide-react';
import { format, set } from 'date-fns';
import { truncateText, Reply } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ReplyFeed from './ReplyFeed';
import { Comment as CommentType, Like, User, UserRole } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import AddCommentInput from './AddCommentInput';
import AddReplyInput from './AddReplyInput';

interface CommentProps {
  comment: {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    timestamp: Date;
    replyToId: string | null;
    replies: Reply[];
    author: User;
    likes: Like[];
  };
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

const Comment = ({ comment, user }: CommentProps) => {
  const maxLength = 230;
  const [isTruncated, setIsTruncated] = React.useState(true);
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const [likes, setLikes] = React.useState(comment.likes);
  const [replyInput, setReplyInput] = React.useState(false);
  const author = comment.author;
  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };
  const addLike = trpc.createLike.useMutation();

  const truncatedContent = isTruncated
    ? truncateText(comment.content, maxLength)
    : comment.content;

  const handleCommentLike = () => {
    const likeData = {
      authorId: author.id,
      commentId: comment.id,
      postId: comment.postId,
    };

    try {
      addLike.mutate(likeData, {
        onSuccess: () => {
          setLikes([
            ...comment.likes,
            {
              id: '',
              authorId: '',
              commentId: comment.id,
              postId: comment.postId,
              timestamp: new Date(),
            },
          ]);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex flex-row items-start w-full mt-3'>
      <Avatar className='h-10 w-10 relative bg-gray-200'>
        {author.imageURL ? (
          <div className='relative bg-white aspect-square h-full w-full'>
            <Image
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              src={author.imageURL}
              alt='profile picture'
              referrerPolicy='no-referrer'
            />
          </div>
        ) : (
          <AvatarFallback className='bg-gray-200'>
            <span className='sr-only'>{author.name}</span>
            <UserIcon className='h-4 w-4 text-gray-900' />
          </AvatarFallback>
        )}
      </Avatar>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col w-full min-h-[100px] px-2 bg-gray-100 mx-2 mb-0.5 rounded-br-lg rounded-tr-lg rounded-bl-lg relative'>
          <h1 className='text-sm text-gray-900 tracking-wide'>{author.name}</h1>
          <p className='text-xs font-normal text-gray-500 mb-2'>
            {format(
              new Date(comment.timestamp),
              `MMM dd, yyyy ${String.fromCharCode(183)} hh:mm a`
            )}
          </p>
          <p className='text-sm font-light mb-2'>{truncatedContent}</p>
          {comment.content.length > maxLength && isTruncated && (
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
            onClick={handleCommentLike}
            variant='ghost'
            className='text-xs px-2 py-0 my-0 ml-2 max-w-fit h-6 '
          >
            Like
          </Button>
          {likes.length > 0 && (
            <>
              <p>{String.fromCharCode(183)}</p>
              <ThumbsUp className='h-3 w-3 text-blue-500 ml-2' />
              {likes.length > 0 && (
                <p className='text-xs text-gray-600 ml-1'>{likes.length}</p>
              )}
            </>
          )}
          <p className='mb-1 mx-2'>|</p>
          <Button
            onClick={() => setReplyInput(!replyInput)}
            variant='ghost'
            className='text-xs px-2 py-0 my-0 -ml-1 max-w-fit h-6 '
          >
            Reply
          </Button>

          {comment.replies.length > 0 && (
            <>
              <p>{String.fromCharCode(183)}</p>
              {comment.replies.length > 0 && (
                <p className='text-xs text-gray-600 ml-1'>
                  {comment.replies.length} replies
                </p>
              )}
            </>
          )}
        </div>

        {replyInput && <AddReplyInput comment={comment} user={user} />}

        {comment.replies.length > 0 && <ReplyFeed replies={comment.replies} />}
      </div>
    </div>
  );
};

export default Comment;
