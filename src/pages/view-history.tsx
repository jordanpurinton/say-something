import { Space } from '@mantine/core';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import Head from 'next/head';
import React, { Fragment, useEffect } from 'react';
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
import { useViewedMessages } from '../shared/context/AppContext';

const ViewHistory: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const setInitUser = useSetInitUser();
  const { viewedMessages, setViewedMessages } = useViewedMessages();

  const findViewedMessagesQuery = trpc.useQuery(
    ['message.find-viewed-messages'],
    {
      enabled: false,
    }
  );

  useEffect(() => {
    setInitUser(userData);
    const fetchMessageData = async () => {
      const messageData = await findViewedMessagesQuery.refetch();
      const newMessages = messageData?.data?.messages || [];
      setViewedMessages(newMessages);
    };
    fetchMessageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user || findViewedMessagesQuery.isLoading) {
    return <Loading text="Fetching messages..." />;
  }

  return (
    <>
      <Head>
        <title>Say Something - View History</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PageContainer>
          <MessageCount count={viewedMessages.length} />
          {viewedMessages.map((message) => (
            <Fragment key={message.id}>
              <MessageCard message={message} readonly={true} />
              <Space h="md" />
            </Fragment>
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

export default ViewHistory;
