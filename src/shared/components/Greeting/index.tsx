import { Text, Title } from '@mantine/core';
import { FC } from 'react';

export const Greeting: FC = () => {
  return (
    <>
      <Title order={1}>Hey there,</Title>
      <Text>say something...</Text>
    </>
  );
};

export default Greeting;
