// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { user } from './user';
import { message } from './message';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', user)
  .merge('message.', message);

export type AppRouter = typeof appRouter;
