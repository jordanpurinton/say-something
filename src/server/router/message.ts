import { z } from 'zod';
import { prisma } from '../db/prisma';
import {
  getServerSession,
  throwBadRequest,
  throwNotFound,
  throwServerError,
} from '../utils';
import { createRouter } from './context';

export default createRouter()
  .mutation('create', {
    input: z.object({
      content: z.string(),
      nickname: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { content, nickname } = input;
      const session = await getServerSession(ctx);
      const sessionId = session?.userProfile.id;

      const user = await prisma.user.findUnique({
        where: {
          id: sessionId as string,
        },
      });

      if ((user?.canSendMessageTimestamp as Date) > new Date()) {
        return throwBadRequest('canSendMessageTimestamp must be in the past');
      }

      await prisma.message.create({
        data: { content, userId: sessionId as string, nickname },
      });
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
    async resolve({ ctx }) {
      const session = await getServerSession(ctx);
      const sessionId = session?.userProfile.id;

      const messages = await prisma.message.findMany({
        where: {
          userId: sessionId,
        },
      });

      if (messages.length === 0) {
        return throwNotFound(
          `No messages found for user with id: ${sessionId}`
        );
      }

      return { success: true, messages };
    },
  })
  .query('get-random', {
    async resolve({ ctx }) {
      const session = await getServerSession(ctx);

      const user = await prisma.user.findUnique({
        where: {
          id: session?.userProfile.id,
        },
      });

      if ((user?.canViewMessageTimestamp as Date) > new Date()) {
        return throwBadRequest('canViewMessageTimestamp must be in the past');
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
        return throwServerError('Message not found');
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
        return throwServerError('Message not found');
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
        return throwServerError('Message not found');
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
