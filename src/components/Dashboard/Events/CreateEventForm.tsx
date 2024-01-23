import { trpc } from '@/app/_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { User } from '@prisma/client'
import { CalendarCheck2, VoteIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

interface CreateEventFormProps {
    user: {
        groupsAsCoach: {
          id: string;
          name: string;
          description: string | null;
          coachId: string;
          createdAt: Date;
          logoURL: string | null;
        }[];
        groupsAsMember: {
          id: string;
          name: string;
          description: string | null;
          coachId: string;
          createdAt: Date;
          logoURL: string | null;
        }[];
      } & User;
}
const CreateEventForm = ({user}: CreateEventFormProps) => {
    const router = useRouter();
    const [inputOpen, setInputOpen] = React.useState(false);
    const [groupId, setGroupId] = React.useState('');
    const [formData, setFormData] = React.useState({
      postBody: '',
      groupId: '',
    });
    const ref = React.useRef<HTMLDivElement>(null);
    const TextAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const userGroups = [...user.groupsAsCoach, ...user.groupsAsMember];
    const submitPost = trpc.createPost.useMutation();
    const addPost = trpc.createPost.useMutation();
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        // Check if the clicked area is outside the ref and not part of the select component
        if (
          ref.current &&
          !ref.current.contains(event.target as Node) &&
          !(event.target as Element).closest('.select-class')
        ) {
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

      const onSubmit = () => {
        if (TextAreaRef.current) {
          const newFormData = {
            postBody: TextAreaRef.current.value,
            groupId: groupId,
            
          };
    
          
        }
      };
  return (
      <div
      ref={ref}
      className='flex flex-col w-full bg-white shadow-sm rounded-md items-center justify-center mb-6'
    >
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
        <Select
          onValueChange={(value) => setGroupId(value)}
          className='select-class'
        >
          <SelectTrigger
            className={cn(
              inputOpen ? '' : 'hidden',
              'w-[250px] text-xs select-class ml-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0'
            )}
          >
            <SelectValue placeholder='Pick a Team to Post' />
          </SelectTrigger>
          <SelectContent className='select-class focus-visible:ring-0'>
            {userGroups.map((group) => (
              <SelectItem
                className='select-class focus-visible:ring-0'
                key={group.id}
                value={group.id}
              >
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        className={cn(
          inputOpen ? 'flex' : 'hidden',
          'flex-col w-full px-6 h-30 min-h-fit transition-all duration-100 ease-in-out mb-6'
        )}
      >
        <Textarea
          required
          ref={TextAreaRef}
          name='postBody'
          value={formData.postBody}
          onChange={(e) =>
            setFormData({ ...formData, postBody: e.target.value })
          }
          onInput={handleInput}
          placeholder="What's on your mind?"
          className='rounded-none focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 resize-none border-none min-h-fit overflow-hidden'
        />
        <div className='flex flex-row justify-between mt-6'>
          
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
  )
}

export default CreateEventForm
