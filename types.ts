export interface Message {
  id: number;
  createdAt: Date;
  content: string;
  views: number;
  upvotes: number;
  downvotes: number;
  author: any; // todo: fixme
  authorId: string;
  // viewedBy: any[]; // todo: fixme
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
