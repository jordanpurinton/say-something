import { Button, Container, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { ArrowRight } from 'tabler-icons-react';

export const Oops: FC = () => {
  const router = useRouter();
  return (
    <Container>
      <Title>Oops</Title>
      <Text>Sorry, something went wrong.</Text>
      <br />
      <Button rightIcon={<ArrowRight />} onClick={() => router.push('/')}>
        Go Back
      </Button>
    </Container>
  );
};

export default Oops;
