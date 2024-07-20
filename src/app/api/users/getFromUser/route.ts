import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const { requesterId, userId } = req.query;

    if (typeof userId !== 'string') {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    if (typeof requesterId !== 'string') {
      return NextResponse.json(
        { message: 'Invalid requesterId' },
        { status: 400 }
      );
    }

    const requester = await db.user.findUnique({
      where: {
        id: requesterId,
      },
    });

    if (!requester) {
      return NextResponse.json(
        { message: 'Requester not authorized' },
        { status: 401 }
      );
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(dbUser, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
