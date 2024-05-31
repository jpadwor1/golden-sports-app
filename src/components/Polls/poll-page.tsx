import React from 'react'
import { PollCard } from './poll-card'
import { Separator } from '../ui/separator'
import MiniEventCard from '../Dashboard/Events/MiniEventCard'
import MiniNewsCard from '../Dashboard/MiniNewsCard'

const PollPage = () => {
  return (
    <div className='flex flex-col space-y-8 md:flex-row md:items-start md:space-x-2 lg:space-y-0 px-1'>
      <div className='flex flex-col items-start justify-between space-y-2 mt-10 w-full md:w-3/4 max-w-xl'>
        <PollCard />
      </div>

      <div className='flex-col hidden md:flex md:w-1/2 md:py-8 md:mt-6 md:px-6 max-w-md'>
        <div className='bg-white min-h-[300px]  shadow-md rounded-md mt-3 '>
          <h2 className='text-md font-semibold tracking-wide ml-3 my-2 '>
            Upcoming Events
          </h2>
          <Separator className='text-gray-200' />
          <MiniEventCard />
        </div>
        <div className='bg-white min-h-[300px]  shadow-md rounded-md mt-6'>
          <h2 className='text-md font-semibold tracking-wide ml-3 my-2'>
            Top News
          </h2>
          <Separator className='text-gray-200' />
          <MiniNewsCard />
        </div>
      </div>
    </div>
  )
}

export default PollPage