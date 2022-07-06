export const MAX_MESSAGE_LENGTH = 280;
export const NICKNAME_MAX_LENGTH = 30;
export const DEFAULT_NICKNAME = 'Anonymous';
export const TIMER_FORMAT = 'HH:mm:ss';

export enum Vote {
  up = 'upvotes',
  down = 'downvotes',
}

export type VoteChoice = Vote | undefined;

export const profileTableData = [
  {
    key: 'id',
    label: 'User ID',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'canViewMessageTimestamp',
    label: 'Can View Message At',
  },
  {
    key: 'canSendMessageTimestamp',
    label: 'Can Send Message At',
  },
];
