import React from "react";
import SidebarNav from "@/components/Layout/SidebarNav";
import MarginWidthWrapper from "@/components/Layout/margin-width-wrapper";
import Header from "@/components/Layout/header";
import HeaderMobile from "@/components/Layout/header-mobile";
import PageWrapper from "@/components/Layout/page-wrapper";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

interface GroupLayoutProps {
  children: React.ReactNode;
}

export default async function GroupLayout({ children }: GroupLayoutProps) {
  let user = null;
  let dbUser = null;

  try {
    const user = await currentUser();

    if (!user || !user.id) return new Error("User not found");

    dbUser = await db.member.findUnique({
      where: {
        id: user.id,
      },
      include: {
        notifications: true,
      },
    });

    if (!dbUser || !dbUser.id) return new Error("User not found");
  } catch (error) {
    console.error(error);
    redirect("/auth-callback?origin=dashboard/group");
  }

  console.log(dbUser.id);

  return (
    <>
      <SidebarNav userId={dbUser.id} />
      <main className="flex-1">
        <MarginWidthWrapper>
          <Header user={dbUser} />
          <HeaderMobile user={dbUser} />
          <PageWrapper>{children}</PageWrapper>
        </MarginWidthWrapper>
      </main>
    </>
  );
}
