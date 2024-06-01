import { Poll, PollComment, PollOption, PollVote, User } from "@prisma/client";

export type ExtendedPoll = Poll[] & {
    options: PollOption[];
    votes: PollVote[];
    PollComment: PollComment[];
  }[];

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