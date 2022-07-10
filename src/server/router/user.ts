import { z } from 'zod';
import { prisma } from '../db/prisma';
import { createRouter } from './context';
import {
  clearCookies,
  getServerSession,
  throwForbidden,
  throwServerError,
} from '../utils';
import { cookies } from '../../shared/constants';

export default createRouter()
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
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const session = await getServerSession(ctx);
      const sessionId = session?.userProfile.id;

      if (sessionId !== input.id) {
        return throwForbidden();
      }

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
    async resolve({ ctx, input }) {
      const session = await getServerSession(ctx);
      const sessionId = session?.userProfile.id;

      if (sessionId !== input.id) {
        return throwForbidden();
      }

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
    async resolve({ ctx, input }) {
      const session = await getServerSession(ctx);
      const sessionId = session?.userProfile.id;

      if (sessionId !== input.id) {
        return throwForbidden();
      }

      await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          canViewMessageTimestamp: input.canViewMessageTimestamp,
        },
      });
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
      const session = await getServerSession(ctx);

      await prisma.user.delete({
        where: {
          id: session?.userProfile.id,
        },
      });

      ctx?.res.setHeader('Set-Cookie', [
        `${cookies[0]}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`,
        `${cookies[1]}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`,
        `${cookies[2]}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`,
        `${cookies[3]}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`,
      ]);
    },
  });
