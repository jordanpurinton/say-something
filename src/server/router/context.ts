import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db/prisma';
import { checkTokenExp, clearCookies, getVerifiedToken } from '../utils';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  try {
    const verified = getVerifiedToken(req);
    checkTokenExp(verified || undefined);

    return {
      req,
      res,
      prisma,
    };
  } catch (err) {
    console.error(err);
    clearCookies(res);
  }
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
