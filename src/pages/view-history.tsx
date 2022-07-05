import { Center, Space, Text } from '@mantine/core';
import { Message, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect } from 'react';
import superjson from 'superjson';
import { ServerResponse } from 'http';
import { useSession } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
import { SerializedUser } from '../shared/types';
import { useUser } from '../shared/context/UserContext';
import MessageCard from '../shared/components/MessageCard';
import { trpc } from '../shared/utils/trpc';
import { setInitUser } from '../shared/utils/user';
import PageContainer from '../shared/containers/PageContainer';

const ViewHistory: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user, setUser } = useUser();
  const [messagesForUser, setMessagesForUser] = React.useState<Message[]>([]);
  const findMessagesByUserQuery = trpc.useQuery(
    ['message.find-viewed-messages'],
    {
      enabled: false,
    }
  );

  useEffect(() => {
    setUser(setInitUser(userData));
    const fetchMessageData = async () => {
      const messageData = await findMessagesByUserQuery.refetch();
      setMessagesForUser((messageData?.data?.messages as Message[]) || []);
    };
    fetchMessageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user || findMessagesByUserQuery.isLoading) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Say Something - View History</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PageContainer>
          {messagesForUser.map((message) => (
            <>
              <MessageCard key={message.id} message={message} readonly={true} />
              <Space h="md" />
            </>
          ))}
        </PageContainer>
      </main>
    </>
  );
};

export async function getServerSideProps(context: {
  req: NextApiRequest;
  res: ServerResponse | NextApiResponse<any>;
}) {
  const data = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!data?.token) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
  }

  context.res.setHeader('Set-Cookie', [
    `access_token=${data?.token as string}`,
  ]);

  return {
    props: { userData: superjson.serialize(data?.userProfile as User).json },
  };
}

export default ViewHistory;
