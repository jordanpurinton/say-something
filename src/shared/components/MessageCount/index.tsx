import { Container, Text } from '@mantine/core';
import { FC } from 'react';

interface MessageCountProps {
  count: number;
}

export const MessageCount: FC<MessageCountProps> = ({ count }) => {
  return (
    <Container>
      <Text>
        Showing {count} message{count !== 1 ? 's' : ''}
      </Text>
    </Container>
  );
};

export default MessageCount;
