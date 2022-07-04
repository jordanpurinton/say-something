// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import messageRouter from './message';
import userRouter from './user';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('message.', messageRouter);

export type AppRouter = typeof appRouter;
