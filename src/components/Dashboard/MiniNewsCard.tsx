import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MiniNewsCard = () => {
  return (
    <Link
      href='https://theathletic.com/5193909/2024/01/11/tennessee-titans-mike-vrabel-fired/'
      target='_blank'
      referrerPolicy='no-referrer'
    >
      <div className='flex flex-col items-center my-1 relative'>
        <Image
          src='https://cdn.theathletic.com/app/uploads/2023/11/15002650/GettyImages-1724572773-scaled.jpg'
          alt=''
          width={255}
          height={100}
          className='rounded-md'
        />
        <div className='flex flex-col absolute bottom-0 left-1 max-w-[255px] bg-white/50 backdrop-blur-sm'>
          <h1 className='text-sm text-gray-900 font-medium ml-0.5'>The Athletic</h1>
          <p className='text-xs text-gray-900 ml-0.5 line-clamp-2'>
            Why Titans fired Mike Vrabel, a story of festering slights and a
            lack of communication Why Titans fired Mike Vrabel,
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MiniNewsCard;
