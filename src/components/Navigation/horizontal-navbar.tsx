'use client';

import React from 'react';
import { TabsTrigger, TabsList, TabsContent, Tabs } from '@/components/ui/tabs';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Events from '@/components/Dashboard/Events/Events';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExtendedEvent } from '@/app/dashboard/group/[groupId]/page';
import { ExtendedPolls, ExtendedUser } from '@/types/types';
import { Post } from '@/lib/utils';
import Dashboard from '@/app/dashboard/Dashboard';
import PollPage from '../Polls/poll-page';

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
  polls
}: HorizontalNavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'events';
  const newParams = new URLSearchParams(searchParams.toString());

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
      className='w-full'
      defaultValue='events'
      value={activeTab as string}
      onValueChange={handleTabChange}
    >
      <TabsList className='flex w-full justify-center gap-4 border-b'>
        <TabsTrigger
          className='px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='events'
        >
          Events
        </TabsTrigger>
        <TabsTrigger
          className='px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='posts'
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          className='px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='polls'
        >
          Polls
        </TabsTrigger>
        <TabsTrigger
          className='px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50'
          value='payments'
        >
          Payments
        </TabsTrigger>
      </TabsList>
      <TabsContent className='p-4' value='events'>
        <Events events={events} user={user} groupId={groupId} />
      </TabsContent>
      <TabsContent className='p-4' value='posts'>
        <Dashboard user={user} posts={posts} />
      </TabsContent>
      <TabsContent className='p-4' value='polls'>
          <PollPage user={user} polls={polls} groupId={groupId}  />
      </TabsContent>
      <TabsContent className='p-4' value='payments'>
       
      </TabsContent>
    </Tabs>
  );
}
