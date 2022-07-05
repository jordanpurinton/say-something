import React from 'react';
import { AppShell, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';
import { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import superjson from 'superjson';
import { AppRouter } from '../server/router';
import Header from '../shared/components/Header';
import { UserProvider } from '../shared/context/UserContext';
import '../shared/styles/globals.css';

const App: AppType = ({ Component, pageProps: { session, ...pageProps } }) => (
  <>
    <Head>
      <title>Say Something</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, height=device-height"
      />
    </Head>

    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
        primaryColor: 'indigo',
      }}
    >
      <SessionProvider session={session}>
        <UserProvider>
          <NotificationsProvider>
            <AppShell padding="md" header={<Header />}>
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
        </UserProvider>
      </SessionProvider>
    </MantineProvider>
  </>
);

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.browser) return ''; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
    };
  },
  ssr: true,
})(App);
