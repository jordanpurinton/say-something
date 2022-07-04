// src/server/router/context.ts
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { unstable_getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { prisma } from '../db/prisma';
import authOptions from '../../pages/api/auth/[...nextauth]';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  console.log(req.headers);
  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
