import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { createRouter } from './context';

export default createRouter()
  .mutation('create', {
    input: z.object({
      content: z.string(),
      userId: z.string(),
      nickname: z.string(),
    }),
    async resolve({ input }) {
      const { content, userId, nickname } = input;

      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if ((user?.canSendMessageTimestamp as Date) > new Date()) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'canSendMessageTimestamp must be in the past',
        });
      }

      await prisma.message.create({ data: { content, userId, nickname } });
    },
  })
  .query('find', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });
      return { success: true, message };
    },
  })
  .query('find-by-user', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const messages = await prisma.message.findMany({
        where: {
          userId: input.userId,
        },
      });

      if (messages.length === 0) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: `No messages found for user with id: ${input.userId}`,
        });
      }

      return { success: true, messages };
    },
  })
  .query('get-random', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if ((user?.canViewMessageTimestamp as Date) > new Date()) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: 'canViewMessageTimestamp must be in the past',
        });
      }

      const count = await prisma.message.count();
      const id = Math.floor(Math.random() * count) + 1;

      const message = await prisma.message.findMany({
        where: {
          id: {
            equals: id,
          },
        },
        take: 1,
      });

      return { success: true, message: message[0] };
    },
  })
  .mutation('upvote-message', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!message) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Message not found',
        });
      }

      await prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          upvotes: message.upvotes + 1,
        },
      });
    },
  })
  .mutation('downvote-message', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!message) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Message not found',
        });
      }

      await prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          downvotes: message.downvotes + 1,
        },
      });
    },
  })
  .mutation('update-views', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!message) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Message not found',
        });
      }

      await prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          views: message.views + 1,
        },
      });
    },
  });
