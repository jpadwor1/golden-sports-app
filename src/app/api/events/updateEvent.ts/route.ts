import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;

    if (!input.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: input.userId,
      },
      include: {
        groupsAsCoach: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const isCoach = user.groupsAsCoach.some(
      (group) => group.id === input.groupId
    );

    if (!isCoach) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let feeServiceCharge = 0;

    if (input.feeServiceCharge) {
      feeServiceCharge = input.fee * 0.029 + 0.3;
    }

    try {
      const event = await db.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          title: input.title,
          description: input.description,
          address: input.address,
          startDateTime: new Date(input.startDateTime),
          endDateTime: input.endDateTime ? new Date(input.endDateTime) : null,
          feeAmount: input.fee,
          totalFeeAmount: input.fee + feeServiceCharge,
          feeDescription: input.feeDescription,
          feeServiceCharge: feeServiceCharge,
          collectFeeServiceCharge: input.collectFeeServiceCharge,
          reminders: input.reminders,
          group: {
            connect: {
              id: input.groupId,
            },
          },
        },
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  } catch (error: any) {
    if (error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } else {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  }
}
