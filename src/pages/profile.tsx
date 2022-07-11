import {
  Avatar,
  Button,
  Center,
  Code,
  Group,
  Input,
  List,
  Modal,
  Space,
  Text,
} from '@mantine/core';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import React, { useCallback, useEffect, useState } from 'react';
import { ServerResponse } from 'http';
import { useSession } from 'next-auth/react';
import { SerializedUser } from '../shared/types';
import { useUser } from '../shared/context/UserContext';
import { useSetInitUser } from '../shared/hooks/useSetInitUser';
import { getUserServerSide } from '../shared/utils/getUserServerSide';
import PageContainer from '../shared/containers/PageContainer';
import {
  DELETE_CONFIRMATION_TEXT,
  profileTableData,
} from '../shared/constants';
import { trpc } from '../shared/utils/trpc';
import { useRouter } from 'next/router';
import Loading from '../shared/components/Loading';
import Head from 'next/head';
import { Logout } from 'tabler-icons-react';
import { appRouter } from '../server/router';
import { createSSGHelpers } from '@trpc/react/ssg';
import superjson from 'superjson';
import { ChangeEvent } from 'react';
import { signOut } from 'next-auth/react';

const Profile: NextPage<{
  messagesSent: number;
  messagesViewed: number;
  userData: SerializedUser;
}> = ({ messagesSent, messagesViewed, userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const setInitUser = useSetInitUser();

  const logoutUserMutation = trpc.useMutation(['user.log-out']);
  const deleteUserMutation = trpc.useMutation(['user.delete']);

  const handleUserSignOut = useCallback(async () => {
    setIsLoggingOut(true);
    await logoutUserMutation.mutateAsync();
    await signOut({ redirect: false, callbackUrl: '/' });
    router.replace('/api/auth/signin');
  }, [logoutUserMutation, router]);

  const handleDeleteUser = useCallback(async () => {
    await deleteUserMutation.mutateAsync();
    router.reload();
  }, [deleteUserMutation, router]);

  useEffect(() => {
    setInitUser(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if ((!data || !user) && !isLoggingOut) {
    return <Loading text="Fetching profile..." />;
  }

  return (
    <>
      <Head>
        <title>Say Something - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PageContainer>
          <List spacing="sm" size="sm">
            <Center>
              <Avatar
                src={user?.image}
                alt={data?.user?.name || ''}
                size="lg"
                radius="xl"
              />
            </Center>
            <Space h="md" />
            {profileTableData.map((obj) => (
              <List.Item key={obj.key}>
                {obj.label}: {(user as any)[obj.key].toString()}
              </List.Item>
            ))}
            <List.Item key="sent">
              Messages Sent by You: {messagesSent}
            </List.Item>
            <List.Item key="viewed">
              Messages Viewed by You: {messagesViewed}
            </List.Item>
          </List>
          <Space h="md" />
          <Space h="md" />
          <Group>
            <Button
              onClick={handleUserSignOut}
              rightIcon={<Logout />}
              loaderPosition="right"
              size="lg"
              variant="light"
            >
              Sign Out
            </Button>
            <Button
              onClick={() => setOpened((prev) => !prev)}
              loading={deleteUserMutation.isLoading}
              loaderPosition="right"
              size="lg"
              color="red"
              variant="light"
            >
              Delete
            </Button>
          </Group>
          <Modal opened={opened} onClose={() => setOpened(false)} centered>
            <Text>
              Are you <b>sure</b> you want to delete your profile?
              <Space h="md" />
              All data associated with your account will be deleted.
              <Space h="md" />
              <Code color="red">
                Enter &quot;<b>{DELETE_CONFIRMATION_TEXT}</b>&quot;
              </Code>
              <Space h="md" />
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDeleteConfirmationText(e.target.value)
                }
              />
              <Space h="md" />
              <Button
                onClick={handleDeleteUser}
                disabled={deleteConfirmationText !== DELETE_CONFIRMATION_TEXT}
                loading={deleteUserMutation.isLoading}
                loaderPosition="right"
                color="red"
              >
                {DELETE_CONFIRMATION_TEXT}
              </Button>
            </Text>
          </Modal>
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

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: { ...context, prisma } as any,
    transformer: superjson,
  });

  const findByUserRes = await ssg.fetchQuery('message.find-by-user');
  const findViewedRes = await ssg.fetchQuery('message.find-viewed-messages');

  const messagesSent = findByUserRes.messages.length;
  const messagesViewed = findViewedRes?.messages.length || 0;

  return {
    props: {
      trpcState: ssg.dehydrate(),
      messagesSent,
      messagesViewed,
      userData,
    },
  };
}

export default Profile;
