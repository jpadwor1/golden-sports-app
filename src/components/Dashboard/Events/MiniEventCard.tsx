import { CalendarCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const MiniEventCard = () => {
  return (
    <div className='flex flex-row w-full items-center justify-center space-x-1 my-2 border-l-2 border-blue-600 hover:bg-gray-100 hover:cursor-pointer'>
      <div className='flex flex-col items-center -ml-2'>
        <p className='text-md text-gray-900 font-extrabold'>29</p>
        <p className='text-sm text-gray-900 font-semibold -mt-2'>Feb</p>
      </div>
      <div className='flex flex-col items-start'>
        <div className='flex flex-row items-center justify-between'>
          <h1 className='text-xs text-gray-800 font-medium ml-1'>
            Wednesday Practice
          </h1>
          <MapPin className='h-3 w-3 text-blue-500 ml-1 mr-0.5' />
          <Link href='/'>
            <p className='text-xs text-gray-500 hover:text-gray-900 hover:font-medium'>
              Hemet, CA
            </p>
          </Link>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <CalendarCheck className='h-4 w-4 text-blue-500 mx-1' />
          <p className='text-xs text-gray-500'>
            Thursday, Feb 29, 2024 at 6:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniEventCard;
