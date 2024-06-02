import { Poll, PollComment, PollOption, PollVote, User } from '@prisma/client';

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
