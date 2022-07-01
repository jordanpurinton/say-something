import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    userWithProfile: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      viewedMessageIds: string;
      canViewMessageTimestamp: string;
      canSendMessageTimestamp: string;
    };
  }
}
