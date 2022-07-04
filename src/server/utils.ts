import * as trpc from '@trpc/server';
import { NextApiRequest } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

const throwUnauthorized = () => {
  throw new trpc.TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Unauthorized',
  });
};

export const getVerifiedToken = (req: NextApiRequest) => {
  try {
    const verified = jwt.verify(
      req.cookies.access_token as string,
      process.env.NEXTAUTH_SECRET as string
    );

    if (!verified) throwUnauthorized();

    return verified;
  } catch (err) {
    console.error(err);
    throwUnauthorized();
  }
};

export const checkTokenExp = (token: JwtPayload) => {
  if ((token?.exp as number) < Date.now() / 1000) {
    throwUnauthorized();
  }
};
