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
    const dbUser = await db.member.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // Create user in the database
      await db.member.create({
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
      const invitedUser = await db.member.findFirst({
        where: {
          email: user.primaryEmailAddress?.emailAddress,
        },
        include: {
          groups: true,
          roles: true,
        },
      });

      if (invitedUser) {
        // Update user in the database
        await db.member.update({
          where: {
            id: user.id,
          },
          data: {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName ? user.firstName : "",
            lastName: user.lastName ? user.lastName : "",
            phone: "",
            imageURL: user.hasImage ? user.imageUrl : "",
            groups: {
              connect: invitedUser.groups.map((group) => ({
                id: group.id,
              })),
            },
            roles: {
              connect: invitedUser.roles.map((role) => ({
                id: role.id,
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
