import React from "react";
import PollComment from "./poll-comment";
import { Member as User } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExtendedPollComment } from "@/types/types";

interface PollCommentFeedProps {
  comments: ExtendedPollComment[];
  user: User;
}

const CommentFeed = ({ comments, user }: PollCommentFeedProps) => {
  return (
    <ScrollArea className="flex flex-col w-full px-4 max-h-[400px] mt-8">
      {comments.map((comment: ExtendedPollComment) => (
        <PollComment key={comment.id} comment={comment} user={user} />
      ))}
    </ScrollArea>
  );
};

export default CommentFeed;
