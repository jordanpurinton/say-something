import * as trpc from '@trpc/server';
import { prisma } from '../utils/prisma';
import { z } from 'zod';

export const appRouter = trpc
  .router()
  .mutation('create-message', {
    input: z.object({
      content: z.string(),
      views: z.number(),
      sentBy: z.string(),
    }),
    async resolve({ input }) {
      const message = await prisma.message.create({
        data: {
          content: input.content,
          views: input.views,
          sentBy: input.sentBy,
        },
      });
      return { success: true, message };
    },
  })
  .query('get-random-message', {
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
  });

// export type definition of API
export type AppRouter = typeof appRouter;
