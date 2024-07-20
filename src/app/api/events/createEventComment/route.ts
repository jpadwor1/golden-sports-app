import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;

    if (!input.authorId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const author = await db.user.findUnique({
      where: {
        id: input.authorId,
      },
    });

    if (!author) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const comment = await db.eventComment.create({
        data: {
          content: input.content,
          event: {
            connect: {
              id: input.eventId,
            },
          },
          author: {
            connect: {
              id: input.authorId,
            },
          },
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
