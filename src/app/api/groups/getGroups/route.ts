import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const userId = req.query.userId;

    if (typeof userId !== 'string') {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    try {
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          groupsAsCoach: true,
          groupsAsMember: true,
        },
      });

      if (!dbUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      if (
        dbUser.groupsAsCoach.length === 0 &&
        dbUser.groupsAsMember.length === 0
      ) {
        return NextResponse.json(
          { message: 'No groups found' },
          { status: 404 }
        );
      }

      const groups = [...dbUser.groupsAsCoach, ...dbUser.groupsAsMember];

      return NextResponse.json(groups, { status: 200 });
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
