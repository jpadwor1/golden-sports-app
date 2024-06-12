import React from 'react'
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import Link from "next/link"
import { Notification } from '@prisma/client'

interface NotificationCardProps {
  notification: Notification;
}
const NotificationCard = ({notification}: NotificationCardProps) => {
  return (
    <Card className="shadow-none border-0">
          <CardHeader className="border-b">
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  <Link className="hover:underline" href="#">
                    Shadcn
                  </Link>
                  commented on your post
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">This is a great idea!</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage alt="@acme" src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  <Link className="hover:underline" href="#">
                    Acme Inc
                  </Link>
                  mentioned you in a post
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Check out our new product launch!</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">1 day ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage alt="@maxleiter" src="/placeholder-user.jpg" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  <Link className="hover:underline" href="#">
                    Max Leiter
                  </Link>
                  sent you a direct message
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Can we discuss the project timeline?</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">3 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
  )
}

export default NotificationCard
