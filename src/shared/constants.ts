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
    key: 'name',
    label: 'Name',
  },
  {
    key: 'id',
    label: 'User ID',
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

export const cookies = [
  'next-auth.session-token',
  'next-auth.csrf-token',
  'next-auth.callback-url',
];

export const DELETE_CONFIRMATION_TEXT =
  'I understand, please delete my account';
