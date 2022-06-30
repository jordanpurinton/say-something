import type { NextPage } from 'next';
import Head from 'next/head';
import { Center, Space } from '@mantine/core';
import MessageInput from '../components/MessageInput';
import SubmitMessageButton from '../components/SubmitMessageButton';
import HomeContainer from '../containers/HomeContainer';
import Greeting from '../components/Greeting';
import Nickname from '../components/Nickname';
import { useSession } from 'next-auth/react';
import RandomMessageButton from '../components/RandomMessageButton';

const Index: NextPage = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return <Center>Loading...</Center>;
  }

  return (
    <div>
      <Head>
        <title>Say Something</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HomeContainer>
          <Greeting />
          <Space h="md" />
          <MessageInput />
          <Space h="md" />
          <Nickname />
          <Space h="md" />
          <SubmitMessageButton />
          <Space h="md" />
          <RandomMessageButton />
        </HomeContainer>
      </main>
    </div>
  );
};

export default Index;
