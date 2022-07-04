import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../server/db/prisma';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: {
          id: token?.sub,
        },
      });
      return {
        ...session,
        userProfile: user,
        token: jwt.sign(token, process.env.NEXTAUTH_SECRET as string),
      };
    },
  },
  theme: {
    colorScheme: 'light',
  },
};

export { authOptions };

export default NextAuth(authOptions);
