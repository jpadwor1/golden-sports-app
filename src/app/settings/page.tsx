import React from "react";
import { ProfileForm } from "./ProfileForm";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { Member } from "@prisma/client";

const Page = async () => {
  const user = await currentUser();

  const dbUser: Member | null = await db.member.findFirst({
    where: {
      id: user?.id,
    },
    include: {
      guardians: true,
    },
  });

  return (
    <div className="space-y-6 bg-white shadow-md p-6 rounded-md">
      {!dbUser?.isProfileComplete && (
        <div>
          <h1 className="text-destructive text-xl font-medium">
            Please complete profile information to continue.
          </h1>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
      {/* <ProfileForm user={dbUser} /> */}
    </div>
  );
};

export default Page;
