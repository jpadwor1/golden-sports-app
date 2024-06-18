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

interface HorizontalNavbarProps {
  groupId: string;
  user: ExtendedUser;
  events: ExtendedEvent[];
  posts: Post[];
  polls: ExtendedPolls;
}

export default function HorizontalNavbar({
  groupId,
  user,
  events,
  posts,
  polls,
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
      className='w-full mt-0 '
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
        {isCoach && (
          <>
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
          </>
        )}
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
      <PaymentPage user={user} polls={polls} groupId={groupId} />
      </TabsContent>
      <TabsContent className='p-4' value='members'></TabsContent>
      <TabsContent className='p-4' value='files'>
        <TeamFilePage user={user} />
      </TabsContent>
    </Tabs>
  );
}
