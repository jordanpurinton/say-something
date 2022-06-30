import { createRouter } from './context';
import { prisma } from '../db/prisma';
import { z } from 'zod';

export const message = createRouter()
  .mutation('create', {
    input: z.object({
      content: z.string(),
      author: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    }),
    async resolve({ input }) {
      const message = await prisma.message.create({ data: { ...input } });
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
  });
