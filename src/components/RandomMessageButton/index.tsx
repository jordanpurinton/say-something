import { FC, useCallback } from 'react';
import { Button } from '@mantine/core';
import { Message } from 'tabler-icons-react';
import { trpc } from '../../utils/trpc';
import { useRandomMessageModalIsOpen } from '../../context/AppContext';
// fix
import { RandomMessageModal } from '../RandomMessageModal';

export const RandomMessageButton: FC = () => {
  const { randomMessageModalIsOpen, setRandomMessageModalIsOpen } =
    useRandomMessageModalIsOpen();

  const { data, refetch } = trpc.useQuery(['message.get-random'], {
    enabled: false,
  });

  const handleClick = useCallback(async () => {
    await refetch();
    setRandomMessageModalIsOpen((prev) => !prev);
  }, [refetch, setRandomMessageModalIsOpen]);

  return (
    <>
      <Button onClick={handleClick} size="md" rightIcon={<Message />}>
        View Message
      </Button>
      {randomMessageModalIsOpen && (
        <RandomMessageModal randomMessage={data?.message} />
      )}
    </>
  );
};

export default RandomMessageButton;
