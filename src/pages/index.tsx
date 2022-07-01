import type { NextPage } from 'next';
import Head from 'next/head';
import { Center, Container, Space } from '@mantine/core';
import MessageInput from '../components/MessageInput';
import SubmitMessageButton from '../components/SubmitMessageButton';
import HomeContainer from '../containers/HomeContainer';
import Greeting from '../components/Greeting';
import Nickname from '../components/Nickname';
import { useSession } from 'next-auth/react';
import RandomMessageButton from '../components/RandomMessageButton';
import styles from '../styles/Index.module.scss';

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
        </HomeContainer>
      </main>
    </Container>
  );
};

export default Index;
