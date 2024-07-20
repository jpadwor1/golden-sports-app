import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;

    if (!input.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = await db.user.findUnique({
      where: {
        id: input.userId,
      },
      include: {
        groupsAsCoach: true,
      }
    });

    if (!sessionUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const isCoach = sessionUser.groupsAsCoach.some(
      (group) => group.id === input.groupId
    );

    if (!isCoach) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      for (const invitee of input.invitees) {
        await db.participant.create({
          data: {
            userId: invitee,
            eventId: input.eventId,
            status: 'UNANSWERED',
          },
        });

        await db.notification.create({
          data: {
            userId: invitee,
            resourceId: input.eventId,
            message: `You've been invited to an event.`,
            read: false,
            fromId: sessionUser.id,
            type: 'event',
          },
        });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  } catch (error: any) {
    if (error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } else {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  }
}
