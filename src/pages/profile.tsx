import { Avatar, Button, Center, List, Space } from '@mantine/core';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import React, { useCallback, useEffect } from 'react';
import { ServerResponse } from 'http';
import { useSession } from 'next-auth/react';
import { SerializedUser } from '../shared/types';
import { useUser } from '../shared/context/UserContext';
import { useSetInitUser } from '../shared/hooks/useSetInitUser';
import { getUserServerSide } from '../shared/utils/getUserServerSide';
import PageContainer from '../shared/containers/PageContainer';
import { profileTableData } from '../shared/constants';
import { trpc } from '../shared/utils/trpc';
import { useRouter } from 'next/router';
import Loading from '../shared/components/Loading';
import Head from 'next/head';
import { Logout } from 'tabler-icons-react';

const Profile: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const router = useRouter();
  const setInitUser = useSetInitUser();
  const logoutUserMutation = trpc.useMutation(['user.log-out']);
  const deleteUserMutation = trpc.useMutation(['user.delete']);

  const handleUserLogOut = useCallback(async () => {
    await logoutUserMutation.mutateAsync();
    router.reload();
  }, [logoutUserMutation, router]);

  const handleDeleteUser = useCallback(async () => {
    await deleteUserMutation.mutateAsync();
    router.reload();
  }, [deleteUserMutation, router]);

  useEffect(() => {
    setInitUser(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user) {
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
                src={user.image}
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
          </List>
          <Space h="md" />
          <Space h="md" />
          <Button
            onClick={handleUserLogOut}
            rightIcon={<Logout />}
            loaderPosition="right"
            size="lg"
            variant="light"
          >
            Log Out
          </Button>
          <Space h="md" />
          <Space h="md" />
          <Button
            onClick={handleDeleteUser}
            loading={deleteUserMutation.isLoading}
            loaderPosition="right"
            size="lg"
            color="red"
            variant="light"
          >
            Delete
          </Button>
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

export default Profile;
