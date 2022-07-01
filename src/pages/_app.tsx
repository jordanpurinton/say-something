import Head from 'next/head';
import { AppShell, MantineProvider } from '@mantine/core';
import Header from '../components/Header';
import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import { AppRouter } from '../server/router';
import '../styles/globals.css';
import { AppProvider } from '../context/AppContext';
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';
import superjson from 'superjson';

const App: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
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
          <AppProvider>
            <NotificationsProvider>
              <AppShell padding="md" header={<Header />}>
                <Component {...pageProps} />
              </AppShell>
            </NotificationsProvider>
          </AppProvider>
        </SessionProvider>
      </MantineProvider>
    </>
  );
};

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
  ssr: false,
})(App);
