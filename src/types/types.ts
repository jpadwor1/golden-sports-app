import {
  Group,
  Participant,
  Payment,
  Poll,
  PollComment,
  PollOption,
  PollVote,
  User,
  Event,
  File,
  Notification,
} from '@prisma/client';

export type ExtendedPollComment = PollComment & {
  author: User;
};

export type ExtendedPolls = Poll[] &
  {
    options: PollOption[];
    votes: PollVote[];
    PollComment: ExtendedPollComment[];
    author: User;
  }[];

export type ExtendedPoll = Poll & {
  options: PollOption[];
  votes: PollVote[];
  PollComment: ExtendedPollComment[];
  author: User;
};

export type ExtendedUser = {
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

export type UserWithNotifications = User & {
  notifications: Notification[];
}

export type ExtendedEvent = Event & {
  invitees: Participant[];
  group: Group;
  payments: Payment[];
  File: File[];
};

export type FileType = {
  key: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  downloadURL: string;
}[];
