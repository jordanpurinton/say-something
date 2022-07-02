import { Center, Space, Text } from '@mantine/core';
import { User } from '@prisma/client';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect } from 'react';
import Greeting from '../shared/components/Greeting';
import MessageInput from '../shared/components/MessageInput';
import Nickname from '../shared/components/Nickname';
import SendMessageButton from '../shared/components/SendMessageButton';
import Timer from '../shared/components/Timer';
import ViewMessageButton from '../shared/components/ViewMessageButton';
import HomeContainer from '../shared/containers/HomeContainer';
import { useUser } from '../shared/context/AppContext';
import styles from '../shared/styles/Index.module.scss';
import { trpc } from '../shared/utils/trpc';

const Index: NextPage = () => {
  const { data } = useSession();
  const { user, setUser } = useUser();

  const findUserQuery = trpc.useQuery(
    [
      'user.find',
      {
        id: data?.userId as string,
      },
    ],
    {
      enabled: !!data,
    }
  );

  useEffect(() => {
    const fetchUserWithData = async () => {
      if (!data) return;
      const userData = await findUserQuery.refetch();
      setUser(userData.data?.user as User);
    };
    fetchUserWithData();
  }, [data]);

  return (
    <>
      {user ? (
        <>
          <Head>
            <title>Say Something</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
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
              <Timer type="send" dateToCompare={user.canSendMessageTimestamp} />
              <Timer type="view" dateToCompare={user.canViewMessageTimestamp} />
            </HomeContainer>
          </main>
        </>
      ) : (
        <Center>
          <Text>Loading...</Text>
        </Center>
      )}
    </>
  );
};

export default Index;
