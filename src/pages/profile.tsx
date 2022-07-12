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
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { ServerResponse } from 'http';
import { signOut, useSession } from 'next-auth/react';
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

const Profile: NextPage<{
  userData: SerializedUser;
}> = ({ userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const setInitUser = useSetInitUser();

  const findByUserQuery = trpc.useQuery(['message.find-by-user'], {
    enabled: false,
  });
  const findViewedQuery = trpc.useQuery(['message.find-viewed-messages'], {
    enabled: false,
  });
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
    findByUserQuery.refetch();
    findViewedQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    (!data ||
      !user ||
      findByUserQuery.isLoading ||
      findViewedQuery.isLoading) &&
    !isLoggingOut
  ) {
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
                <b>{obj.label}</b>: {(user as any)[obj.key].toString()}
              </List.Item>
            ))}
            <List.Item key="sent">
              <b>Messages Sent by You</b>:{' '}
              {findByUserQuery.data?.messages.length} messages
            </List.Item>
            <List.Item key="viewed">
              <b>Messages Viewed by You</b>:{' '}
              {findViewedQuery.data?.messages.length} messages
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

  return {
    props: {
      userData,
    },
  };
}

export default Profile;
