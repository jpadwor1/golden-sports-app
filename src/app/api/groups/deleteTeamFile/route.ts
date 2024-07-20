import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';
import { deleteStorageFile } from '@/lib/actions';

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const { groupId, fileId, userId } = req.query;

    if (typeof fileId !== 'string') {
      return NextResponse.json({ message: 'Invalid fileId' }, { status: 400 });
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

    const iCoach = user.groupsAsCoach.some((group) => group.id === groupId);

    if (!iCoach) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const file = await db.file.findUnique({
        where: {
          id: fileId,
        },
      });

      if (!file) {
        return NextResponse.json(
          { message: 'File not found' },
          { status: 404 }
        );
      }

      await deleteStorageFile(file.fileName);

      await db.file.delete({
        where: {
          id: fileId,
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
