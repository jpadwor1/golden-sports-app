import React from 'react';
import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import SocialCard from '@/components/Dashboard/Feed/SocialCard';

const postContent = {
  poster: 'John Doe',
  postBody:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.',
  image:
    'https://images.unsplash.com/photo-1620159120762-7b6c1e9d7a2f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sJTIwY2FyZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
  date: '2021-05-04T14:48:00.000Z',
};

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user?.id;

  return (
    <div className='flex flex-col space-y-8 lg:flex-row lg:items-start lg:space-x-12 lg:space-y-0 w-full px-8'>
      <div className='flex flex-col items-start justify-between space-y-2 mt-10 w-3/5'>
        <div className='flex flex-row w-full justify-between'>
          <h2 className='text-2xl font-bold tracking-wide '>Your Feed</h2>
          <div className='flex flex-row items-center justify-center space-x-1 hover:bg-gray-200 hover:cursor-pointer px-2 py-1 rounded-full'>
            <Plus className='h-3 w-3 text-blue-500' />
            <p className='text-sm text-blue-500 pr-1 mb-0.5'>Create Post </p>
          </div>
        </div>
        <div className='flex flex-col min-h-[calc(100vh-20rem)]'>
          <SocialCard postContent={postContent} />
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
