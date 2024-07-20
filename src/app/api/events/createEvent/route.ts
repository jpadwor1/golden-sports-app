import { NextApiRequest, NextApiResponse } from 'next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
      const eventData: any = {
        title: input.title,
        description: input.description,
        address: input.address,
        startDateTime: new Date(input.startDateTime),
        endDateTime: input.endDateTime ? new Date(input.endDateTime) : null,
        recurringEndDate: input.recurringEndDate
          ? new Date(input.recurringEndDate)
          : null,
        reminders: input.reminders,
        repeatFrequency: input.repeatFrequency
          ? input.repeatFrequency.join(',')
          : null,
        group: {
          connect: {
            id: input.groupId,
          },
        },
      };

      if (input.files && input.files.length > 0) {
        eventData['File'] = {
          create: input.files.map((file: any) => ({
            key: file.key,
            fileName: file.fileName,
            url: file.downloadURL,
            fileType: file.fileType,
            group: {
              connect: {
                id: input.groupId,
              },
            },
          })),
        };
      }

      if (input.fee > 0) {
        eventData['feeAmount'] = input.fee;
        eventData['totalFeeAmount'] = input.fee + feeServiceCharge;
        eventData['feeDescription'] = input.feeDescription;
        eventData['feeServiceCharge'] = feeServiceCharge;
        eventData['collectFeeServiceCharge'] = input.collectFeeServiceCharge;
      }

      const event = await db.event.create({
        data: eventData,
      });

      if (input.invitees && input.invitees.length > 0) {
        for (const invitee of input.invitees) {
          await db.participant.create({
            data: {
              userId: invitee,
              eventId: event.id,
              status: 'UNANSWERED',
            },
          });

          await db.notification.create({
            data: {
              userId: invitee,
              resourceId: event.id,
              message: `You've been invited to ${event.title}.`,
              read: false,
              fromId: user.id,
              type: 'event',
            },
          });
        }
      }

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
