import * as trpc from '@trpc/server';
import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: NextApiRequest) => {
  const validated = jwt.verify(
    req.cookies.access_token as string,
    process.env.NEXTAUTH_SECRET as string,
  );

  if (!validated) {
    throw new trpc.TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }
};
