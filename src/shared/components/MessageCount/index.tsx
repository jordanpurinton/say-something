import { Container, Title } from '@mantine/core';
import { FC } from 'react';

interface MessageCountProps {
  count: number;
  type: string;
}

export const MessageCount: FC<MessageCountProps> = ({ count, type }) => {
  return (
    <Container>
      <Title order={3}>
        Showing {count} {type} message{count !== 1 ? 's' : ''}
      </Title>
    </Container>
  );
};

export default MessageCount;
