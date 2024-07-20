import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;

    const dbUser = await db.user.findFirst({
      where: {
        id: input.userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const group = await db.group.create({
      data: {
        name: input.name,
        description: input.description,
        files: {
          create: {
            key: input.files.downloadURL,
            fileName: input.files.fileName,
            url: input.files.downloadURL,
            fileType: input.files.fileType,
            uploadDate: new Date(),
          },
        },
        logoURL: input.files.downloadURL,
        coach: {
          connect: {
            id: input.userId,
          },
        },
      },
    });

    await db.user.update({
      where: {
        id: input.userId,
      },
      data: {
        role: 'COACH',
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error: any) {
    if (error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } else if (error.code === 'NOT_FOUND') {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    } else {
      console.error(error);
      return NextResponse.json(
        { message: 'Internal Server Error', error: error.message },
        { status: 500 }
      );
    }
  }
}
