"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SocialCard from "@/components/Dashboard/Feed/SocialCard";
import { Separator } from "@/components/ui/separator";
import MiniEventCard from "@/components/Dashboard/Events/MiniEventCard";
import MiniNewsCard from "@/components/Dashboard/MiniNewsCard";
import CreatePostForm from "@/components/Dashboard/Feed/CreatePostForm";
import { Prisma } from "@prisma/client";

type User = Prisma.MemberGetPayload<{
  include: {
    groups: true;
  };
}>;

type Post = Prisma.PostGetPayload<{
  include: {
    likes: true;
    comments: true;
    files: true;
    author: true;
  };
}>;
interface DashboardProps {
  user: User;
  posts: Post[];
}

const Dashboard = ({ user, posts }: DashboardProps) => {
  const [postFormOpen, setPostFormOpen] = React.useState(false);

  return (
    <div className="flex flex-col space-y-8 md:flex-row md:items-start md:space-x-2 lg:space-y-0 px-1">
      <div className="flex flex-col items-start justify-between space-y-2 mt-10 w-full md:w-3/4 max-w-xl">
        <div className="flex flex-row w-full justify-between">
          <h2 className="text-2xl font-bold tracking-wide ">Your Feed</h2>
          {!postFormOpen && (
            <button
              onClick={() => setPostFormOpen(true)}
              className="flex flex-row items-center justify-center space-x-1 hover:bg-gray-200 hover:cursor-pointer px-2 py-1 rounded-full"
            >
              <Plus className="h-3 w-3 text-blue-500" />
              <p className="text-sm text-blue-500 pr-1 mb-0.5">Create Post </p>
            </button>
          )}
        </div>
        <div className="flex flex-col min-h-[calc(100vh-20rem)] w-full">
          {/* {postFormOpen && <CreatePostForm user={user} />} */}
          {posts.map((post) => (
            <SocialCard key={post.id} post={post} user={user} />
          ))}
        </div>
      </div>

      <div className="flex-col hidden md:flex md:w-1/2 md:py-8 md:mt-6 md:px-6 max-w-md">
        <div className="bg-white min-h-[300px]  shadow-md rounded-md mt-3 ">
          <h2 className="text-md font-semibold tracking-wide ml-3 my-2 ">
            Upcoming Events
          </h2>
          <Separator className="text-gray-200" />
          <MiniEventCard />
        </div>
        <div className="bg-white min-h-[300px]  shadow-md rounded-md mt-6">
          <h2 className="text-md font-semibold tracking-wide ml-3 my-2">
            Top News
          </h2>
          <Separator className="text-gray-200" />
          <MiniNewsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
