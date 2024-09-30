import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request, res: Response) {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  try {
    const user = await currentUser();

    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Check if the user is in the database
    const dbUser = await db.user.findUnique({
      where: {
        email: user.primaryEmailAddress?.emailAddress,
      },
    });

    if (!dbUser) {
      // Create user in the database
      await db.user.create({
        data: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName ? user.firstName : "",
          lastName: user.lastName ? user.lastName : "",
          phone: "",
          imageURL: user.hasImage ? user.imageUrl : "",
        },
      });
    } else {
      const invitedUser = await db.user.findFirst({
        where: {
          email: user.primaryEmailAddress?.emailAddress,
        },
        include: {
          groupsAsCoach: true,
          groupsAsMember: true,
        },
      });

      if (invitedUser) {
        // Update user in the database
        await db.user.update({
          where: {
            email: user.primaryEmailAddress?.emailAddress,
          },
          data: {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName ? user.firstName : "",
            lastName: user.lastName ? user.lastName : "",
            phone: "",
            imageURL: user.hasImage ? user.imageUrl : "",
            groupsAsCoach: {
              connect: invitedUser.groupsAsCoach.map((group) => ({
                id: group.id,
              })),
            },
            groupsAsMember: {
              connect: invitedUser.groupsAsMember.map((group) => ({
                id: group.id,
              })),
            },
          },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error instanceof TRPCError && error.code === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      return NextResponse.json(
        { message: "Internal Server Error", error: error },
        { status: 500 }
      );
    }
  }
}
