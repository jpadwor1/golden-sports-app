import { ExtendedEvent } from '@/app/dashboard/events/page';
import { User } from '@prisma/client';
import React from 'react';

interface EventCardProps {
  event: ExtendedEvent;
  user: {
    groupsAsCoach: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
    groupsAsMember: {
      id: string;
      name: string;
      description: string | null;
      coachId: string;
      createdAt: Date;
      logoURL: string | null;
    }[];
  } & User;
}

const EventCard = ({ event, user }: EventCardProps) => {
  return <div></div>;
};

export default EventCard;
