import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import z from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { randomUUID } from 'crypto';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import sgMail from '@sendgrid/mail';

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
          name: '',
          phone: '',
        },
      });

      
    }

    return { success: true };
  }),

  getCustomers: privateProcedure.query(async ({ ctx }) => {
    const customers = await db.customer.findMany();

    return customers;
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
        const customer = await db.customer.update({
          where: {
            email: dbUser.email,
          },
          data: {
            id: dbUser.id,
            name: input.name,
            address: input.address,
            email: dbUser.email,
            phone: input.phone,
            nextServiceDate: input.nextServiceDate,
          },
        });

        return customer;
      }

      const currentCustomer = await db.customer.findFirst({
        where: {
          email: input.email,
          address: input.address,
        },
      });

      if (currentCustomer) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Customer already exists',
        });
      }

      const customer = await db.customer.create({
        data: {
          id: randomUUID(),
          name: input.name,
          address: input.address,
          email: input.email,
          phone: input.phone,
          nextServiceDate: input.nextServiceDate,
        },
      });

      return customer;
    }),

  updateCustomer: privateProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        address: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        nextServiceDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const dbCustomer = await db.customer.findFirst({
        where: {
          id: input.id,
        },
      });

      const dbUser = await db.user.findFirst({
        where: {
          id: input.id,
          address: input.address,
        },
      });

      if (dbCustomer) {
        const customer = await db.customer.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            address: input.address,
            email: input.email,
            phone: input.phone,
          },
        });

        if (dbUser) {
          await db.user.update({
            where: {
              id: input.id,
            },
            data: {
              name: input.name,
              address: input.address,
              email: input.email,
              phone: input.phone,
            },
          });
        }
      }

      return { success: true };
    }),

  deleteCustomer: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      await db.customer.delete({
        where: {
          id: input.id,
        },
      });
      return { success: true };
    }),

  updateUserProfileSettings: privateProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        address: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        nextServiceDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const dbCustomer = await db.customer.findFirst({
        where: {
          id: user.id,
        },
      });

      const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (dbCustomer) {
        await db.customer.update({
          where: {
            id: user.id,
          },
          data: {
            name: input.fullName,
            address: input.address,
            email: input.email,
            phone: input.phone,
            isProfileComplete: true,
          },
        });

        if (dbUser) {
          await db.user.update({
            where: {
              id: user.id,
            },
            data: {
              name: input.fullName,
              address: input.address,
              email: input.email,
              phone: input.phone,
            },
          });
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
          name: input.fileName,
          url: input.downloadURL,
          uploadStatus: 'PROCESSING',
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

  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl('/profile/billing');

    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });
      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        // {
        //   price: PLANS.find((plan) => plan.name === 'Pro')?.price.priceIds.test,
        //   quantity: 1,
        // },
      ],

      metadata: {
        userId: userId,
      },
    });
    return { url: stripeSession.url };
  }),
});

export type AppRouter = typeof appRouter;
