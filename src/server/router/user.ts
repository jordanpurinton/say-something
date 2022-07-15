import { z } from 'zod';
import { prisma } from '../db/prisma';
import { createRouter } from './context';
import { throwServerError, clearCookies, throwUnauthorized } from '../utils';

export default createRouter()
  .mutation('create', {
    input: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      emailVerified: z.date(),
      image: z.string(),
      viewedMessageIds: z.object({}),
    }),
    async resolve({ input }) {
      const derived = {
        account: await prisma.account.findUnique({
          where: {
            id: input.id,
          },
        }),
        sessions: [],
        messages: [],
      };

      if (!derived?.account?.id) {
        return throwServerError('Account not found');
      }

      await prisma.user.create({
        data: {
          ...input,
          ...derived,
        },
      });
    },
  })
  .query('find', {
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
        return { success: true, user };
      }
    },
  })
  .mutation('update-can-send-message-timestamp', {
    input: z.object({
      canSendMessageTimestamp: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        await prisma.user.update({
          where: {
            id: ctx.session.id,
          },
          data: {
            canSendMessageTimestamp: input.canSendMessageTimestamp,
          },
        });
      }
    },
  })
  .mutation('update-can-view-message-timestamp', {
    input: z.object({
      canViewMessageTimestamp: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        await prisma.user.update({
          where: {
            id: ctx.session.id,
          },
          data: {
            canViewMessageTimestamp: input.canViewMessageTimestamp,
          },
        });
      }
    },
  })
  .mutation('log-out', {
    async resolve({ ctx }) {
      clearCookies(ctx?.res);
      return { success: true };
    },
  })
  .mutation('delete', {
    async resolve({ ctx }) {
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        await prisma.user.delete({
          where: {
            id: ctx.session.id,
          },
        });

        clearCookies(ctx?.res);
      }
    },
  })
  .mutation('admin-reset-timeouts', {
    async resolve({ ctx }) {
      if (!ctx?.session ?? true) {
        return throwUnauthorized('Session not found');
      }

      if (ctx.session) {
        if (!ctx.session.isAdmin) {
          return throwUnauthorized('User must be an admin to reset timeouts.');
        }

        await prisma.user.updateMany({
          where: {
            isAdmin: true,
          },
          data: {
            canSendMessageTimestamp: new Date(),
            canViewMessageTimestamp: new Date(),
          },
        });
      }
    },
  });
