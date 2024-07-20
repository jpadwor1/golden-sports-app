import { NextApiRequest, NextApiResponse } from 'next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
    
  }

  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Check if the user is in the database
    const dbUser = await db.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!dbUser) {
      // Create user in the database
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.given_name ? user.given_name : '',
          lastName: user.family_name ? user.family_name : '',
          phone: '',
          imageURL: user.picture,
        },
      });
    } else {
      const invitedUser = await db.user.findFirst({
        where: {
          email: user.email,
        },
        include: {
          groupsAsCoach: true,
          groupsAsMember: true,
        },
      });

      if (invitedUser) {
        // Update user in the database
        await db.user.update({
          where: {
            email: user.email,
          },
          data: {
            id: user.id,
            email: user.email,
            firstName: user.given_name ? user.given_name : '',
            lastName: user.family_name ? user.family_name : '',
            imageURL: user.picture,
            phone: '',
            groupsAsCoach: {
              connect: invitedUser.groupsAsCoach.map((group) => ({
                id: group.id,
              })),
            },
            groupsAsMember: {
              connect: invitedUser.groupsAsMember.map((group) => ({
                id: group.id,
              })),
            },
          },
        });
      }
    }

      
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error instanceof TRPCError && error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } else {
      
        return NextResponse.json({ message: 'Internal Server Error', error: error }, { status: 500 });
    }
  }
}
