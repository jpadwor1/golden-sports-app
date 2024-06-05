'use client';

import React from 'react';
import Image from 'next/image';
import {
  User,
  ThumbsUp,
  MessageSquareMore,
  MoreVertical,
  Trash,
  X 
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Post, truncateText } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AddCommentInput from './AddCommentInput';
import CommentFeed from './CommentFeed';
import { File,User as UserType } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import FullScreenImageViewer from './FullScreenImageViewer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SocialCardProps = {
  post: Post;
  user: UserType;
};

const SocialCard: React.FC<SocialCardProps> = ({ post, user }) => {
  const maxLength = 150;
  const [isTruncated, setIsTruncated] = React.useState(true);
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const [likes, setLikes] = React.useState(post.likes);
  const [fullscreenView, setFullscreenView] = React.useState(false);
  const addLike = trpc.createLike.useMutation();
  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const author = post.author;

  const truncatedContent = isTruncated
    ? truncateText(post.content, maxLength)
    : post.content;

  const renderMedia = (file: File) => {
    if (!file) return null;
    const videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    const isVideo = videoFormats.some((ext) => file.fileType.endsWith(ext));

    if (isVideo) {
      return (
        <video
          className='object-contain h-[275px]'
          onClick={() => setFullscreenView(true)}
          controls
        >
          <source src={file.url} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <Image
          onClick={() => setFullscreenView(true)}
          src={file.url}
          alt='post media'
          width={500}
          height={500}
          className='object-contain h-[275px]'
        />
      );
    }
  };

  const handleLike = () => {
    if (!user) return;
    const likeData = {
      authorId: user.id,
      postId: post.id,
    };

    addLike.mutate(
      { ...likeData },
      {
        onSuccess: () => {
          console.log('like added');
          setLikes([
            ...likes,
            {
              id: '',
              authorId: user.id,
              postId: post.id,
              timestamp: new Date(),
              commentId: '',
            },
          ]);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <Card className='w-full mb-4 overflow-hidden'>
      <CardHeader className='pb-0'>
        <div className='flex flex-grow-1 space-x-2 -ml-2 -mt-2'>
          <Avatar className='h-10 w-10 relative bg-gray-200'>
            {post.author.imageURL ? (
              <div className='relative bg-white aspect-square h-full w-full'>
                <Image
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  src={post.author.imageURL}
                  alt='profile picture'
                  referrerPolicy='no-referrer'
                />
              </div>
            ) : (
              <AvatarFallback className='bg-white'>
                <span className='sr-only'>{author.firstName[0] + ' ' + author.lastName[0]}</span>
                <User className='h-4 w-4 text-gray-900' />
              </AvatarFallback>
            )}
          </Avatar>

          <div className='flex flex-col items-start justify-start w-full '>
            <p className='text-sm font-medium text-gray-900'>{author.firstName + ' ' + author.lastName}</p>
            <p className='text-xs font-normal text-gray-500'>
              {format(
                new Date(post.timestamp),
                `MMM dd, yyyy ${String.fromCharCode(183)} hh:mm a`
              )}
            </p>
          </div>
          <div className='w-full flex flex-col items-end'>
            {user && user.id === post.authorId && (
              <DropdownMenu>
                <DropdownMenuTrigger className=''>
                  <MoreVertical className='h-4 w-4 cursor-pointer' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-[20px]'>
                  <DropdownMenuItem>
                    <Trash className='h-4 w-4 text-red-600 mr-2' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <CardDescription className=' text-sm font-light text-gray-950 min-h-fit '>
          {truncatedContent}
          {post.content.length > maxLength && isTruncated && (
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
      <CardContent className='p-0 mt-2'>
        {post.Files.length <= 1 ? (
          renderMedia(post.Files[0])
        ) : (
          <div className='grid grid-cols-2 gap-1'>
            {post.Files.map((file) => (
              <div key={file.id}>{renderMedia(file)}</div>
            ))}
          </div>
        )}
        {fullscreenView && (
          <Dialog open={fullscreenView}>
            <DialogContent>
              <DialogClose>
                <X
                  onClick={() => setFullscreenView(false)}
                  className='absolute right-2 top-2 self-end h-5 w-5'
                />
              </DialogClose>
              <FullScreenImageViewer
                images={post.Files}
                setFullscreenView={setFullscreenView}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
      <CardFooter className='w-full items-stretch flex flex-col pb-1 px-6'>
        <div className='flex flex-row justify-between items-stretch min-w-full mt-2'>
          <div className='mt-2'>
            {likes.length > 0 && (
              <div className='flex flex-row items-center justify-center space-x-1'>
                <ThumbsUp className='h-3 w-3 text-blue-600' />

                {likes.length > 0 ? (
                  <p className='text-xs text-gray-600 ml-1'>{likes.length}</p>
                ) : (
                  <p className='text-xs text-gray-600 ml-1'>{likes.length}</p>
                )}
              </div>
            )}
          </div>
          <div
            onClick={() => setCommentsVisible(true)}
            className='hover:cursor-pointer hover:underline mt-1'
          >
            {post.comments.length > 0 ? (
              <div className='flex flex-row items-center justify-center space-x-1 mt-1'>
                <p className='text-xs text-gray-600 ml-1'>
                  {post.comments.length} comments
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <Separator className='my-2' />
        <div className='flex flex-row justify-evenly'>
          <div
            onClick={handleLike}
            className={buttonVariants({
              variant: 'ghost',
              className:
                'flex items-center justify-center w-full text-gray-600 hover:cursor-pointer',
            })}
          >
            <ThumbsUp />
            <p className='ml-2'>Like</p>
          </div>
          <div
            onClick={() => setCommentsVisible(true)}
            className={buttonVariants({
              variant: 'ghost',
              className:
                'flex flex-row items-center justify-center w-full text-gray-600 hover:cursor-pointer',
            })}
          >
            <MessageSquareMore />
            <p className='ml-2'>Comment</p>
          </div>
        </div>
      </CardFooter>
      {commentsVisible && (
        <>
          <AddCommentInput user={user} post={post} />
          <CommentFeed user={user} postId={post.id} />
        </>
      )}
    </Card>
  );
};

export default SocialCard;
