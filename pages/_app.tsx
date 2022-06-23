import { AppProps } from "next/app";
import Head from "next/head";
import { AppShell, MantineProvider } from "@mantine/core";
import { UserProvider } from "@auth0/nextjs-auth0";
import Header from "../components/Header";
import "../styles/globals.css";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

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

export default App;
