import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const { eventId, userId } = req.query;

    if (typeof eventId !== 'string') {
      return NextResponse.json({ message: 'Invalid eventId' }, { status: 400 });
    }

    if (typeof userId !== 'string') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const comments = await db.eventComment.findMany({
        where: {
          eventId: eventId,
        },
        include: {
          author: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      return NextResponse.json({ comments: comments }, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { message: 'Internal Server Error', error: error.message },
        { status: 500 }
      );
    }
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
