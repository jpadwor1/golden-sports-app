import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { NextResponse } from 'next/server';
import { addUser } from '@/lib/actions';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
    const input = req.body;
    if (!input.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: input.userId,
      },
      include: {
        groupsAsCoach: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (
      !dbUser.groupsAsCoach.some(
        (group: { id: string }) => group.id === input.teamId
      )
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const results = await Promise.allSettled(
      input.member.map(async (member: { name: string; email: string }) => {
        const dbUser = await db.user.findFirst({
          where: { email: member.email },
        });

        if (dbUser) {
          const [firstName, lastName] = member.name.split(' ');

          await db.user.update({
            where: { email: member.email },
            data: {
              firstName: firstName,
              lastName: lastName,
              phone: '',
              imageURL: '',
              groupsAsMember: {
                connect: {
                  id: input.teamId,
                },
              },
            },
          });
        } else {
          try {
            const newUserInfo = await addUser(member); //add user to KindeAuth
            const [firstName, lastName] = member.name.split(' ');

            if (!newUserInfo) return new Error('Failed to add user');

            const newUser = await db.user.create({
              data: {
                firstName: firstName,
                lastName: lastName,
                email: member.email,
                phone: '',
                imageURL: '',
                groupsAsMember: {
                  connect: {
                    id: input.teamId,
                  },
                },
              },
            });

            if (!newUser) {
              throw new Error('Failed to create user');
            }

            await db.user.update({
              where: {
                id: newUser.id,
              },
              data: {
                groupsAsMember: {
                  connect: {
                    id: input.teamId,
                  },
                },
              },
            });
          } catch (error) {
            console.error('Error in adding user:', error);
            throw new Error('Error in adding user');
          }
        }
      })
    );

    results.forEach((result) => {
      if (result.status === 'rejected') {
        console.error('Error in adding team member:', result.reason);
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (Array.isArray(error)) {
      // If multiple errors are thrown, concatenate their messages
      const errorMessages = error.map((e) => e.message).join(', ');
      return NextResponse.json({ message: errorMessages }, { status: 500 });
    } else {
      console.error(error);
      return NextResponse.json(
        { message: 'Internal Server Error', error: error.message },
        { status: 500 }
      );
    }
  }
}
