import { User } from '@prisma/client';
import { SerializedUser } from '../types';

export const setInitUser = (user: SerializedUser): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    viewedMessageIds: user.viewedMessageIds,
    canViewMessageTimestamp: new Date(user.canViewMessageTimestamp),
    canSendMessageTimestamp: new Date(user.canSendMessageTimestamp),
  };
};
