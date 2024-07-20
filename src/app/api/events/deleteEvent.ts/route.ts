import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';
import { deleteStorageFile } from '@/lib/actions';

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;

    if (!input.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const coach = await db.user.findFirst({
        where: {
          id: input.userId,
        },
        include: {
          groupsAsCoach: true,
        },
      });

      if (!coach?.groupsAsCoach.some((group) => group.id === input.groupId)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const event = await db.event.findFirst({
        where: {
          id: input.eventId,
        },
        include: {
          File: true,
        },
      });

      if (!event) {
        return NextResponse.json(
          { message: 'Event not found' },
          { status: 404 }
        );
      }

      if (event.File.length > 0) {
        try {
          await Promise.all(
            event.File.map(async (file) => {
              await deleteStorageFile(file.fileName);
            })
          );
        } catch (error: any) {
          console.error('Could not delete files', error);
        }
      }

      await db.event.delete({
        where: {
          id: input.eventId,
        },
      });

      return NextResponse.json({ success: true }, { status: 200 });
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
