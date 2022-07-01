export interface Message {
  id: number;
  createdAt: Date;
  content: string;
  views: number;
  upvotes: number;
  downvotes: number;
  nickname?: string;
}

export interface User {
  id: number;
  name: string;
  nickname: string;
  isUserTimedOut: boolean;
  timeoutExpiry: Date;
  sentMessages: Message[];
  viewedMessages: Message[];
}
