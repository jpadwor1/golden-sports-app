import React from 'react';
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '../ui/card';
import { Notification } from '@prisma/client';
import Image from 'next/image';
import NotificationCard from './notification-card';
import { db } from '@/db';
import { trpc } from '@/app/_trpc/client';

interface NotificationListProps {
  notifications?: Notification[];
}
const NotificationList = ({ notifications }: NotificationListProps) => {
  if (notifications) {

    return (
      <Card className='shadow-none border-0'>
        <CardHeader className='border-b'>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>You have {notifications.filter((n)=> !n.read).length} unread messages.</CardDescription>
        </CardHeader>
        <CardContent className='p-4 space-y-4'>
        
        {notifications && notifications.length > 0 && (

          notifications.map( (notification) => {
    const {data, isLoading} = trpc.getFromUser.useQuery(notification.fromId)
            const fromUser = data
            if(isLoading) return <div>Loading...</div>
            return (
            <NotificationCard
              key={notification.id}
              notification={notification}
              fromUser={fromUser ? fromUser : null}
            />
          )}))}
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className='shadow-none border-0'>
        <CardHeader className='border-b'>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>You don&apos;t have any notifications.</CardDescription>
        </CardHeader>
        <CardContent className='p-4 space-y-4'>
          <div className='flex flex-col items-center justify-center'>
            <Image
              className='w-24 h-24'
              src='/icons/bell.png'
              alt='Notification Bell'
width={50}
height={50}
/>
<h2 className='mt-2 font-medium text-center'>You haven&apos;t received any<br/> notifications yet.</h2>
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default NotificationList;
