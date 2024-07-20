'use client';

import React from 'react';
import { TabsTrigger, TabsList, TabsContent, Tabs } from '@/components/ui/tabs';
import Events from '@/components/Dashboard/Events/Events';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExtendedPolls, ExtendedUser, ExtendedEvent } from '@/types/types';
import { Post } from '@/lib/utils';
import Dashboard from '@/app/dashboard/Dashboard';
import PollPage from '../Polls/poll-page';
import { TeamFilePage } from '../Dashboard/Team/team-file-page';
import PaymentPage from '../Payments/PaymentPage';
import { Payment } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { IconDotsVertical } from '@tabler/icons-react';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import MemberList from '../Dashboard/Members/member-list';
interface HorizontalNavbarProps {
  groupId: string;
  user: ExtendedUser;
  events: ExtendedEvent[];
  posts: Post[];
  polls: ExtendedPolls;
  payments: Payment[];
}

export default function HorizontalNavbar({
  groupId,
  user,
  events,
  posts,
  polls,
  payments,
}: HorizontalNavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'events';
  const newParams = new URLSearchParams(searchParams.toString());
  const isCoach = user.groupsAsCoach.some((group) => group.id === groupId);
  const handleTabChange = (value: string) => {
    if (value !== 'events') {
      newParams.set('tab', value);
      router.push(`/dashboard/group/${groupId}?${newParams}`);
    } else {
      newParams.delete('tab');
      router.push(`/dashboard/group/${groupId}`);
    }
  };

  return (
    <Tabs
      className='w-full mt-0 pl-3'
      defaultValue='events'
      value={activeTab as string}
      onValueChange={handleTabChange}
    >
      <TabsList className='flex w-full justify-evenly gap-4 border-b bg-white rounded-t-none'>
        <TabsTrigger
          className='w-full px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='events'
        >
          Events
        </TabsTrigger>
        <TabsTrigger
          className='w-full px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='posts'
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          className='w-full px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='polls'
        >
          Polls
        </TabsTrigger>
        <TabsTrigger
          className='w-full px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='payments'
        >
          Payments
        </TabsTrigger>

        <TabsTrigger
          className='w-full px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='members'
        >
          Members
        </TabsTrigger>

        <TabsTrigger
          className='w-full px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-black dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='files'
        >
          Files
        </TabsTrigger>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className='mr-4'>
            <Button size='icon' variant='outline' className='h-6 w-6 ml-2'>
              <IconDotsVertical className='h-5 w-5 text-black' />
              <span className='sr-only'>More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='text-base'>
            <DropdownMenuItem className='text-[15px]'>
              <Link className='' href='/settings/team'>
                Create Subgroup
              </Link>
            </DropdownMenuItem>
            <Link className='' href='/settings/team'>
              <DropdownMenuItem className='text-[15px]'>
                Settings
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem className='text-[15px]'>
              Download member list (Excel)
            </DropdownMenuItem>
            <DropdownMenuItem className='text-[15px]'>
              Leave group
            </DropdownMenuItem>
            <DropdownMenuItem className='text-[15px]'>
              <Trash2 className='h-4 w-4 text-red-400 mr-2' />
              Delete main group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TabsList>
      <TabsContent className='p-4' value='events'>
        <Events events={events} user={user} groupId={groupId} />
      </TabsContent>
      <TabsContent className='p-4' value='posts'>
        <Dashboard user={user} posts={posts} />
      </TabsContent>
      <TabsContent className='p-4' value='polls'>
        <PollPage user={user} polls={polls} groupId={groupId} />
      </TabsContent>
      <TabsContent className='p-4' value='payments'>
        <PaymentPage user={user} payments={payments} groupId={groupId} />
      </TabsContent>
      <TabsContent className='p-4' value='members'>
        <MemberList user={user} groupId={groupId} />
      </TabsContent>
      <TabsContent className='p-4' value='files'>
        <TeamFilePage user={user} />
      </TabsContent>
    </Tabs>
  );
}
