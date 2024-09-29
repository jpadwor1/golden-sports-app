import React from "react";
import CreateTeamForm from "./CreateTeamForm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const Page = async () => {
  const user = await currentUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
    include: {
      groupsAsCoach: true,
      groupsAsMember: true,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
  }

  const userTeams = [...dbUser.groupsAsCoach, ...dbUser.groupsAsMember];

  const uniqueTeamIds = new Set();

  const teams = userTeams
    .filter((team) => {
      if (uniqueTeamIds.has(team.id)) {
        return false;
      } else {
        uniqueTeamIds.add(team.id);
        return true;
      }
    })
    .map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
      logoURL: group.logoURL,
      coachId: group.coachId,
    }));

  return (
    <div className="flex flex-col w-full bg-white shadow-md rounded-md h-full p-6">
      <h1 className="text-2xl tex-gray-900 font-semibold tracking-wide">
        Your Teams
      </h1>
      {dbUser.groupsAsCoach.length !== 0 ?? (
        <h2 className="text-md text-gray-600">
          Select a team to view team details.
        </h2>
      )}

      <Separator className="mt-2 mb-6" />
      <div className="grid md:grid-cols-3 gird-cols-1 gap-4 mb-6">
        {teams.map((team) =>
          team.coachId === dbUser.id ? (
            <Link href={`/settings/team/${team.id}`} key={team.id}>
              <Card className="hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <Image
                    src={team.logoURL || "/GSlogo.png"}
                    alt="Logo"
                    width={400}
                    height={400}
                  />
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Card className="hover:scale-105 hover:shadow-lg" key={team.id}>
              <CardHeader>
                <Image
                  src={team.logoURL || "/GSlogo.png"}
                  alt="Logo"
                  width={400}
                  height={400}
                />
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        )}
      </div>
      {dbUser.groupsAsCoach.length === 0 ? (
        <CreateTeamForm />
      ) : (
        <div className="flex justify-center">
          <Link
            href="/settings/team/create"
            className={cn(buttonVariants({}), "flex items-center space-x-2")}
          >
            <span>Create a new team</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
