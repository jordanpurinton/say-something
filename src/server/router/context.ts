import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { checkTokenExp, getVerifiedToken } from '../utils';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const verified = getVerifiedToken(req);
  checkTokenExp(verified as JwtPayload);

  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
