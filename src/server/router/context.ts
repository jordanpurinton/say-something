import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db/prisma';
import { verifyToken } from '../utils';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  verifyToken(req);

  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
