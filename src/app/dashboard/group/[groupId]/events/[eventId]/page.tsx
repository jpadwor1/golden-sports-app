import React from 'react';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Loader2, MapPin, User2 } from 'lucide-react';
import Image from 'next/image';

import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import ParticipationButtons from '@/components/Dashboard/Events/participationButtons';
import EventComment from '@/components/Dashboard/Events/EventComment';
import MessageDialog from '@/components/Dashboard/Events/MessageDialog';

interface PageProps {
  params: {
    groupId: string;
    eventId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  const groupId = params.groupId;
  const eventId = params.eventId;
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
    include: {
      Children: true,
    },
  });
  const group = await db.group.findFirst({
    where: {
      id: groupId,
    },
  });

  const coach = await db.user.findFirst({
    where: {
      id: group?.coachId,
    },
  });

  const event = await db.event.findFirst({
    where: {
      id: eventId,
    },
    include: {
      invitees: true,
      eventComments: true,
    },
  });

  if (!event || !group || !coach) {
    return (
      <div className='w-full mt-24 flex justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
          <h3 className='font-semibold text-xl'>Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(
    event.address ? event.address : 'Hemet, CA'
  );

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=12&size=600x300&maptype=roadmap&markers=color:green%7Clabel:A%7C${encodedAddress}&key=${apiKey}`;
  const eventStartDate = format(
    new Date(event.startDateTime),
    "EEEE mm, yyyy 'at' hh:mm a"
  );
  const eventEndDate = event.endDateTime
    ? format(new Date(event.endDateTime), 'hh:mm a')
    : null;
  let initials = '';
  if (
    dbUser &&
    dbUser.Children.length > 0 &&
    dbUser.Children[0].name.split(' ').length > 1
  ) {
    initials =
      dbUser?.Children[0].name.split(' ')[0][0] +
      dbUser?.Children[0].name.split(' ')[1][0];
  } else if (dbUser && dbUser.Children.length > 0) {
    initials = dbUser?.Children[0].name[0];
  }
  const participationStatus = event.invitees.find((invitee) => {
    return invitee.userId === dbUser?.id;
  })?.status;
  const attending = event.invitees.filter((invitee) => {
    return invitee.status === 'ATTENDING';
  });
  const declined = event.invitees.filter((invitee) => {
    return invitee.status === 'DECLINED';
  });
  const unanswered = event.invitees.filter((invitee) => {
    return invitee.status === 'UNANSWERED';
  });

  

  return (
    <div className='max-w-4xl mx-auto p-4 bg-white rounded-lg shadow'>
      <div className='flex flex-col'>
        <div className='mb-4'>
          <Image
            alt='Map'
            className='w-full h-[250px] object-cover rounded-t-lg'
            height='300'
            src={mapUrl}
            style={{
              aspectRatio: '768/300',
              objectFit: 'cover',
            }}
            width='768'
          />
        </div>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold'>{event.title}</h1>
          <p className='text-sm text-gray-500'>{}</p>
        </div>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-center'>
            <Avatar>
              <AvatarImage
                alt='Sylas Padworski'
                src='/placeholder.svg?height=40&width=40'
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className='ml-2'>
              <p className='font-semibold'>Answering on behalf of</p>
              <p className='font-semibold text-indigo-600'>
                {dbUser?.Children[0].name}
              </p>
            </div>
          </div>
          <ParticipationButtons participation={participationStatus} userId={dbUser?.id} eventId={event.id} />

        </div>
        <div className='flex flex-col mb-4'>
          <div className='flex items-center mb-2'>
            <CalendarIcon className='text-gray-500 mr-2' />
            <p>
              {eventStartDate} - {eventEndDate}
            </p>
          </div>
          <div className='flex items-center mb-2'>
            <MapPin className='text-gray-500 mr-2' />
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
              target='_blank'
            >
              <p>{event.address}</p>
            </Link>
          </div>
          <div className='flex items-center'>
            <User2 className='text-gray-500 mr-2' />
            <p>{group.name + ' ' + group.description}</p>
          </div>
        </div>
        <div className='mb-4'>
          <p>{event.description}</p>
        </div>
        <div className='flex justify-between items-center mb-4'>
          <MessageDialog />
          <div className='flex'>
            <Badge className='mr-2' variant='secondary'>
              {attending.length} attending
            </Badge>
            <Badge className='mr-2' variant='secondary'>
              {unanswered.length} unanswered
            </Badge>
            <Badge variant='secondary'>{declined.length} declined</Badge>
          </div>
        </div>
        <EventComment userId={dbUser?.id} eventId={event.id} comments={event.eventComments} />
      </div>
    </div>
  );
};

export default Page;
