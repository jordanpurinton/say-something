import { User } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    userProfile: User;
    token: string;
  }
}
