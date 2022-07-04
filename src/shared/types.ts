import { User } from '@prisma/client';

export type SerializedUser = User & {
  canViewMessageTimestamp: string;
  canSendMessageTimestamp: string;
};
