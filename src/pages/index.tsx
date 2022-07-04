/* eslint-disable @typescript-eslint/indent */
import { Center, Space, Text } from '@mantine/core';
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect } from 'react';
import superjson from 'superjson';
import { IncomingMessage, ServerResponse } from 'http';
import { useSession } from 'next-auth/react';
import Greeting from '../shared/components/Greeting';
import MessageInput from '../shared/components/MessageInput';
import Nickname from '../shared/components/Nickname';
import SendMessageButton from '../shared/components/SendMessageButton';
import SendTimer from '../shared/components/SendTimer';
import ViewMessageButton from '../shared/components/ViewMessageButton';
import HomeContainer from '../shared/containers/HomeContainer';
import { AppProvider } from '../shared/context/AppContext';
import styles from '../shared/styles/Index.module.scss';
import { authOptions } from './api/auth/[...nextauth]';
import { SerializedUser } from '../shared/types';
import { setInitUser } from '../shared/utils/user';
import ViewTimer from '../shared/components/ViewTimer';
import { useUser } from '../shared/context/UserContext';

const Index: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user, setUser } = useUser();

  useEffect(() => {
    setUser(setInitUser(userData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Say Something</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppProvider>
          <HomeContainer>
            <Greeting />
            <Space h="md" />
            <Nickname />
            <Space h="md" />
            <MessageInput />
            <Space h="md" />
            <span className={styles.buttonControls}>
              <SendMessageButton />
              <ViewMessageButton />
            </span>
            <SendTimer />
            <ViewTimer />
          </HomeContainer>
        </AppProvider>
      </main>
    </>
  );
};

export async function getServerSideProps(context: {
  req:
    | NextApiRequest
    | (IncomingMessage & { cookies: Partial<{ [key: string]: string }> });
  res: ServerResponse | NextApiResponse<any>;
}) {
  const data = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!data?.token) {
    context.res.writeHead(302, { Location: '/oops' });
  }

  context.res.setHeader('Set-Cookie', [
    `access_token=${data?.token as string}`,
  ]);

  return {
    props: { userData: superjson.serialize(data?.userProfile as User).json },
  };
}

export default Index;
