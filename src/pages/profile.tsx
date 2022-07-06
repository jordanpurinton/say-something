import { Avatar, Center, List, Space, Text } from '@mantine/core';
import type { NextApiRequest, NextApiResponse, NextPage } from 'next';
import React, { useEffect } from 'react';
import { ServerResponse } from 'http';
import { useSession } from 'next-auth/react';
import { SerializedUser } from '../shared/types';
import { useUser } from '../shared/context/UserContext';
import { useSetInitUser } from '../shared/hooks/useSetInitUser';
import { getUserServerSide } from '../shared/utils/getUserServerSide';
import PageContainer from '../shared/containers/PageContainer';
import { profileTableData } from '../shared/constants';

const Index: NextPage<{ userData: SerializedUser }> = ({ userData }) => {
  const { data } = useSession();
  const { user } = useUser();
  const setInitUser = useSetInitUser();

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
