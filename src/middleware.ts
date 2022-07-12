export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/', '/profile', '/send-history', '/view-history'],
};
