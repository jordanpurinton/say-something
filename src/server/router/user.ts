import { createRouter } from './context';
import { prisma } from '../db/prisma';
import { z } from 'zod';

export const user = createRouter()
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

      const user = await prisma.user.create({
        data: {
          ...input,
          ...derived,
        },
      });

      return { success: true, user };
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
  });
