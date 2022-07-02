import { z } from 'zod';
import { prisma } from '../db/prisma';
import { createRouter } from './context';

export const userRouter = createRouter()
  .mutation('create', {
    input: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      emailVerified: z.date(),
      image: z.string(),
    }),
    async resolve({ input }) {
      const derived = {
        account: prisma.account.findUnique({
          where: {
            id: input.id,
          },
        }),
        sessions: [],
        messages: [],
      };

      await prisma.user.create({
        data: {
          ...input,
          ...derived,
        },
      });
    },
  })
  .query('find', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      return { success: true, user };
    },
  })
  .mutation('update-can-send-message-timestamp', {
    input: z.object({
      id: z.string(),
      canSendMessageTimestamp: z.string(),
    }),
    async resolve({ input }) {
      await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          canSendMessageTimestamp: input.canSendMessageTimestamp,
        },
      });
    },
  })
  .mutation('update-can-view-message-timestamp', {
    input: z.object({
      id: z.string(),
      canViewMessageTimestamp: z.string(),
    }),
    async resolve({ input }) {
      await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          canViewMessageTimestamp: input.canViewMessageTimestamp,
        },
      });
    },
  });
