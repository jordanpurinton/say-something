import { Space } from '@mantine/core';
import { Message } from '@prisma/client';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { ServerResponse } from 'http';
import { useSession } from 'next-auth/react';
import { SerializedUser } from '../shared/types';
import { useUser } from '../shared/context/UserContext';
import MessageCard from '../shared/components/MessageCard';
import { trpc } from '../shared/utils/trpc';
import PageContainer from '../shared/containers/PageContainer';
import { useSetInitUser } from '../shared/hooks/useSetInitUser';
import { getUserServerSide } from '../shared/utils/getUserServerSide';
import MessageCount from '../shared/components/MessageCount';
import Loading from '../shared/components/Loading';

const SendHistory: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const setInitUser = useSetInitUser();
  const [sentMessages, setSentMessages] = React.useState<Message[]>([]);
  const findMessagesByUserQuery = trpc.useQuery(['message.find-by-user'], {
    enabled: false,
  });

  useEffect(() => {
    setInitUser(userData);
    const fetchMessageData = async () => {
      const messageData = await findMessagesByUserQuery.refetch();
      setSentMessages(messageData?.data?.messages || []);
    };
    fetchMessageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user || findMessagesByUserQuery.isLoading) {
    return <Loading text="Fetching messages..." />;
  }

  return (
    <>
      <Head>
        <title>Say Something - Send History</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PageContainer>
          <MessageCount count={sentMessages.length} />
          {sentMessages.map((message) => (
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
  const userData = await getUserServerSide(context);
  return {
    props: { userData },
  };
}

export default SendHistory;
