import { Group, Space } from '@mantine/core';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { ServerResponse } from 'http';
import { useSession } from 'next-auth/react';
import Greeting from '../shared/components/Greeting';
import MessageInput from '../shared/components/MessageInput';
import Nickname from '../shared/components/Nickname';
import SendMessageButton from '../shared/components/SendMessageButton';
import SendTimer from '../shared/components/SendTimer';
import ViewMessageButton from '../shared/components/ViewMessageButton';
import { SerializedUser } from '../shared/types';
import { useSetInitUser } from '../shared/hooks/useSetInitUser';
import ViewTimer from '../shared/components/ViewTimer';
import { useUser } from '../shared/context/UserContext';
import PageContainer from '../shared/containers/PageContainer';
import { getUserServerSide } from '../shared/utils/getUserServerSide';
import Loading from '../shared/components/Loading';
import styles from '../shared/styles/Index.module.scss';
import AdminResetButton from '../shared/components/AdminResetButton';

const Index: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const setInitUser = useSetInitUser();

  useEffect(() => {
    setInitUser(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user) {
    return <Loading text="Fetching data..." />;
  }

  return (
    <>
      <Head>
        <title>Say Something - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PageContainer>
          <Greeting />
          <Space h="md" />
          <Nickname />
          <Space h="md" />
          <MessageInput />
          <Space h="md" />
          <Group className={styles.buttonControls}>
            <SendMessageButton />
            <ViewMessageButton />
          </Group>
          <Group>
            <SendTimer />
            <ViewTimer />
          </Group>
          <AdminResetButton />
        </PageContainer>
      </main>
    </>
  );
};

export async function getServerSideProps(context: {
  req: NextApiRequest;
  res: ServerResponse | NextApiResponse<any>;
}) {
  const userData = await getUserServerSide(context);
  return {
    props: { userData },
  };
}

export default Index;
