import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const { groupId, requesterId } = req.query;

    if (typeof groupId !== 'string') {
      return NextResponse.json({ message: 'Invalid groupId' }, { status: 400 });
    }

    if (typeof requesterId !== 'string') {
      return NextResponse.json(
        { message: 'Invalid requesterId' },
        { status: 400 }
      );
    }

    try {
      const requester = await db.user.findUnique({
        where: {
          id: requesterId,
        },
      });

      if (!requester) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const group = await db.group.findFirst({
        where: {
          id: groupId,
        },
        include: {
          members: true,
        },
      });

      if (!group) {
        return NextResponse.json(
          { message: 'Group not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(group, { status: 200 });
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
