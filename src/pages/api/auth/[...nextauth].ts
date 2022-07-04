import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { prisma } from '../../../server/db/prisma';
import jwtEncode from 'jwt-encode';

export default NextAuth({
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
      return {
        ...session,
        accessToken: jwtEncode(token, process.env.NEXTAUTH_SECRET as string),
        userId: token.sub,
      };
    },
    async jwt({ token }) {
      return token;
    },
  },
  theme: {
    colorScheme: 'light',
  },
});
