import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { NextResponse } from 'next/server';

interface QueryParams {
  groupId: string;
  userId: string;
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  
  try {
    const {groupId, userId} = req.query as Partial<QueryParams>;
    if (!userId && userId !== 'undefined') {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, {status: 401});
    }

    if (typeof groupId !== 'string') {
      return NextResponse.json({ message: 'Invalid groupId' }, { status: 400 });
    }

    // Check if the user is a member of the group
    
    const dbUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        groupsAsMember: {
          where: {
            id: groupId,
          },
        },
      },
    });

    if (!dbUser?.groupsAsMember.length) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 401 });
    }

    // Retrieve team members from the database
    const users = await db.user.findMany({
      where: {
        OR: [
          {
            groupsAsMember: {
              some: {
                id: groupId,
              },
            },
          },
          {
            groupsAsCoach: {
              some: {
                id: groupId,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    if (error instanceof TRPCError && error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  }
}