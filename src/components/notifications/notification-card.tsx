import React from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { Notification, Member as User } from "@prisma/client";
import { formatDate } from "@/lib/actions";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: Notification;
  fromUser: User | null;
}
const NotificationCard = ({
  notification,
  fromUser,
}: NotificationCardProps) => {
  const status =
    notification.type === "comment" ? (
      <span className="text-gray-500 dark:text-gray-400">
        commented on a post
      </span>
    ) : notification.type === "event" ? (
      <span className="text-gray-500 dark:text-gray-400">posted an event</span>
    ) : notification.type === "like" ? (
      <span className="text-gray-500 dark:text-gray-400">liked your post</span>
    ) : notification.type === "post" ? (
      <span className="text-gray-500 dark:text-gray-400">posted</span>
    ) : notification.type === "message" ? (
      <span className="text-gray-500 dark:text-gray-400">
        sent you a message
      </span>
    ) : notification.type === "file" ? (
      <span className="text-gray-500 dark:text-gray-400">
        posted a new file.
      </span>
    ) : null;

  const type =
    notification.type === "comment" ||
    notification.type === "post" ||
    notification.type === "like"
      ? "posts"
      : notification.type === "event"
      ? "events"
      : notification.type === "message"
      ? "messages"
      : notification.type === "poll"
      ? "polls"
      : notification.type === "payments"
      ? "payments"
      : notification.type === "file"
      ? "file"
      : null;

  const { data, isLoading } = trpc.getResource.useQuery({
    resourceId: notification.resourceId,
    resourceType: type as
      | "posts"
      | "events"
      | "messages"
      | "polls"
      | "payments"
      | "file",
  });
  let url = "";
  if (type === "events") {
    url = `/dashboard/group/${data}/${type}/${notification.resourceId}`;
  } else if (type === "posts") {
    url = `/dashboard/group/${data}?tab=posts`;
  } else if (type === "file") {
    url = `/dashboard/group/${notification.resourceId}?tab=files`;
  }

  const updateNotificationReadStatus =
    trpc.updateNotificationReadStatus.useMutation();
  const handleNotificationClick = () => {
    updateNotificationReadStatus.mutate(notification.id, {
      onSuccess: () => {
        console.log("Notification read status updated");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <Link
      onClick={handleNotificationClick}
      className={cn(
        !notification.read && "bg-gray-100",
        "flex items-start gap-3 hover:bg-gray-100 p-2 rounded-md"
      )}
      href={url}
    >
      <div className="flex-shrink-0">
        <Avatar>
          <AvatarImage
            alt={fromUser ? fromUser.firstName : ""}
            src={fromUser && fromUser.imageURL ? fromUser.imageURL : ""}
          />
          <AvatarFallback>
            {fromUser
              ? fromUser?.firstName[0] + " " + fromUser.lastName[0]
              : ""}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">
          <span className="font-medium">
            {fromUser?.firstName} {fromUser?.lastName}
          </span>{" "}
          {status}
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(new Date(notification.timestamp))}
        </div>
      </div>
    </Link>
  );
};

export default NotificationCard;
