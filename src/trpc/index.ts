import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import z from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { randomUUID } from 'crypto';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import sgMail from '@sendgrid/mail';
import { addUser } from '@/lib/actions';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          name:
            user.given_name && user.family_name
              ? `${user.given_name} ${user.family_name}`
              : user.given_name
              ? user.given_name
              : '',
          phone: '',
          imageURL: user.picture,
        },
      });
    }

    return { success: true };
  }),

  getCustomers: privateProcedure.query(async ({ ctx }) => {
    const users = await db.user.findMany();

    return users;
  }),

  addCustomer: privateProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        email: z.string(),
        phone: z.string(),
        nextServiceDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (dbUser) {
        await db.user.update({
          where: {
            email: dbUser.email,
          },
          data: {
            id: dbUser.id,
            name: input.name,
            email: dbUser.email,
            phone: input.phone,
          },
        });

        return dbUser;
      }

      throw new TRPCError({ code: 'NOT_FOUND' });
    }),

  createGroup: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        files: z.object({
          id: z.string().optional(),
          downloadURL: z.string(),
          fileName: z.string(),
          fileType: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (dbUser) {
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
                uploadStatus: 'SUCCESS',
                uploadDate: new Date(),
              },
            },
            logoURL: input.files.downloadURL,
            coach: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        return group;
      }

      throw new TRPCError({ code: 'NOT_FOUND' });
    }),

  updateUserProfileSettings: privateProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        children: z
          .array(
            z.object({
              name: z.string(),
              age: z.number(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (dbUser) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: input.fullName,
            email: input.email,
            phone: input.phone,
          },
        });
      }

      return { success: true };
    }),

  addTeamMember: privateProcedure
    .input(
      z.object({
        teamId: z.string(),
        member: z.array(
          z.object({
            name: z.string(),
            email: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      console.log('Input received:', input);

      try {
        // Use Promise.all to wait for all addUser calls to complete
        await Promise.all(input.member.map((member) => addUser({ ...member })));

        await Promise.all(
          input.member.map(async (member) => {
            const dbUser = await db.user.findFirst({
              where: {
                email: member.email,
              },
            });

            if (dbUser) {
              return new Error('User already exists');
            }

            const firstName = member.name.split(' ')[0];
            const lastName = member.name.split(' ')[1];

            const fullName = lastName ? `${firstName} ${lastName}` : firstName;

            await db.user.create({
              data: {
                id: randomUUID(),
                name: fullName,
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
          })
        );
      } catch (error: any) {
        // Handle errors here
        if (Array.isArray(error)) {
          // If multiple errors are thrown, concatenate their messages
          const errorMessages = error.map((e) => e.message).join(', ');
          throw errorMessages;
        } else {
          console.log(error);
          throw error;
        }
      }
      return { success: true };
    }),
  sendContactFormEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

      const sendEmail = async (to: string) => {
        const msg = {
          to: to,
          from: 'john@johnpadworski.dev',
          subject: ' ',
          html: ' ',
          text: ' ',
          template_id: 'd-aa89f78d44df4fa9a92e24dcf3fcfbfe',
          dynamic_template_data: {
            sender_email: input.email,
            sender_message: input.message,
          },
        };

        try {
          await sgMail.send(msg);
          console.log('Email sent');
        } catch (error) {
          console.error('Error sending email:', error);

          throw new Error('Failed to send email');
        }
      };

      await sendEmail(input.email);
    }),

  getFile: privateProcedure
    .input(z.object({ downloadURL: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const file = await db.file.findFirst({
        where: {
          key: input.downloadURL,
        },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      return file;
    }),

  getCreateFile: privateProcedure
    .input(
      z.object({
        downloadURL: z.string(),
        fileName: z.string(),
        fileType: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      console.log('Input received:', input);
      const doesFileExist = await db.file.findFirst({
        where: {
          key: input.downloadURL,
        },
      });

      if (doesFileExist) return;
      console.log('going to create file');

      const createdFile = await db.file.create({
        data: {
          key: input.downloadURL,
          fileName: input.fileName,
          url: input.downloadURL,
          fileType: input.fileType,
          uploadStatus: 'PROCESSING',
          groupId: input.groupId,
        },
      });

      if (!createdFile) throw new TRPCError({ code: 'NOT_FOUND' });

      try {
        const response = await fetch(input.downloadURL);

        await db.file.update({
          where: { id: createdFile.id },
          data: {
            uploadStatus: 'SUCCESS',
          },
        });
      } catch (err) {
        await db.file.update({
          where: { id: createdFile.id },
          data: {
            uploadStatus: 'FAILED',
          },
        });
      }

      return createdFile;
    }),
});

export type AppRouter = typeof appRouter;
