import { useUser } from '@auth0/nextjs-auth0';
import { Title } from '@mantine/core';
import { FC } from 'react';

const Greeting: FC = () => {
  const { user } = useUser();

  return (
    <>
      <Title order={3}>Hello {user?.name},</Title>
      <p>say something...</p>
    </>
  );
};

export default Greeting;
