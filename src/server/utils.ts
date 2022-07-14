import * as trpc from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { Session, unstable_getServerSession } from 'next-auth';
import { cookies } from '../shared/constants';
import { ServerResponse } from 'http';

type Context = {
  req: NextApiRequest;
  res: NextApiResponse<any>;
  prisma: PrismaClient;
};

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

export const throwUnauthorized = (msg?: string) => {
  throw new trpc.TRPCError({
    code: 'UNAUTHORIZED',
    message: msg || 'Unauthorized',
  });
};

export const throwForbidden = () => {
  throw new trpc.TRPCError({
    code: 'FORBIDDEN',
    message: 'Forbidden',
  });
};

export const getVerifiedToken = (
  token: string | undefined
): JwtPayload | undefined => {
  if (!token) {
    return throwUnauthorized();
  }

  const verified = jwt.verify(token || '', process.env.NEXTAUTH_SECRET || '');

  if (!verified) throwUnauthorized();

  return verified as JwtPayload;
};

export const checkTokenExp = (token: JwtPayload | undefined) => {
  if ((token?.exp || -1) < Date.now() / 1000) {
    throwUnauthorized();
  }
};

export const getServerSession = async (
  ctx: Context | undefined
): Promise<Session | null> => {
  if (!ctx) return null;

  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  return session;
};

export const clearCookies = (
  res: ServerResponse | NextApiResponse<any> | undefined
) => {
  res?.setHeader('Set-Cookie', [
    `${cookies[0]}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`,
    `${cookies[1]}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`,
    `${cookies[2]}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`,
  ]);
};
