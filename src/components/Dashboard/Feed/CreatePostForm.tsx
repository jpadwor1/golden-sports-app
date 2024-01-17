'use client';

import { User } from '@prisma/client';
import React, { ChangeEventHandler } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CalendarCheck2, Image as ImageIcon, VoteIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from 'emoji-picker-react';
import { trpc } from '@/app/_trpc/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
interface PostFormProps {
  user: User;
}

const CreatePostForm = ({ user }: PostFormProps) => {
  const [inputOpen, setInputOpen] = React.useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    postBody: '',
    files: [{}]
  });
  const ref = React.useRef<HTMLDivElement>(null);
  const TextAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const submitPost = trpc.createPost.useMutation();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setInputOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  React.useEffect(() => {
    if (inputOpen && TextAreaRef.current) {
      TextAreaRef.current.focus();
    }
  }, [inputOpen]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit'; // Reset the height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to scroll height
  };

  const handleIconClick = () => {
    fileInputRef.current?.click(); // Trigger click on the file input when icon is clicked
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;
    if (files) {
      setFormData({ ...formData, files: [...formData.files, ...files] });
    }
    console.log(files)
  };

  const onSubmit = () => {
    console.log(formData);
  };

  return (
    <div className='flex flex-col w-full bg-white shadow-sm rounded-md items-center justify-center mb-6'>
      <div className='flex flex-row items-center justify-evenly w-full p-4'>
        <Avatar>
          <AvatarImage
            src={user.imageURL ? user.imageURL : ''}
            alt='profile pic'
          />
          <AvatarFallback>
            {user.name.split(' ').map((name) => name[0])}
          </AvatarFallback>
        </Avatar>
        <Input
          readOnly
          value={formData.postBody}
          onClick={() => setInputOpen(true)}
          className={cn(
            inputOpen ? 'opacity-0 pointer-events-none' : 'flex',
            'rounded-full w-4/5 transition duration-100 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none'
          )}
          placeholder="What's on your mind?"
        />
      </div>
      <div
        ref={ref}
        className={cn(
          inputOpen ? 'flex' : 'hidden',
          'flex-col w-full px-6 h-30 min-h-fit transition-all duration-100 ease-in-out mb-6'
        )}
      >
        <Textarea
          ref={TextAreaRef}
          name='postBody'
          value={formData.postBody}
          onChange={(e) =>
            setFormData({ ...formData, postBody: e.target.value })
          }
          onInput={handleInput}
          placeholder="What's on your mind?"
          className='rounded-none focus-visible:outline-none focus-visible:ring-0 resize-none border-none min-h-fit overflow-hidden'
        />
        <div className='flex flex-row justify-between'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ImageIcon
                  className='text-gray-400 h-5 w-5'
                  onClick={handleIconClick}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add media</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
          <Button
            onClick={onSubmit}
            disabled={formData.postBody.length === 0}
            size='xs'
            className='self-end max-w-fit rounded-full bg-blue-600 disabled:bg-gray-200 hover:bg-blue-400 disabled:text-gray-600'
          >
            Post
          </Button>
        </div>
      </div>
      <div className='flex flex-row items-center justify-evenly w-3/4'>
        <div
          className={buttonVariants({
            variant: 'ghost',
            className: 'flex items-center justify-center gap-2 mb-2',
          })}
        >
          <CalendarCheck2 className='h-4 w-4 text-orange-600' />
          <h2 className='text-sm text-gray-500 font-medium'>Event</h2>
        </div>
        <div
          className={buttonVariants({
            variant: 'ghost',
            className: 'flex items-center justify-center gap-2 mb-2',
          })}
        >
          <VoteIcon className='h-6 w-6 text-blue-600' />
          <h2 className='text-sm text-gray-500 font-medium'>Poll</h2>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;
