import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;

    if (!input.groupId || !input.files) {
      return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
    }

    const userId = input.userId;

    if (!userId) {
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
      await Promise.all(
        input.files.map(
          async (file: {
            downloadURL: string;
            fileName: string;
            fileType: string;
            key: string;
            uploadDate: string;
          }) => {
            const doesFileExist = await db.file.findFirst({
              where: {
                key: file.key,
              },
            });

            if (doesFileExist) return;

            await db.file.create({
              data: {
                key: file.key,
                fileName: file.fileName,
                url: file.downloadURL,
                fileType: file.fileType,
                groupId: input.groupId,
              },
            });
          }
        )
      );

      const members = await db.user.findMany({
        where: {
          OR: [
            {
              groupsAsMember: {
                some: {
                  id: input.groupId,
                },
              },
            },
            {
              groupsAsCoach: {
                some: {
                  id: input.groupId,
                },
              },
            },
          ],
        },
      });

      await Promise.all(
        members.map(async (member: { id: string; firstName: string }) => {
          await db.notification.create({
            data: {
              userId: member.id,
              resourceId: input.groupId,
              message: 'You have a new file.',
              read: false,
              fromId: userId,
              type: 'file',
            },
          });
        })
      );

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
