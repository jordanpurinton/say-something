import { Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

export const Greeting: FC = () => {
  const { data: session } = useSession();

  return (
    <>
      <Title order={3}>Hello {session?.user?.name || 'Anonymous'},</Title>
      <p>say something...</p>
    </>
  );
};

export default Greeting;
