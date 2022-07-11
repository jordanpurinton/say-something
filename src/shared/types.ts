import { User } from '@prisma/client';

export type SerializedUser = User & {
  token: string;
  canViewMessageTimestamp: string;
  canSendMessageTimestamp: string;
};
