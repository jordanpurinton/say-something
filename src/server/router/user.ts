import { createRouter } from './context';
import { prisma } from '../db/prisma';
import { z } from 'zod';

export const user = createRouter().mutation('create', {
  input: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.date(),
    image: z.string(),
  }),
  async resolve({ input }) {
    const derived = {
      account: prisma.account.findFirst({
        where: {
          id: input.id,
        },
      }),
      authorId: input.id,
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
});
