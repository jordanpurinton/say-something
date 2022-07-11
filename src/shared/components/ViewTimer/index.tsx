import { Center, Container, Space, Text } from '@mantine/core';
import React, { FC, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useCountdown } from '../../hooks/useCountdown';
import styles from '../../styles/Timer.module.scss';

export const SendTimer: FC = () => {
  const { user } = useUser();
  const { hours, minutes, seconds } = useCountdown(
    new Date(user?.canViewMessageTimestamp?.toString() as string)
  );

  const isDisabled = useMemo(
    () => Number(hours) > 0 || Number(minutes) > 0 || Number(seconds) > 0,
    [hours, minutes, seconds]
  );

  return (
    <Container>
      <Space h="md" />
      <Text>
        {isDisabled ? (
          <>
            You can view a message in <Space h="xs" />
            <Center className={styles.timer}>
              <Text>
                {hours}:{minutes}:{seconds}
              </Text>
            </Center>
          </>
        ) : (
          <>You have a pending message available to view.</>
        )}
      </Text>
    </Container>
  );
};

export default SendTimer;
