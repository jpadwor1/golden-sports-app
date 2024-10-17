import React from "react";
import { db } from "@/db";
import { redirect } from "next/navigation";
import HorizontalNavbar from "@/components/Navigation/horizontal-navbar";
import Image from "next/image";
import { ExtendedEvent, ExtendedPolls } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { Payment } from "@prisma/client";
import { Post } from "@/lib/utils";

interface PageProps {
  params: {
    groupId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = await currentUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.member.findFirst({
    where: {
      id: user.id,
    },
    include: {
      groups: true,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
  }

  const groups = dbUser.groups;
  let allEvents: any[] = [];
  let allPosts: any[] = [];
  let allPolls: any[] = [];
  let allPayments: any[] = [];

  for (const group of groups) {
    const dbEvents= await db.event.findMany({
      where: {
        invitees: {
          some: {
            id: dbUser.id,
          },
        },
        groupId: group.id,
      },
      include: {
        payments: true,
        invitees: true,
        group: true,
        files: true,
      },
      orderBy: {
        startDateTime: "asc",
      },
    });
    allEvents = [...allEvents, ...dbEvents];

    const dbPosts = await db.post.findMany({
      where: {
        groupId: {
          in: groups.map((g) => g.id),
        },
      },
      include: {
        likes: true,
        comments: true,
        files: true,
        author: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    const polls = await db.poll.findMany({
      where: {
        groupId: group.id,
      },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
        votes: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            timestamp: "desc",
          },
        },
        author: true,
      },
    });

    allPosts = [...allPosts, ...dbPosts];
    allPolls = [...allPolls, ...polls];

    const dbPayments = await db.payment.findMany({
      where: {
        groupId: group.id,
      },
    });
    allPayments = [...allPayments, ...dbPayments];
  }

  return (
    <>
      <div className="w-full h-[300px] overflow-hidden mb-0">
        <Image
          src="/flex-ui-assets/images/blog-content/content-photo1.jpg"
          alt="Team Banner"
          layout="responsive"
          width={500}
          height={300}
        />
      </div>
      <HorizontalNavbar
        polls={allPolls}
        posts={allPosts}
        events={allEvents}
        user={dbUser}
        payments={allPayments}
      />
    </>
  );
};

export default Page;
