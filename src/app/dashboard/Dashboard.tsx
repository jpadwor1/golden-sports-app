import React from 'react';
import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import SocialCard from '@/components/Dashboard/Feed/SocialCard';
import { Post } from '@/lib/utils';
import { db } from '@/db';

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  });
  const fakeData: Post = {
    poster: {
      name: 'John Doe',
      imageURL: user?.picture ? user.picture : '',
    },
    postBody:
      'Joe O’Donnell was a great individual and human being who helped numerous people and made a difference in the many lives he touched. I never met him but had close friends who knew him and considJoe O’Donnell was a great individual and human being who helped numerous people and made a difference in the many lives he touched. I never met him but had close friends who knew him and consid',
    image: 'https://source.unsplash.com/random',
    date: '2024-01-10',
    usersLiked: ['Alice', 'Bob', 'Charlie'],
    comments: [
      {
        user: 'Alice',
        comment: 'He was truly an inspiration.',
        date: '2024-01-10',
        likes: ['Eve', 'Frank'],
        replies: [
          {
            user: 'Eve',
            comment: 'I agree. His kindness knew no bounds.',
            date: '2024-01-11',
            likes: ['Alice'],
          },
        ],
      },
      {
        user: 'Bob',
        comment: 'His legacy will live on.',
        date: '2024-01-10',
        likes: ['Alice', 'Bob', 'Charlie'],
        replies: [
          {
            user: 'Eve',
            comment: 'I agree. His kindness knew no bounds.',
            date: '2024-01-11',
            likes: ['Alice'],
          },
          {
            user: 'Eve',
            comment: 'I agree. His kindness knew no bounds.',
            date: '2024-01-11',
            likes: ['Alice'],
          },
        ],
      },
    ],
  };
  // Add more fake posts as needed
  return (
    <div className='flex flex-col space-y-8 md:flex-row md:items-start md:space-x-2 lg:space-y-0 px-8'>
      <div className='flex flex-col items-start justify-between space-y-2 mt-10 w-full md:w-3/5'>
        <div className='flex flex-row w-full justify-between'>
          <h2 className='text-2xl font-bold tracking-wide '>Your Feed</h2>
          <div className='flex flex-row items-center justify-center space-x-1 hover:bg-gray-200 hover:cursor-pointer px-2 py-1 rounded-full'>
            <Plus className='h-3 w-3 text-blue-500' />
            <p className='text-sm text-blue-500 pr-1 mb-0.5'>Create Post </p>
          </div>
        </div>
        <div className='flex flex-col min-h-[calc(100vh-20rem)] w-full'>
          <SocialCard postContent={fakeData} user={dbUser} />
        </div>
      </div>

      <div className='flex-col md:flex md:w-2/5 md:py-8 md:mt-10 md:px-6'>
        <div className='bg-white min-h-[300px]  shadow-md rounded-md mt-6'>
          <h2 className='text-3xl font-bold tracking-tight'>Upcoming Events</h2>
        </div>
        <div className='bg-white min-h-[300px]  shadow-md rounded-md mt-6'>
          <h2 className='text-3xl font-bold tracking-tight'>Upcoming Events</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
