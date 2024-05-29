'use client'

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React from 'react'
import { eventComment } from '@prisma/client';
interface EventCommentProps {
    userId: string | undefined;
    eventId: string;
    comments: eventComment[];
    }
    
const EventComment = ({userId, eventId, comments}: EventCommentProps) => {
    const [eventComments, setComments] = React.useState([])

  return (
    <div className='border-t pt-4'>
          <Textarea className='mb-4' placeholder='Write a comment...' />
          <div className='flex justify-end items-center'>
            <Button className=''>Publish</Button>
          </div>
        </div>
  )
}

export default EventComment
