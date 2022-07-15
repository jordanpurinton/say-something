import { Center, Container, Space, Text } from '@mantine/core';
import { FC, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useCountdown } from '../../hooks/useCountdown';
import { usePrevious } from '../../hooks/usePrevious';
import styles from '../../styles/Timer.module.scss';
import { trpc } from '../../utils/trpc';
import { useRefreshUserTimeout } from '../../hooks/useRefreshUserTimeout';

export const SendTimer: FC = () => {
  const { user, setUser } = useUser();
  const { hours, minutes, seconds } = useCountdown(
    new Date(user?.canViewMessageTimestamp?.toString() as string)
  );

  const findUserQuery = trpc.useQuery(['user.find'], {
    enabled: false,
  });

  const isDisabled = useMemo(
    () => Number(hours) > 0 || Number(minutes) > 0 || Number(seconds) > 0,
    [hours, minutes, seconds]
  );

  const prevIsDisabled = usePrevious(isDisabled);

  useRefreshUserTimeout(prevIsDisabled, isDisabled, setUser, findUserQuery);

  return (
    <Container>
      <Space h="md" />
      You can view a message {isDisabled ? 'in' : ''}
      <Space h="xs" />
      <Center className={styles.timer}>
        <Text>
          {isDisabled ? `${hours}:${minutes}:${seconds}` : <b>NOW</b>}
        </Text>
      </Center>
    </Container>
  );
};

export default SendTimer;
