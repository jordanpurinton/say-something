import type { NextPage } from "next";
import Head from "next/head";
import { Center, Space } from "@mantine/core";
import MessageInput from "../components/MessageInput";
import SubmitMessageButton from "../components/SubmitMessageButton";
import HomeContainer from "../containers/HomeContainer";
import Greeting from "../components/Greeting";
import { useUser } from "@auth0/nextjs-auth0";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";

const Index: NextPage = () => {
  const { isLoading } = useUser();
  // const hello = trpc.useQuery(["hello", { text: "client" }]);

  if (isLoading) {
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
          <Center>
            <SubmitMessageButton />
          </Center>
        </HomeContainer>
      </main>
    </div>
  );
};

export default Index;
