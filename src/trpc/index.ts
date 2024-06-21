import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import z, { boolean } from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { randomUUID } from 'crypto';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import sgMail from '@sendgrid/mail';
import { addUser, deleteStorageFile, startFileUpload } from '@/lib/actions';
import { create } from 'domain';
import { Event } from '@prisma/client';
import { IconInputAi } from '@tabler/icons-react';
import { group } from 'console';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    // check if the user is in the database
    const dbUser = await db.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!dbUser) {
      // create user in db
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
      });

      if (invitedUser) {
        // update user in db
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
          },
        });
      }
    }

    return { success: true };
  }),

  getTeamMembers: privateProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;
      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const users = await db.user.findMany({
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
      return users;
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

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: 'COACH',
          },
        });
        return group;
      }

      throw new TRPCError({ code: 'NOT_FOUND' });
    }),

  deleteTeam: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      try {
        // Use a transaction to ensure atomicity
        await db.$transaction(async (prisma) => {
          // Delete the group
          await prisma.group.delete({
            where: {
              id: input,
            },
          });

          // Fetch users who are members of the group
          const memberUsers = await prisma.user.findMany({
            where: {
              groupsAsMember: {
                some: {
                  id: input,
                },
              },
            },
          });

          // Disconnect the group from each member
          for (const user of memberUsers) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                groupsAsMember: {
                  disconnect: {
                    id: input,
                  },
                },
              },
            });
          }

          // Fetch users who are coaches of the group
          const coachUsers = await prisma.user.findMany({
            where: {
              groupsAsCoach: {
                some: {
                  id: input,
                },
              },
            },
          });

          // Disconnect the group from each coach
          for (const user of coachUsers) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                groupsAsCoach: {
                  disconnect: {
                    id: input,
                  },
                },
              },
            });
          }
        });

        return { success: true };
      } catch (error: any) {
        // Handle specific error for NOT_FOUND or general errors
        if (error.message === 'NOT_FOUND') {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        console.error(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  updateUserProfileSettings: privateProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
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
        include: {
          Children: true,
        },
      });

      if (dbUser) {
        const currentChildren = dbUser.Children || [];

        const inputChildrenNames = new Set(
          input.children?.map((child) => child.name)
        );

        const childrenToUpdate = currentChildren
          .filter((cc) => inputChildrenNames.has(cc.name))
          .map((cc) => {
            const inputData = input.children?.find((ic) => ic.name === cc.name);
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
          .filter((cc) => !inputChildrenNames.has(cc.name))
          .map((cc) => ({ id: cc.id }));

        const childrenToCreate = input.children?.filter(
          (ic) => !currentChildren.some((cc) => cc.name === ic.name)
        );

        await db.user.update({
          where: {
            id: user.id,
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
      try {
        const results = await Promise.allSettled(
          input.member.map(async (member) => {
            const dbUser = await db.user.findFirst({
              where: { email: member.email },
            });

            if (dbUser) {
              const [firstName, lastName]: string[] = member.name.split(' ');

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
                await addUser(member);
                const [firstName, lastName] = member.name.split(' ');
                const fullName = lastName
                  ? `${firstName} ${lastName}`
                  : firstName;

                await db.user.create({
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
              } catch (error) {
                console.error('Error in adding user:', error);
              }
            }
          })
        );

        results.forEach((result) => {
          if (result.status === 'rejected') {
            console.error('Error in adding team member:', result.reason);
            // Handle individual errors or aggregate them as needed
          }
        });

        return { success: true };
      } catch (error: any) {
        // Handle errors here
        if (Array.isArray(error)) {
          // If multiple errors are thrown, concatenate their messages
          const errorMessages = error.map((e) => e.message).join(', ');
          throw new Error(errorMessages);
        } else {
          console.log(error);
          throw error;
        }
      }
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
        } catch (error) {
          console.error('Error sending email:', error);

          throw new Error('Failed to send email');
        }
      };

      await sendEmail(input.email);
    }),
  sendInvitationEmail: privateProcedure
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

      sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

      try {
        await Promise.all(
          input.member.map(async (member) => {
            const msg = {
              to: member.email,
              from: 'john@johnpadworski.dev',
              subject: ' ',
              html: ' ',
              text: ' ',
              template_id: 'd-35cb2c277bd44a599bcda5c1ee29ca0f',
              dynamic_template_data: {
                name: member.name,
                login_link: 'http://localhost:3000/api/auth/login?',
              },
            };

            await sgMail.send(msg);
          })
        );
      } catch (error) {
        console.error('Error sending email:', error);

        throw new Error('Failed to send email');
      }
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
      const doesFileExist = await db.file.findFirst({
        where: {
          key: input.downloadURL,
        },
      });

      if (doesFileExist) return;

      const createdFile = await db.file.create({
        data: {
          key: input.downloadURL,
          fileName: input.fileName,
          url: input.downloadURL,
          fileType: input.fileType,
          groupId: input.groupId,
        },
      });

      if (!createdFile) throw new TRPCError({ code: 'NOT_FOUND' });

      return createdFile;
    }),
  createPost: privateProcedure
    .input(
      z.object({
        postBody: z.string(),
        groupId: z.string(),
        files: z.array(
          z.object({
            downloadURL: z.string(),
            fileName: z.string(),
            fileType: z.string(),
            groupId: z.string(),
          })
        ),
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
        const post = await db.post.create({
          data: {
            content: input.postBody,
            Files: {
              create: input.files.map((file) => ({
                key: file.downloadURL,
                fileName: file.fileName,
                url: file.downloadURL,
                fileType: file.fileType,
                uploadDate: new Date(),
                group: {
                  connect: {
                    id: file.groupId,
                  },
                },
              })),
            },
            author: {
              connect: {
                id: user.id,
              },
            },
            group: {
              connect: {
                id: input.groupId,
              },
            },
          },
        });

        const groupMembers = await db.user.findMany({
          where: {
            groupsAsMember: {
              some: {
                id: input.groupId,
              },
            },
          },
        });

        await Promise.all(
          (groupMembers || []).map(async (member) => {
            await db.notification.create({
              data: {
                userId: member.id,
                resourceId: post.id,
                message: 'You have a new post.',
                read: false,
                fromId: userId,
                type: 'post',
              },
            });
          })
        );
        return post;
      }

      throw new TRPCError({ code: 'NOT_FOUND' });
    }),
  getComments: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const comments = await db.comment.findMany({
          where: {
            postId: input,
          },
          include: {
            likes: true,
            author: true,
            replyTo: true,
            replies: {
              include: {
                likes: true,
                author: true,
              },
            },
          },
          orderBy: {
            timestamp: 'desc',
          },
        });
        return { comments: comments };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  getEventComments: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const comments = await db.eventComment.findMany({
          where: {
            eventId: input,
          },
          include: {
            author: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
        });

        return { comments: comments };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),

  createComment: privateProcedure
    .input(
      z.object({
        authorId: z.string(),
        postId: z.string(),
        groupId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const comment = await db.comment.create({
          data: {
            content: input.content,
            post: {
              connect: {
                id: input.postId,
              },
            },
            author: {
              connect: {
                id: input.authorId,
              },
            },
          },
        });
        return { success: true };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  createEventComment: privateProcedure
    .input(
      z.object({
        authorId: z.string(),
        eventId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
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
        return { success: true };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),

  createLike: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        authorId: z.string(),
        commentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user || userId !== input.authorId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (!dbUser) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      if (input.commentId) {
        const comment = await db.comment.findFirst({
          where: {
            id: input.commentId,
          },
        });

        if (!comment) {
          return new TRPCError({ code: 'NOT_FOUND' });
        }

        const newLike = await db.like.create({
          data: {
            author: {
              connect: {
                id: input.authorId,
              },
            },
            post: {
              connect: {
                id: input.postId,
              },
            },
            Comment: {
              connect: {
                id: input.commentId,
              },
            },
          },
          include: {
            author: true,
            post: true,
          },
        });

        return { success: true, newLike };
      }

      const newLike = await db.like.create({
        data: {
          author: {
            connect: {
              id: input.authorId,
            },
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
        },
        include: {
          author: true,
          post: true,
        },
      });

      return { success: true, newLike };
    }),

  createReply: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        authorId: z.string(),
        content: z.string(),
        replyToId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user || userId !== input.authorId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (!dbUser) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      try {
        if (!input.replyToId) {
          const newComment = await db.comment.create({
            data: {
              content: input.content,
              post: {
                connect: {
                  id: input.postId,
                },
              },
              author: {
                connect: {
                  id: input.authorId,
                },
              },
            },
          });

          return { success: true, newComment };
        }

        const newReply = await db.comment.create({
          data: {
            content: input.content,
            post: {
              connect: {
                id: input.postId,
              },
            },
            replyTo: {
              connect: {
                id: input.replyToId,
              },
            },
            author: {
              connect: {
                id: input.authorId,
              },
            },
          },
        });

        return { success: true, newReply };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),

  createEvent: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        address: z.string(),
        startDateTime: z.string(),
        endDateTime: z.string().optional(),
        groupId: z.string(),
        fee: z.number(),
        feeDescription: z.string(),
        feeServiceCharge: z.number(),
        collectFeeServiceCharge: z.boolean(),
        notificationDate: z.string(),
        recurringEndDate: z.string().optional(),
        reminders: z.boolean(),
        repeatFrequency: z.array(z.string()).optional(),
        invitees: z.array(z.string()).optional(),
        files: z
          .array(
            z.object({
              downloadURL: z.string(),
              fileName: z.string(),
              fileType: z.string(),
              key: z.string(),
              uploadDate: z.string(),
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
            ? input.repeatFrequency?.join(',')
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
                fromId: userId,
                type: 'event',
              },
            });
          }
        }

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
  updateEvent: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        address: z.string(),
        startDateTime: z.string(),
        endDateTime: z.string().optional(),
        groupId: z.string(),
        fee: z.number(),
        feeDescription: z.string(),
        feeServiceCharge: z.number(),
        collectFeeServiceCharge: z.boolean(),
        reminders: boolean(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      let feeServiceCharge = 0;

      if (input.feeServiceCharge) {
        feeServiceCharge = input.fee * 0.029 + 0.3;
      }

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

      return { success: true };
    }),
  deleteEvent: privateProcedure
    .input(z.object({ eventId: z.string(), groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      try {
        const coach = await db.user.findFirst({
          where: {
            id: user.id,
          },
          include: {
            groupsAsCoach: true,
          },
        });

        if (!coach?.groupsAsCoach.some((group) => group.id === input.groupId)) {
          return new TRPCError({ code: 'NOT_FOUND' });
        }

        const event = await db.event.findFirst({
          where: {
            id: input.eventId,
          },
          include: {
            File: true,
          },
        });

        if (!event) return new TRPCError({ code: 'NOT_FOUND' });
        if (event.File.length > 0) {
          try {
            await Promise.all(
              event.File.map(async (file) => {
                const deleteResult = await deleteStorageFile(file.fileName);
              })
            );
          } catch (error: any) {
            console.error('Could not delete files', error);
          }
        }

        await db.event.delete({
          where: {
            id: input.eventId,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.error(error);
        return new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  getGroups: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const dbUser = await db.user.findFirst({
          where: {
            id: input,
          },
          include: {
            groupsAsCoach: true,
            groupsAsMember: true,
          },
        });

        if (!dbUser) {
          return [];
        }
        const groups = [...dbUser.groupsAsCoach, ...dbUser.groupsAsMember];

        return groups;
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  getGroup: privateProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { userId, user } = ctx;

    if (!userId || !user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      const group = await db.group.findFirst({
        where: {
          id: input,
        },
        include: {
          members: true,
        },
      });

      if (!group) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      return group;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }),
  updateParticipantStatus: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        eventId: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const participant = await db.participant.findFirst({
        where: {
          userId: input.userId,
          eventId: input.eventId,
        },
      });

      if (!participant) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      await db.participant.update({
        where: {
          userId_eventId: {
            userId: input.userId,
            eventId: input.eventId,
          },
        },
        data: {
          status: input.status,
        },
      });

      return { success: true };
    }),
  createPoll: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        options: z.array(
          z.object({
            option: z.string(),
          })
        ),
        hideVotes: z.boolean().optional(),
        dueDate: z.string(),
        allowComments: z.boolean().optional(),
        groupId: z.string(),
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
        include: {
          groupsAsCoach: true,
        },
      });

      if (!dbUser) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      if (dbUser.groupsAsCoach.every((group) => group.id !== input.groupId)) {
        return new TRPCError({ code: 'FORBIDDEN' });
      }

      const poll = await db.poll.create({
        data: {
          title: input.title,
          description: input.description,
          options: {
            create: input.options.map((option) => ({
              text: option.option,
            })),
          },
          hideVotes: input.hideVotes,
          expiresAt: new Date(input.dueDate),
          allowComments: input.allowComments,
          group: {
            connect: {
              id: input.groupId,
            },
          },
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return poll;
    }),
  createVote: privateProcedure
    .input(
      z.object({
        pollId: z.string(),
        optionId: z.string(),
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

      if (!dbUser) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      const poll = await db.poll.findFirst({
        where: {
          id: input.pollId,
        },
      });

      if (!poll) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      const option = await db.pollOption.findFirst({
        where: {
          id: input.optionId,
        },
      });

      if (!option) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      const vote = await db.pollVote.create({
        data: {
          Poll: {
            connect: {
              id: input.pollId,
            },
          },
          option: {
            connect: {
              id: input.optionId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return vote;
    }),
  createPollComment: privateProcedure
    .input(
      z.object({
        pollId: z.string(),
        comment: z.string(),
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

      if (!dbUser) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      const poll = await db.poll.findFirst({
        where: {
          id: input.pollId,
        },
      });

      if (!poll) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      const comment = await db.pollComment.create({
        data: {
          pollId: input.pollId,
          authorId: user.id,
          content: input.comment,
        },
      });

      return comment;
    }),
  getPollComments: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const comments = await db.pollComment.findMany({
          where: {
            pollId: input,
          },
          include: {
            author: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
        });
        return { comments: comments };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  getParticipants: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const participants = await db.participant.findMany({
          where: {
            eventId: input,
          },
          include: {
            user: true,
          },
        });
        return { participants: participants };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  addInvitees: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        invitees: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        for (const invitee of input.invitees) {
          await db.participant.create({
            data: {
              userId: invitee,
              eventId: input.eventId,
              status: 'UNANSWERED',
            },
          });

          await db.notification.create({
            data: {
              userId: invitee,
              resourceId: input.eventId,
              message: `You've been invited to an event.`,
              read: false,
              fromId: userId,
              type: 'event',
            },
          });
        }

        return { success: true };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  getFromUser: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const dbUser = await db.user.findFirst({
          where: {
            id: input,
          },
        });

        return dbUser;
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  getResource: privateProcedure
    .input(
      z.object({
        resourceId: z.string(),
        resourceType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {

        const resource =
          input.resourceType === 'comments' ||
          input.resourceType === 'posts' ||
          input.resourceType === 'likes'
            ? await db.post.findFirst({
                where: {
                  id: input.resourceId,
                },
              })
            : input.resourceType === 'events'
            ? await db.event.findFirst({
                where: {
                  id: input.resourceId,
                },
              })
            : input.resourceType === 'messages'
            ? await db.message.findFirst({
                where: {
                  id: input.resourceId,
                },
              })
            : input.resourceType === 'polls'
            ? await db.poll.findFirst({
                where: {
                  id: input.resourceId,
                },
              })
            : input.resourceType === 'payments'
            ? await db.payment.findFirst({
                where: {
                  id: input.resourceId,
                },
              })
            : undefined;

        if (!resource) {
          return new TRPCError({ code: 'NOT_FOUND' });
        }

        const groupId = resource?.groupId;

        return groupId;
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  updateNotificationReadStatus: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const notification = await db.notification.findFirst({
          where: {
            id: input,
          },
        });

        if (!notification) return new TRPCError({ code: 'NOT_FOUND' });
        if (notification?.read) return { success: true };

        await db.notification.update({
          where: {
            id: input,
          },
          data: {
            read: true,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  sendInviteeEventReminder: privateProcedure
    .input(
      z.array(
        z.object({
          userId: z.string(),
          eventId: z.string(),
          status: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        await Promise.all(
          input.map(async (invitee) => {
            if (invitee.status === 'UNANSWERED') {
              await db.notification.create({
                data: {
                  userId: invitee.userId,
                  resourceId: invitee.eventId,
                  message: `You have an event coming up soon.`,
                  read: false,
                  fromId: userId,
                  type: 'event',
                },
              });
            }
          })
        );

        return { success: true };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  uploadTeamFile: privateProcedure
    .input(
      z.object({
        files: z.array(
          z.object({
            downloadURL: z.string(),
            fileName: z.string(),
            fileType: z.string(),
            key: z.string(),
            uploadDate: z.string(),
          })
        ),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {

        const files = await Promise.all(
          input.files.map(async (file) => {
            const doesFileExist = await db.file.findFirst({
              where: {
                key: file.key,
              },
            });

            if (doesFileExist) return;

            const createdFile = await db.file.create({
              data: {
                key: file.key,
                fileName: file.fileName,
                url: file.downloadURL,
                fileType: file.fileType,
                groupId: input.groupId,
              },
            });

          })
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
          members.map(async (member) => {
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
            console.log('notification sent', member.firstName)
          })
        );

        return { success: true };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
  getTeamFiles: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const files = await db.file.findMany({
          where: {
            groupId: input,
            postId: null,
            eventId: null,
          },
        });
        return files;
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
    getUser: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const user = await db.user.findUnique({
          where: {
            id: input,
          },
        });

        if (!user) {
          return new TRPCError({ code: 'NOT_FOUND' });
        }

        return user;
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
    deleteTeamFile: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {

        const file = await db.file.findUnique({
          where: {
            id: input,
          },
        });

        if (!file) return new TRPCError({ code: 'NOT_FOUND' });

        await deleteStorageFile(file.fileName);

        await db.file.delete({
          where: {
            id: input,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
    getNotifications: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const notifications = await db.notification.findMany({
          where: {
            userId: input,
          },
          orderBy: {
            timestamp: 'desc',
          },
        });

        return notifications;
      } catch (error: any) {
        console.error(error);
        return error;
      }
    }),
    createPayment: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        basePrice: z.number(),
        dueDate: z.string(),
        groupId: z.string(),
        invitees: z.array(z.string()),
        totalPrice: z.number(),
        addTransactionFee: z.boolean(),
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
        include: {
          groupsAsCoach: true,
        },
      });

      if (!dbUser) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (dbUser.groupsAsCoach.every((group) => group.id !== input.groupId)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      try {
        await Promise.all(
          input.invitees.map(async (invitee) => {
            
            const payment = await db.payment.create({
              data: {
                title: input.title,
                authorId: dbUser.id,
                amount: input.totalPrice,
                description: input.description,
                paymentStatus: 'UNPAID',
                dueDate: new Date(input.dueDate),
                group: {
                  connect: {
                    id: input.groupId,
                  },
                },
                user: {
                  connect: {
                    id: invitee,
                  },
                },
              },
            });
            await db.notification.create({
              data: {
                userId: invitee,
                resourceId: payment.id,
                message: `You've been invited to a payment.`,
                read: false,
                fromId: userId,
                type: 'payment',
              },
            });
          })
        );
        
      } catch (error) {
        console.error(error);
        return error;
      }

      
      return { success: true };
    }),
    deletePayment: privateProcedure
    .input(
      z.string()
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;
      if (!userId || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const payment = await db.payment.findUnique({
        where: {
          id: input,
        },
      })

      if (!payment) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
        include: {
          groupsAsCoach: true,
        },
      });

      if (!dbUser) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (dbUser.groupsAsCoach.every((group) => group.id !== payment.groupId)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      try {
        await db.payment.delete({
          where: {
            id: input,
          },
        });
        
      } catch (error) {
        console.error(error);
        return error;
      }

      
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
