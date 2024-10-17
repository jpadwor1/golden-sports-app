import React from "react";
import EventComment from "./event-comment";
import { Member } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExtendedEventComment, ExtendedPollComment } from "@/types/types";

interface EventCommentFeedProps {
  comments: ExtendedEventComment[];
  user: Member;
}

const EventCommentFeed = ({ comments, user }: EventCommentFeedProps) => {
  return (
    <ScrollArea className="flex flex-col w-full px-4 max-h-[400px] mt-8">
      {comments.map((comment: ExtendedEventComment) => (
        <EventComment key={comment.id} comment={comment} user={user} />
      ))}
    </ScrollArea>
  );
};

export default EventCommentFeed;
