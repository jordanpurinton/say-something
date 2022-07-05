import * as trpc from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';

export const throwNotFound = (msg?: string) => {
  throw new trpc.TRPCError({
    code: 'NOT_FOUND',
    message: msg || 'Not found',
  });
};

export const throwBadRequest = (msg?: string) => {
  throw new trpc.TRPCError({
    code: 'BAD_REQUEST',
    message: msg || 'Bad request',
  });
};

export const throwServerError = (msg?: string) => {
  throw new trpc.TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: msg || 'Internal server error',
  });
};

const throwUnauthorized = () => {
  throw new trpc.TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Unauthorized',
  });
};

export const throwForbidden = () => {
  throw new trpc.TRPCError({
    code: 'FORBIDDEN',
    message: 'Forbidden',
  });
};

export const getVerifiedToken = (req: NextApiRequest): JwtPayload | undefined => {
  try {
    const verified = jwt.verify(
      req.cookies.access_token || '',
      process.env.NEXTAUTH_SECRET || ''
    );

    if (!verified) throwUnauthorized();

    return verified as JwtPayload;
  } catch (err) {
    console.error(err);
    throwUnauthorized();
  }
};

export const checkTokenExp = (token: JwtPayload | undefined) => {
  if ((token?.exp || -1) < Date.now() / 1000) {
    throwUnauthorized();
  }
};

export const getServerSession = async (ctx: {
  req: NextApiRequest;
  res: NextApiResponse<any>;
  prisma: PrismaClient;
}): Promise<Session | null> => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  return session;
};
