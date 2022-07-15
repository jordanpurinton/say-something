import { Message, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import {
  throwBadRequest,
  throwServerError,
  throwUnauthorized,
} from '../utils';
import { createRouter } from './context';
import { isProfane } from '../../shared/utils/isProfane';

export default createRouter()
  .mutation('create', {
    input: z.object({
      content: z.string(),
      nickname: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { content, nickname } = input;

      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        const user = await prisma.user.findUnique({
          where: {
            id: ctx.session.id,
          },
        });

        if ((user?.canSendMessageTimestamp || -1) > new Date()) {
          return throwBadRequest('canSendMessageTimestamp must be in the past');
        }

        if (isProfane(content)) {
          return throwBadRequest('Content is profane. Please be nice.');
        }

        if (isProfane(nickname)) {
          return throwBadRequest('Nickname is profane. Please be nice.');
        }

        await prisma.message.create({
          data: { content, userId: ctx.session.id, nickname },
        });
      }
    },
  })
  .query('find-by-user', {
    async resolve({ ctx }) {
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        const messages = await prisma.message.findMany({
          where: {
            userId: ctx.session.id,
          },
        });

        if (messages.length === 0) {
          return { success: false, messages: [] };
        }

        return { success: true, messages };
      }
    },
  })
  .query('get-random', {
    async resolve({ ctx }) {
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        const user = await prisma.user.findUnique({
          where: {
            id: ctx.session.id,
          },
        });

        if ((user?.canViewMessageTimestamp || -1) > new Date()) {
          return throwBadRequest('canViewMessageTimestamp must be in the past');
        }

        const messageArray: Message[] = await prisma.$queryRaw(
          Prisma.sql`SELECT * FROM Message WHERE userId <> ${user?.id} ORDER BY RAND() LIMIT 1;`
        );

        const message = messageArray[0];

        const newViewedMessageIds = (user?.viewedMessageIds ||
          {}) as Prisma.JsonObject;

        if (message && !newViewedMessageIds?.hasOwnProperty(message.id)) {
          newViewedMessageIds[message.id] = true;
        }

        await prisma.user.update({
          where: {
            id: ctx.session?.id,
          },
          data: {
            viewedMessageIds: newViewedMessageIds,
          },
        });

        return { success: true, message: message };
      }
    },
  })
  .mutation('upvote-message', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      const message = await prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!message) {
        return throwServerError('Message not found');
      }

      if (message.userId === ctx?.session?.id) {
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
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        const message = await prisma.message.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!message) {
          return throwServerError('Message not found');
        }

        if (message.userId === ctx.session.id) {
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
      }
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
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        const user = await prisma.user.findUnique({
          where: {
            id: ctx.session.id,
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
      }
    },
  });
