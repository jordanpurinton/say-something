import { Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { ArrowRight } from 'tabler-icons-react';

export const Oops: FC = () => {
  const router = useRouter();
  return (
    <div>
      <h1>Oops</h1>
      <p>Sorry, something went wrong.</p>
      <br />
      <Button rightIcon={<ArrowRight />} onClick={() => router.push('/')}>
        Go Back
      </Button>
    </div>
  );
};

export default Oops;
