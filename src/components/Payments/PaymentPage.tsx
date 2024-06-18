'use client'
import React from 'react'
import PaymentCard from './payment-card'
import { Separator } from '../ui/separator'
import MiniEventCard from '../Dashboard/Events/MiniEventCard'
import MiniNewsCard from '../Dashboard/MiniNewsCard'
import { Plus } from 'lucide-react'
import { ExtendedPoll, ExtendedPolls, ExtendedUser } from '@/types/types'
import CreatePollForm from './create-payment-form'

interface PaymentPageProps {
  user: ExtendedUser;
  polls: ExtendedPolls;
  groupId: string;
}
const PaymentPage = ({user, polls, groupId}: PaymentPageProps) => {
  const [paymentFormOpen, setPaymentFormOpen] = React.useState(false)
  const isUserCoachOfGroup = user.role === 'COACH' && user.groupsAsCoach.some(group => group.id === groupId);
  
  return (
    <div className='flex flex-col space-y-8 md:flex-row md:items-start md:space-x-2 lg:space-y-0 px-1'>
      <div className='flex flex-col items-center justify-center space-y-2 mt-2 w-full md:w-3/4 max-w-lg'>
      
      <div className='flex flex-row w-full justify-between'>
      <h2 className='text-2xl font-bold tracking-wide '>Payments</h2>

          {!paymentFormOpen && isUserCoachOfGroup && (
            <button
              onClick={() => setPaymentFormOpen(true)}
              className='flex flex-row items-center justify-center space-x-1 hover:bg-gray-200 hover:cursor-pointer px-2 py-1 rounded-full'
            >
              <Plus className='h-3 w-3 text-blue-500' />
              <p className='text-sm text-blue-500 pr-1 mb-0.5'>Create Payment</p>
            </button>
          )}
        </div>
        <div className='flex flex-col min-h-[calc(100vh-20rem)] w-full'>
          {paymentFormOpen && (
            <CreatePollForm setPollFormOpen={setPaymentFormOpen} user={user} groupId={groupId} />
          )}

          {polls.map(poll => (
            <PaymentCard key={poll.id} poll={poll as ExtendedPoll} user={user} />
          ))}
      </div>
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

export default PaymentPage