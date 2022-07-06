import { Avatar, Button, Center, List, Space, Text } from '@mantine/core';
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

const Index: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const router = useRouter();
  const setInitUser = useSetInitUser();
  const deleteUserMutation = trpc.useMutation(['user.delete']);

  const handleDeleteUser = useCallback(async () => {
    await deleteUserMutation.mutateAsync();
    router.push('/api/auth/signin');
  }, [deleteUserMutation, router]);

  useEffect(() => {
    setInitUser(userData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
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

export default Index;
