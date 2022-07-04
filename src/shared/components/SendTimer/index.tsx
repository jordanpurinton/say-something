import { Container, Space, Text } from '@mantine/core';
import { FC, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useCountdown } from '../../hooks/useCountdown';

export const SendTimer: FC = () => {
  const { user } = useUser();
  const { hours, minutes, seconds } = useCountdown(
    new Date(user?.canSendMessageTimestamp?.toString() as string)
  );

  const ENABLED_TEXT = 'You have a pending message available to send.';

  const DISABLED_TEXT = `You can send a message in ${hours}:${minutes}:${seconds}`;

  const isDisabled = useMemo(
    () => Number(hours) > 0 || Number(minutes) > 0 || Number(seconds) > 0,
    [hours, minutes, seconds]
  );

  return (
    <Container>
      <Space h="md" />
      <Text>{isDisabled ? DISABLED_TEXT : ENABLED_TEXT}</Text>
    </Container>
  );
};

export default SendTimer;
