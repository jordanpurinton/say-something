import { createRouter } from './context';
import { prisma } from '../db/prisma';
import { z } from 'zod';

export const message = createRouter()
  .mutation('create', {
    input: z.object({
      content: z.string(),
      userId: z.string(),
      nickname: z.string(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.create({ data: { ...input } });
      return { success: true, message };
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
  .query('get-random', {
    async resolve() {
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
      const message = await prisma.message.findFirst({
        where: {
          id: {
            equals: input.id,
          },
        },
      });

      if (!message) {
        return { success: false, message: 'Message not found' };
      }

      await prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          upvotes: message.upvotes + 1,
        },
      });

      return { success: true, message: 'OK' };
    },
  })
  .mutation('downvote-message', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.findFirst({
        where: {
          id: {
            equals: input.id,
          },
        },
      });

      if (!message) {
        return { success: false, message: 'Message not found' };
      }

      await prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          downvotes: message.downvotes + 1,
        },
      });

      return { success: true, message: 'OK' };
    },
  })
  .mutation('update-views', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.findFirst({
        where: {
          id: {
            equals: input.id,
          },
        },
      });

      if (!message) {
        return { success: false, message: 'Message not found' };
      }

      await prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          views: message.views + 1,
        },
      });

      return { success: true, message: 'OK' };
    },
  });
