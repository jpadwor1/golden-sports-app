'use client';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export default function MessageDisplay() {
  return (
    <div className='grid md:grid-cols-2 gap-6 h-full w-full '>
      <div className='max-w-sm bg-gray-200 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-none'>
        <div className='sticky top-0 bg-gray-200 dark:bg-gray-950 p-4'>
          <Input
            placeholder='Search conversations'
            className='w-full bg-white dark:bg-gray-900 dark:text-gray-50'
          />
        </div>
        <div className='flex flex-col space-y-4 p-4'>
          <Link
            href='#'
            className='flex items-center gap-3 p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-900 transition-colors'
            prefetch={false}
          >
            <Avatar className='w-10 h-10 border'>
              <AvatarImage src='/placeholder.svg' alt='@shadcn' />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className='flex-1 truncate'>
              <div className='font-medium'>Acme Inc</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                Hey, just checking in on the project status.
              </div>
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>2h</div>
          </Link>
          <Link
            href='#'
            className='flex items-center gap-3 p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-900 transition-colors'
            prefetch={false}
          >
            <Avatar className='w-10 h-10 border'>
              <AvatarImage src='/placeholder.svg' alt='@olivia' />
              <AvatarFallback>OD</AvatarFallback>
            </Avatar>
            <div className='flex-1 truncate'>
              <div className='font-medium'>Olivia Davis</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                Did you get my email about the budget?
              </div>
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>1d</div>
          </Link>
          <Link
            href='#'
            className='flex items-center gap-3 p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-900 transition-colors'
            prefetch={false}
          >
            <Avatar className='w-10 h-10 border'>
              <AvatarImage src='/placeholder.svg' alt='@max' />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <div className='flex-1 truncate'>
              <div className='font-medium'>Max Leiter</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                Let&apos;s schedule a call to discuss the new feature.
              </div>
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>3d</div>
          </Link>
          <Link
            href='#'
            className='flex items-center gap-3 p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-900 transition-colors'
            prefetch={false}
          >
            <Avatar className='w-10 h-10 border'>
              <AvatarImage src='/placeholder.svg' alt='@sarah' />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className='flex-1 truncate'>
              <div className='font-medium'>Sarah Johnson</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                I have some updates on the marketing campaign.
              </div>
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>1w</div>
          </Link>
        </div>
      </div>
      <div className='flex flex-col h-full'>
        <div className='sticky top-0 bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-10 h-10 border'>
              <AvatarImage src='/placeholder.svg' alt='@shadcn' />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='font-medium '>John Padworski</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='rounded-full'>
                  <MoveHorizontalIcon className='w-4 h-4' />
                  <span className='sr-only'>More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>
                  <PhoneIcon className='w-4 h-4 mr-2' />
                  Call
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <VideoIcon className='w-4 h-4 mr-2' />
                  Video Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileWarningIcon className='w-4 h-4 mr-2' />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='flex-1 overflow-auto p-4'>
          <div className='grid gap-4'>
            <div className='flex items-start gap-4'>
              <Avatar className='w-8 h-8 border'>
                <AvatarImage src='/placeholder.svg' alt='@shadcn' />
                <AvatarFallback className='bg-gray-300'>AC</AvatarFallback>
              </Avatar>
              <div className='flex flex-col text-sm'>
                <div className='font-medium mt-2'>Acme Inc</div>
                <div className='bg-gray-300 dark:bg-gray-900 p-3 rounded-lg max-w-[75%]'>
                  Hey, just checking in on the project status.
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  2h ago
                </div>
              </div>
            </div>
            <div className='flex items-start gap-4 justify-end'>
              <div className='flex flex-col items-end text-sm'>
                <div className='font-medium text-right mt-2'>You</div>
                <div className='bg-blue-500 text-white p-3 rounded-lg max-w-[75%]'>
                  Hi there, the project is going well. I&apos;ll send over a full
                  update later today.
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400 text-right'>
                  1h ago
                </div>
              </div>
              <Avatar className='w-8 h-8 border'>
                <AvatarImage src='/placeholder.svg' alt='@you' />
                <AvatarFallback className='bg-gray-300'>YO</AvatarFallback>
              </Avatar>
            </div>
            
          </div>
        </div>
        <div className='sticky bottom-0 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-4'>
          <div className='relative'>
            <Textarea
              placeholder='Type your message...'
              className='min-h-[48px] rounded-2xl resize-none p-4 border border-gray-200 border-neutral-400 shadow-sm pr-16 dark:border-gray-800'
            />
            <Button
              type='submit'
              size='icon'
              className='absolute top-5 right-3 w-8 h-8'
            >
              <ArrowUpIcon className='w-4 h-4' />
              <span className='sr-only'>Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d='m5 12 7-7 7 7' />
      <path d='M12 19V5' />
    </svg>
  );
}

function FileWarningIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' />
      <path d='M12 9v4' />
      <path d='M12 17h.01' />
    </svg>
  );
}

function MoveHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points='18 8 22 12 18 16' />
      <polyline points='6 8 2 12 6 16' />
      <line x1='2' x2='22' y1='12' y2='12' />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
    </svg>
  );
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d='m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5' />
      <rect x='2' y='6' width='14' height='12' rx='2' />
    </svg>
  );
}
