'use client';

import React from 'react';
import Image from 'next/image';
import { User, ThumbsUp, MessageSquareMore, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { Post, truncateText } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AddCommentInput from './AddCommentInput';
import CommentFeed from './CommentFeed';
import { UserRole } from '@prisma/client';

type SocialCardProps = {
  postContent: Post;
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
};

const SocialCard: React.FC<SocialCardProps> = ({ postContent, user }) => {
  const maxLength = 150;
  const [isTruncated, setIsTruncated] = React.useState(true);
  const [commentsVisible, setCommentsVisible] = React.useState(false);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedContent = isTruncated
    ? truncateText(postContent.postBody, maxLength)
    : postContent.postBody;

  return (
    <Card className='w-full'>
      <CardHeader className='pb-0'>
        <div className='flex flex-grow-1 items-start justify-start space-x-2 -ml-2 -mt-2'>
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

          <div className='flex flex-col items-start justify-start '>
            <p className='text-sm font-medium text-gray-900'>
              {postContent.poster.name}
            </p>
            <p className='text-xs font-normal text-gray-500'>
              {format(
                new Date(postContent.date),
                `MMM dd, yyyy ${String.fromCharCode(183)} HH:mm a`
              )}
            </p>
          </div>
        </div>
        <CardDescription className='text-sm font-light text-gray-950 min-h-fit'>
          {truncatedContent}
          {postContent.postBody.length > maxLength && isTruncated && (
            <Button
              className='px-0 py-0 my-0 h-6 font-light hover:font-normal hover:bg-transparent'
              variant='ghost'
              onClick={toggleTruncate}
            >
              {isTruncated ? '...See More' : ''}
            </Button>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        {postContent.image && (
          <Image
            src={postContent.image}
            alt='post image'
            width={500}
            height={500}
          />
        )}
      </CardContent>
      <CardFooter className='w-full items-stretch flex flex-col pb-1 px-6'>
        <div className='flex flex-row justify-between items-stretch min-w-full mt-2'>
          <div className='mt-2'>
            {postContent.usersLiked.length > 0 && (
              <div className='flex flex-row items-center justify-center space-x-1'>
                <ThumbsUp className='h-3 w-3 text-blue-600' />

                {postContent.usersLiked.length > 0 ? (
                  <p className='text-xs text-gray-600 ml-1'>
                    {postContent.usersLiked[0] +
                      ` and ${postContent.usersLiked.length - 1} others`}
                  </p>
                ) : (
                  <p className='text-xs text-gray-600 ml-1'>
                    {postContent.usersLiked[0]}
                  </p>
                )}
              </div>
            )}
          </div>
          <div
            onClick={() => setCommentsVisible(true)}
            className='hover:cursor-pointer hover:underline mt-1'
          >
            {postContent.comments.length > 0 ? (
              <div className='flex flex-row items-center justify-center space-x-1 mt-1'>
                <p className='text-xs text-gray-600 ml-1'>
                  {postContent.comments.length} comments
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <Separator className='my-2' />
        <div className='flex flex-row justify-evenly'>
          <div
            className={buttonVariants({
              variant: 'ghost',
              className:
                'flex items-center justify-center w-full text-gray-600',
            })}
          >
            <ThumbsUp />
            <p className='ml-2'>Like</p>
          </div>
          <div
            className={buttonVariants({
              variant: 'ghost',
              className:
                'flex flex-row items-center justify-center w-full text-gray-600',
            })}
          >
            <MessageSquareMore />
            <p className='ml-2'>Comment</p>
          </div>
        </div>
      </CardFooter>
      {commentsVisible && (
        <>
          <AddCommentInput user={user} postContent={postContent} />
          <CommentFeed user={user} postContent={postContent} />
        </>
      )}
    </Card>
  );
};

export default SocialCard;
