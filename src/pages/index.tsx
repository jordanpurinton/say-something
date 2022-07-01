import type { NextPage } from 'next';
import Head from 'next/head';
import { Center, Container, Space } from '@mantine/core';
import MessageInput from '../shared/components/MessageInput';
import SubmitMessageButton from '../shared/components/SubmitMessageButton';
import HomeContainer from '../shared/containers/HomeContainer';
import Greeting from '../shared/components/Greeting';
import Nickname from '../shared/components/Nickname';
import { useSession } from 'next-auth/react';
import RandomMessageButton from '../shared/components/RandomMessageButton';
import ViewMessageTimer from '../shared/components/ViewMessageTimer';
import styles from '../shared/styles/Index.module.scss';
import SendMessageTimer from '../shared/components/SendMessageTimer';

const Index: NextPage = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return <Center>Loading...</Center>;
  }

  return (
    <Container>
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
            <SubmitMessageButton />
            <RandomMessageButton />
          </span>
          <SendMessageTimer />
          <ViewMessageTimer />
        </HomeContainer>
      </main>
    </Container>
  );
};

export default Index;
