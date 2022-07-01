import { FC } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Space, Text } from '@mantine/core';
import { useCountdown } from '../../hooks/useCountdown';

export const ViewMessageTimer: FC = () => {
  const { data } = useSession();
  const { hours, minutes, seconds } = useCountdown(
    new Date(data?.userWithProfile.canViewMessageTimestamp as string)
  );

  console.log(hours, minutes, seconds);

  return (
    <Container>
      <Space h="md" />
      {/* {secondsRemaining > 0 ? ( */}
      <Text>
        You can view a message in {hours}:{minutes}:{seconds}
      </Text>
      {/* ) : ( */}
      {/* <Text>You have a pending message available to view</Text> */}
      {/* )} */}
    </Container>
  );
};

export default ViewMessageTimer;
