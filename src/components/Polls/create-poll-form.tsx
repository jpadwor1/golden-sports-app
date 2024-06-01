import { ExtendedUser } from '@/types/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import Link from 'next/link';

interface CreatePollFormProps {
  setPollFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: ExtendedUser;
}

const CreatePollForm = ({ user, setPollFormOpen }: CreatePollFormProps) => {
  const [inputOpen, setInputOpen] = React.useState(false);
  const [groupId, setGroupId] = React.useState('');
  const [formData, setFormData] = React.useState({
    postBody: '',
  });
  const TextAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const userGroups = [...user.groupsAsCoach, ...user.groupsAsMember];
  const ref = React.useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'inherit';
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  };

  return (
    <div className='max-w-xl p-6 bg-white rounded-lg shadow-sm mb-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>Create poll in Test Group</h3>
        <Button onClick={() => setPollFormOpen(false)} variant='ghost' className='text-sm'>
          ✕
        </Button>
      </div>
      <form>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='title'>Title</Label>
            <Input id='title' placeholder='Write a question...' />
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea id='description' placeholder='Description (optional)' />
          </div>
          <div className='flex items-center space-x-2'>
            <Input id='option' placeholder='Add an option' />
            <Button variant='ghost' size='icon'>
              <TrashIcon className='h-5 w-5 text-gray-400' />
              <span className='sr-only'>Remove option</span>
            </Button>
          </div>
          <Button variant='secondary' className='w-full justify-center'>
            + Add option
          </Button>
          <div className='flex items-center space-x-2'>
            <Checkbox id='multiple-choice' />
            <Label htmlFor='multiple-choice'>
              Allow same person to vote on multiple options
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox id='hide-votes' />
            <Label htmlFor='hide-votes'>Hide votes</Label>
            <MessageCircleQuestionIcon className='h-5 w-5 text-gray-400' />
          </div>
          <div>
            <Label htmlFor='due-date'>Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Input id='due-date' placeholder='Sat, Jun 1 9:00 PM' />
              </PopoverTrigger>
              <PopoverContent className='p-0'>
                <Calendar />
              </PopoverContent>
            </Popover>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox id='allow-comments' defaultChecked />
            <Label htmlFor='allow-comments'>Allow comments</Label>
          </div>
        </div>
        <div className='flex items-center justify-between mt-6'>
          <Link
            href='#'
            className='text-sm text-blue-600 hover:underline'
            prefetch={false}
          >
            Learn more about polls.
          </Link>
          <div className='space-x-2'>
            <Button variant='outline'>Back</Button>
            <Button>Create</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePollForm;

function MessageCircleQuestionIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z' />
      <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
      <path d='M12 17h.01' />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M3 6h18' />
      <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
      <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
    </svg>
  );
}
