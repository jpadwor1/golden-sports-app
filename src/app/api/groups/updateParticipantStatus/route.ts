import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;

    if (!input.userId || !input.eventId || !input.status) {
      return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        id: input.userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const event = await db.event.findFirst({
      where: {
        id: input.eventId,
      },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const participant = await db.participant.findFirst({
      where: {
        userId: input.userId,
        eventId: input.eventId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { message: 'Participant not found' },
        { status: 404 }
      );
    }

    await db.participant.update({
      where: {
        userId_eventId: {
          userId: input.userId,
          eventId: input.eventId,
        },
      },
      data: {
        status: input.status,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } else {
      console.error(error);
      return NextResponse.json(
        { message: 'Internal Server Error', error: error.message },
        { status: 500 }
      );
    }
  }
}
