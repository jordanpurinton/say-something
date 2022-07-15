// src/server/router/index.ts
import { TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { createRouter } from './context';

import messageRouter from './message';
import userRouter from './user';

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ ctx, next }) => {
    if (!ctx?.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .merge('user.', userRouter)
  .merge('message.', messageRouter);

export type AppRouter = typeof appRouter;
