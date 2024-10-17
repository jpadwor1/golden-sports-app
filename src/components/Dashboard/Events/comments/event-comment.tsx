import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Member } from "@prisma/client";
import { ExtendedEventComment } from "@/types/types";

interface CommentProps {
  comment: ExtendedEventComment;
  user: Member;
}

const EventComment = ({ comment, user }: CommentProps) => {
  const maxLength = 230;
  const [isTruncated, setIsTruncated] = React.useState(true);
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const author = comment.author;
  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedContent = isTruncated
    ? truncateText(comment.content, maxLength)
    : comment.content;

  return (
    <div className="flex flex-row items-start w-full mb-2">
      <Avatar className="h-10 w-10 relative bg-gray-200 mt-2">
        {author.imageURL ? (
          <div className="relative bg-white aspect-square h-full w-full">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={author.imageURL}
              alt="profile picture"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <AvatarFallback className="bg-gray-200">
            <span className="sr-only">{author.firstName}</span>
            <UserIcon className="h-4 w-4 text-gray-900" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full min-h-[100px] px-2 bg-gray-100 mx-2 mb-0.5 rounded-br-lg rounded-tr-lg rounded-bl-lg relative">
          <h1 className="text-sm text-gray-900 tracking-wide mt-2">
            {author.firstName + " " + author.lastName}
          </h1>
          <p className="text-xs font-normal text-gray-500 mb-2">
            {format(
              new Date(comment.timestamp),
              `MMM dd, yyyy ${String.fromCharCode(183)} hh:mm a`
            )}
          </p>
          <p className="text-sm mb-2">{truncatedContent}</p>
          {comment.content.length > maxLength && isTruncated && (
            <Button
              className="absolute -bottom-0.5 right-3 bg-gray-100 px-0 py-0 my-0 h-6 font-light hover:font-normal hover:bg-transparent"
              variant="ghost"
              onClick={toggleTruncate}
            >
              {isTruncated ? "...see more" : ""}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventComment;
