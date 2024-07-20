import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { NextResponse } from 'next/server';

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const { teamId, userId } = req.query;

    if (typeof teamId !== 'string') {
      return NextResponse.json({ message: 'Invalid teamId' }, { status: 400 });
    }

    if (typeof userId !== 'string') {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        groupsAsCoach: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const isCoach = user.groupsAsCoach.some((group) => group.id === teamId);

    if (!isCoach) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Use a transaction to ensure atomicity
      await db.$transaction(async (prisma) => {
        // Delete the group
        await prisma.group.delete({
          where: {
            id: teamId,
          },
        });

        // Fetch users who are members of the group
        const memberUsers = await prisma.user.findMany({
          where: {
            groupsAsMember: {
              some: {
                id: teamId,
              },
            },
          },
        });

        // Disconnect the group from each member
        for (const user of memberUsers) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              groupsAsMember: {
                disconnect: {
                  id: teamId,
                },
              },
            },
          });
        }

        // Fetch users who are coaches of the group
        const coachUsers = await prisma.user.findMany({
          where: {
            groupsAsCoach: {
              some: {
                id: teamId,
              },
            },
          },
        });

        // Disconnect the group from each coach
        for (const user of coachUsers) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              groupsAsCoach: {
                disconnect: {
                  id: teamId,
                },
              },
            },
          });
        }
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      if (error.message === 'NOT_FOUND') {
        return NextResponse.json(
          { message: 'Team not found' },
          { status: 404 }
        );
      }
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
