import { Container, Space, Text } from '@mantine/core';
import { FC, useMemo } from 'react';
import { useCountdown } from '../../hooks/useCountdown';

interface TimerProps {
  type: 'send' | 'view';
  dateToCompare: Date | undefined;
}

export const ViewMessageTimer: FC<TimerProps> = ({ type, dateToCompare }) => {
  const { hours, minutes, seconds } = useCountdown(
    new Date(dateToCompare?.toString() as string)
  );

  const enabledText =
    type === 'send'
      ? 'You have a pending message available to send.'
      : 'You have a pending message available to view.';

  const disabledText =
    type === 'send'
      ? `You can view a message in ${hours}:${minutes}:${seconds}`
      : `You can send a message in ${hours}:${minutes}:${seconds}`;

  const isDisabled = useMemo(
    () => Number(hours) > 0 || Number(minutes) > 0 || Number(seconds) > 0,
    [hours, minutes, seconds]
  );

  return (
    <Container>
      <Space h="md" />
      <Text>{isDisabled ? disabledText : enabledText}</Text>
    </Container>
  );
};

export default ViewMessageTimer;
