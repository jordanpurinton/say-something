import { FC } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Space, Text } from '@mantine/core';
import { useCountdown } from '../../hooks/useCountdown';

export const SendMessageTimer: FC = () => {
  const { data } = useSession();
  const { hours, minutes, seconds } = useCountdown(
    new Date(data?.userWithProfile.canSendMessageTimestamp as string)
  );

  return (
    <Container>
      <Space h="md" />
      {/* {secondsRemaining > 0 ? ( */}
      <Text>
        You can send a message in {hours}:{minutes}:{seconds}
      </Text>
      {/* ) : ( */}
      {/* <Text>You have a pending message available to send</Text> */}
      {/* )} */}
    </Container>
  );
};

export default SendMessageTimer;
