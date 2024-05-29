'use client'

import React from "react"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Events from "@/components/Dashboard/Events/Events"
import { useRouter, useSearchParams } from "next/navigation"
import { ExtendedEvent } from "@/app/dashboard/group/[groupId]/page"
import { User } from "@prisma/client"

interface HorizontalNavbarProps {
  groupId: string;
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
  events: ExtendedEvent[];
}

export default function HorizontalNavbar({groupId, user, events}: HorizontalNavbarProps) {
 const router = useRouter();
 const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || 'events';
  const newParams = new URLSearchParams(searchParams.toString());
 
  const handleTabChange = (value: string) => {
    
    if (value !== 'events') {
      newParams.set("tab", value);
      router.push(`/dashboard/group/${groupId}?${newParams}`);
    } else{
      newParams.delete("tab");
      router.push(`/dashboard/group/${groupId}`);
    }
  };


  return (
    <Tabs className="w-full" defaultValue="events" value={activeTab as string} onValueChange={handleTabChange}>
      <TabsList className="flex w-full justify-center gap-4 border-b">
        <TabsTrigger
          className="px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50"
          value="events"
        >
          Events
        </TabsTrigger>
        <TabsTrigger
          className="px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50"
          value="posts"
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          className="px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50"
          value="polls"
        >
          Polls
        </TabsTrigger>
        <TabsTrigger
          className="px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-50"
          value="payments"
        >
          Payments
        </TabsTrigger>
      </TabsList>
      <TabsContent className="p-4" value="events">
      <Events events={events} user={user} groupId={groupId} />
        
      </TabsContent>
      <TabsContent className="p-4" value="posts">
        <div className="prose prose-sm dark:prose-invert">
          <h2>About Our Company</h2>
          <p>
            We are a leading provider of innovative solutions for our customers. Our team of experts is dedicated to
            delivering the best possible experience.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="#"
          >
            Learn More
          </Link>
        </div>
      </TabsContent>
      <TabsContent className="p-4" value="polls">
        <div className="prose prose-sm dark:prose-invert">
          <h2>Our Key Features</h2>
          <p>Discover the powerful features that set us apart from the competition.</p>
          <ul>
            <li>Intuitive user interface</li>
            <li>Robust security measures</li>
            <li>Seamless integration with your existing systems</li>
          </ul>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="#"
          >
            Learn More
          </Link>
        </div>
      </TabsContent>
      <TabsContent className="p-4" value="payments">
        <div className="prose prose-sm dark:prose-invert">
          <h2>Get in Touch</h2>
          <p>Have a question or want to learn more? Don&apos;t hesitate to reach out to us.</p>
          <form className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" type="text" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Enter your message" rows={4} />
            </div>
            <Button className="justify-self-end" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </TabsContent>
    </Tabs>
  )
}