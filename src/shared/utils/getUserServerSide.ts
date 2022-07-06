import { NextApiRequest, NextApiResponse } from 'next';
import { ServerResponse } from 'http';
import { unstable_getServerSession } from 'next-auth';
import { SerializedUser } from '../types';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import superjson from 'superjson';

type ServerSideContext = {
  req: NextApiRequest;
  res: ServerResponse | NextApiResponse<any>;
};

type UseGetUserServerSideReturn = SerializedUser | undefined;

export const getUserServerSide = async (
  context: ServerSideContext
): Promise<UseGetUserServerSideReturn> => {
  const data = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!data?.token) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
  }

  context.res.setHeader('Set-Cookie', [`access_token=${data?.token}`]);

  return (
    (superjson.serialize(data?.userProfile).json as SerializedUser) || undefined
  );
};
