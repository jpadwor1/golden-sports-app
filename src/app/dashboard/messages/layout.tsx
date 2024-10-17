import React from "react";
import SidebarNav from "@/components/Layout/SidebarNav";
import MarginWidthWrapper from "@/components/Layout/margin-width-wrapper";
import Header from "@/components/Layout/header";
import HeaderMobile from "@/components/Layout/header-mobile";
import PageWrapper from "@/components/Layout/page-wrapper";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

interface MessagesLayoutProps {
  children: React.ReactNode;
}

export default async function MessagesLayout({
  children,
}: MessagesLayoutProps) {
  const user = await currentUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.member.findUnique({
    where: {
      id: user.id,
    },
    include: {
      notifications: true,
    },
  });
  if (!dbUser || !dbUser.id) redirect("/auth-callback?origin=dashboard/group");
  return (
    <div className="flex">
      <SidebarNav userId={user.id} />
      <main className="flex-1">
        <MarginWidthWrapper>
          <Header user={dbUser} />
          {/* <HeaderMobile /> */}
          <PageWrapper>{children}</PageWrapper>
        </MarginWidthWrapper>
      </main>
    </div>
  );
}
