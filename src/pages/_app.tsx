import Head from "next/head";
import { AppShell, MantineProvider } from "@mantine/core";
import { UserProvider } from "@auth0/nextjs-auth0";
import Header from "../components/Header";
import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "../backend/router";
import "../styles/globals.css";

const App: AppType = ({ Component, pageProps }) => {
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
          colorScheme: "light",
          primaryColor: "indigo",
        }}
      >
        <UserProvider>
          <AppShell padding="md" header={<Header />}>
            <Component {...pageProps} />
          </AppShell>
        </UserProvider>
      </MantineProvider>
    </>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
    };
  },
  ssr: false,
})(App);
