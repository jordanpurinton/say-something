import { FC, useCallback } from 'react';
import { Button } from '@mantine/core';
import { ArrowsShuffle } from 'tabler-icons-react';
import { trpc } from '../../utils/trpc';
import { useRandomMessageModalIsOpen } from '../../context/AppContext';
import { RandomMessageModal } from '../RandomMessageModal';

export const RandomMessageButton: FC = () => {
  const { randomMessageModalIsOpen, setRandomMessageModalIsOpen } =
    useRandomMessageModalIsOpen();

  const { data, refetch, isFetching } = trpc.useQuery(['message.get-random'], {
    enabled: false,
  });

  const handleClick = useCallback(async () => {
    await refetch();
    setRandomMessageModalIsOpen((prev) => !prev);
  }, [refetch, setRandomMessageModalIsOpen]);

  return (
    <>
      <Button
        onClick={handleClick}
        rightIcon={<ArrowsShuffle />}
        loading={isFetching}
        loaderPosition="right"
        size="md"
        variant="light"
      >
        View Message
      </Button>
      {randomMessageModalIsOpen && (
        <RandomMessageModal randomMessage={data?.message} />
      )}
    </>
  );
};

export default RandomMessageButton;
