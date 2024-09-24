import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { NextResponse } from "next/server";
import { Event } from "@prisma/client";

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  const body = await req.json();
  try {
    // const { groupId, userId } = req.query;
    const { userId } = body;

    if (typeof userId !== "string") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        groupsAsCoach: {
          select: {
            id: true,
          },
        },
        groupsAsMember: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const groups = [...user.groupsAsCoach, ...user.groupsAsMember];
    let events: Event[] = [];
    try {
      for (const group of groups) {
        const eventsInGroup = await db.event.findMany({
          where: {
            groupId: group.id,
          },
        });
        events = [...events, ...eventsInGroup];
      }

      return NextResponse.json({ events: events }, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error.code === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      console.error(error);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }
  }
}
