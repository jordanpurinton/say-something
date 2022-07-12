import { Message, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { getServerSession, throwBadRequest, throwServerError } from '../utils';
import { createRouter } from './context';
import Filter from 'bad-words';

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
      const filter = new Filter();

      const user = await prisma.user.findUnique({
        where: {
          id: sessionId,
        },
      });

      if ((user?.canSendMessageTimestamp || -1) > new Date()) {
        return throwBadRequest('canSendMessageTimestamp must be in the past');
      }

      if (filter.isProfane(content)) {
        return throwBadRequest('Content is profane. Please be nice.');
      }

      await prisma.message.create({
        data: { content, userId: sessionId as string, nickname },
      });
    },
  })
  .query('find', {
    input: z.object({
      id: z.string(),
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
        return { success: false, messages: [] };
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

      if ((user?.canViewMessageTimestamp || -1) > new Date()) {
        return throwBadRequest('canViewMessageTimestamp must be in the past');
      }

      const messageArray: Message[] = await prisma.$queryRaw(
        Prisma.sql`SELECT * FROM Message ORDER BY RAND() LIMIT 1;`
      );

      const message = messageArray[0];

      const newViewedMessageIds = (user?.viewedMessageIds ||
        {}) as Prisma.JsonObject;

      if (message && !newViewedMessageIds?.hasOwnProperty(message.id)) {
        newViewedMessageIds[message.id] = true;
      }

      await prisma.user.update({
        where: {
          id: session?.userProfile.id,
        },
        data: {
          viewedMessageIds: newViewedMessageIds,
        },
      });

      return { success: true, message: message };
    },
  })
  .mutation('upvote-message', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const session = await getServerSession(ctx);
      const message = await prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!message) {
        return throwServerError('Message not found');
      }

      if (message.userId === session?.userProfile.id) {
        return throwBadRequest('Cannot upvote your own message');
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
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const session = await getServerSession(ctx);
      const message = await prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!message) {
        return throwServerError('Message not found');
      }

      if (message.userId === session?.userProfile.id) {
        return throwBadRequest('Cannot downvote your own message');
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
      id: z.string(),
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
  })
  .query('find-viewed-messages', {
    async resolve({ ctx }) {
      const session = await getServerSession(ctx);

      const user = await prisma.user.findUnique({
        where: {
          id: session?.userProfile.id,
        },
      });

      if (
        user?.viewedMessageIds &&
        typeof user?.viewedMessageIds === 'object'
      ) {
        let viewedMessageIdsObj = user?.viewedMessageIds;

        let viewedMessageIds: string[] = [];

        if (viewedMessageIdsObj) {
          viewedMessageIds = Object.keys(
            viewedMessageIdsObj as Prisma.JsonObject
          );
        }

        let messagesToReturn: Message[] = [];

        if (viewedMessageIds.length > 0) {
          messagesToReturn = await prisma.message.findMany({
            where: {
              id: {
                in: (viewedMessageIds as []) || [],
              },
            },
          });
        } else if (viewedMessageIds.length === 0) {
          return { success: true, messages: [] };
        }

        return { success: true, messages: messagesToReturn || [] };
      }
    },
  });
