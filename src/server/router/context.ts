import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db/prisma';
import { checkTokenExp, getVerifiedToken } from '../utils';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const verified = getVerifiedToken(req);
  checkTokenExp(verified || undefined);

  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
