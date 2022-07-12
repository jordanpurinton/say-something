import { Center, Container, Space, Text } from '@mantine/core';
import React, { FC, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useCountdown } from '../../hooks/useCountdown';
import styles from '../../styles/Timer.module.scss';

export const SendTimer: FC = () => {
  const { user } = useUser();
  const { hours, minutes, seconds } = useCountdown(
    new Date(user?.canSendMessageTimestamp?.toString() as string)
  );

  const isDisabled = useMemo(
    () => Number(hours) > 0 || Number(minutes) > 0 || Number(seconds) > 0,
    [hours, minutes, seconds]
  );

  return (
    <Container>
      <Space h="md" />
      You can send a message {isDisabled ? 'in' : ''}
      <Space h="xs" />
      <Center className={styles.timer}>
        <Text>{isDisabled ? `${hours}:${minutes}:${seconds}` : 'NOW'}</Text>
      </Center>
    </Container>
  );
};

export default SendTimer;
