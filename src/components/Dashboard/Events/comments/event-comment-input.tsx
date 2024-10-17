"use client";
import { Separator } from "@/components/ui/separator";
import { User, Send, Loader2 } from "lucide-react";
import React from "react";
import EventCommentFeed from "./event-comment-feed";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Prisma } from "@prisma/client";

type Member = Prisma.MemberGetPayload<{
  include: {
    guardians: true;
    guardiansOf: true;
  };
}>;

interface EventCommentInputProps {
  dbUser: Member;
  eventId: string;
}
const EventCommentInput = ({ dbUser, eventId }: EventCommentInputProps) => {
  const router = useRouter();
  const TextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = React.useState("");
  const { data, isLoading } = trpc.getEventComments.useQuery(eventId);
  const addEventComment = trpc.createEventComment.useMutation();
  const utils = trpc.useUtils();
  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim() === "") return;
    const formData = {
      eventId,
      authorId: dbUser.id,
      content: comment,
    };

    addEventComment.mutate(formData, {
      onSuccess: () => {
        setComment("");
        utils.getEventComments.invalidate();
      },
      onError: (error) => {
        toast({
          title: "Oops, something went wrong",
          description: "Please reload the page and try again",
        });
        console.error(error);
      },
    });
  };

  if (isLoading)
    return (
      <Loader2 className="self-center h-10 w-10 text-gray-600 animate-spin" />
    );
  const comments = data.comments;
  return (
    <>
      <div className="hover:cursor-pointer hover:underline mt-1">
        <div className="flex flex-row items-center justify-end space-x-1 mt-1 mb-4">
          <p className="text-xs text-gray-600 ml-1">
            {comments.length} comments
          </p>
        </div>
      </div>
      <Separator />
      <form
        className="flex flex-row space-x-2 mt-4 items-center"
        onSubmit={(e) => handleComment(e)}
      >
        <div className="flex flex-row w-full mb-6 px-2 relative h-fit">
          <Avatar className="h-10 w-10 relative bg-gray-200">
            {dbUser?.imageURL ? (
              <div className="relative bg-white aspect-square h-full w-full">
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={dbUser.imageURL}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback className="bg-gray-200">
                <span className="sr-only">{dbUser?.firstName}</span>
                <User className="h-4 w-4 text-gray-900" />
              </AvatarFallback>
            )}
          </Avatar>

          <Textarea
            ref={TextareaRef}
            rows={1}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full ml-2 mb-0 focus-visible:ring-none focus:outline-none focus-visible:outline-none focus-visible:rounded-none relative resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Add a comment..."
            aria-label="Add a comment..."
            onInput={(e) => {
              if (TextareaRef.current) {
                TextareaRef.current.style.height = "auto";
                TextareaRef.current.style.height =
                  TextareaRef.current.scrollHeight + "px";
              }
            }}
          />
          <button type="submit" className="ml-2">
            <Send className="mt-2 mr-2 h-7 w-7 text-gray-600 hover:cursor-pointer" />
          </button>
        </div>
      </form>
      <Separator />

      <EventCommentFeed user={dbUser} comments={data.comments} />
    </>
  );
};

export default EventCommentInput;
