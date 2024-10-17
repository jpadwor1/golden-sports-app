import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import Dashboard from "../dashboard/Dashboard";
const Page = async () => {
  const user = await currentUser();

  if (!user || !user.id) redirect("/auth-callback?origin=client");

  const dbUser = await db.member.findFirst({
    where: {
      id: user.id,
    },
    include: {
      groups: true,
      payments: true,
      polls: true,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=client");
  }

  if (dbUser.groups.length === 0) {
    redirect("/client/join-group");
  }

  return <Dashboard user={dbUser} posts={[]} />;
};

export default Page;
