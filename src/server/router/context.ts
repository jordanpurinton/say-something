import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db/prisma';
import { checkTokenExp, clearCookies, getVerifiedToken } from '../utils';
import { getUserServerSide } from '../../shared/utils/getUserServerSide';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  try {
    const session = await getUserServerSide({ req, res });
    const verified = getVerifiedToken(session?.token);
    checkTokenExp(verified || undefined);

    return {
      req,
      res,
      prisma,
      session,
    };
  } catch (err) {
    console.error(err);
    clearCookies(res);
  }
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
