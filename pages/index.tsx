import type { NextPage } from "next";
import Head from "next/head";
import { Center, Space } from "@mantine/core";
import MessageInput from "../components/MessageInput";
import SubmitMessageButton from "../components/SubmitMessageButton";
import HomeContainer from "../containers/HomeContainer";
import { useUser } from "@auth0/nextjs-auth0";

const Index: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Say Something</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HomeContainer>
          <Space h="md" />
          <MessageInput />
          <Space h="md" />
          <Center>
            <SubmitMessageButton />
          </Center>
        </HomeContainer>
      </main>
    </div>
  );
};

export default Index;
