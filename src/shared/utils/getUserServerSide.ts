import { NextApiRequest, NextApiResponse } from 'next';
import { ServerResponse } from 'http';
import { unstable_getServerSession } from 'next-auth';
import { SerializedUser } from '../types';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import superjson from 'superjson';
import { clearCookies } from '../../server/utils';

type ServerSideContext = {
  req: NextApiRequest;
  res: ServerResponse | NextApiResponse<any>;
};

type UseGetUserServerSideReturn = SerializedUser | null;

export const getUserServerSide = async (
  context: ServerSideContext
): Promise<UseGetUserServerSideReturn> => {
  const { req, res } = context;
  try {
    const data = await unstable_getServerSession(req, res, authOptions);

    if (!data?.token) {
      clearCookies(context.res);
      res.writeHead(302, { Location: '/api/auth/signin' });
    }

    res.setHeader('Set-Cookie', [`access_token=${data?.token}; path=/`]);

    return superjson.serialize(data?.userProfile).json as SerializedUser;
  } catch (err) {
    console.error(err);
    clearCookies(context.res);
    return null;
  }
};
