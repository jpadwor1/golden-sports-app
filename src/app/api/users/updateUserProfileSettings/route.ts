import { NextApiRequest, NextApiResponse } from 'next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { NextResponse } from 'next/server';

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  try {
   
    const {input, userId} = req.body;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        Children: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (dbUser) {
      const currentChildren = dbUser.Children || [];

      const inputChildrenNames = new Set(
        input.children?.map((child: { name: string }) => child.name)
      );

      const childrenToUpdate = currentChildren
        .filter((cc: { name: string }) => inputChildrenNames.has(cc.name))
        .map((cc: { id: string, name: string }) => {
          const inputData = input.children?.find((ic: { name: string }) => ic.name === cc.name);
          return {
            where: {
              id: cc.id,
            },
            data: {
              name: inputData?.name,
              age: inputData?.age,
            },
          };
        });

      const childrenToDelete = currentChildren
        .filter((cc: { name: string }) => !inputChildrenNames.has(cc.name))
        .map((cc: { id: string }) => ({ id: cc.id }));

      const childrenToCreate = input.children?.filter(
        (ic: { name: string }) => !currentChildren.some((cc: { name: string }) => cc.name === ic.name)
      );

      await db.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          isProfileComplete: true,
          Children: {
            create: childrenToCreate,
            updateMany: childrenToUpdate,
            deleteMany: childrenToDelete,
          },
          imageURL: input.files.downloadURL,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error instanceof TRPCError && error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  }
}