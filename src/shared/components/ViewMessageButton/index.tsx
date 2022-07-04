import { Button } from '@mantine/core';
import { Message } from '@prisma/client';
import { isAfter } from 'date-fns';
import React, { FC, useCallback, useMemo } from 'react';
import { ArrowsShuffle } from 'tabler-icons-react';
import { useViewMessageModalIsOpen } from '../../context/AppContext';
import { useUser } from '../../context/UserContext';
import { trpc } from '../../utils/trpc';
import { ViewMessageModal } from '../ViewMessageModal';

export const ViewMessageButton: FC = () => {
  const { user } = useUser();
  const { viewMessageModalIsOpen, setViewMessageModalIsOpen } =
    useViewMessageModalIsOpen();

  const { data, refetch, isFetching } = trpc.useQuery(
    [
      'message.get-random',
      {
        canViewMessageTimestamp:
          user?.canViewMessageTimestamp.toISOString() as string,
      },
    ],
    {
      enabled: false,
    }
  );

  const shouldDisable = useMemo(
    () => isAfter(user?.canViewMessageTimestamp as Date, new Date()),
    [user]
  );

  const handleClick = useCallback(async () => {
    await refetch();
    setViewMessageModalIsOpen((prev) => !prev);
  }, [refetch, setViewMessageModalIsOpen]);

  return (
    <>
      <Button
        onClick={handleClick}
        rightIcon={<ArrowsShuffle />}
        loading={isFetching}
        // disabled={shouldDisable}
        loaderPosition="right"
        size="md"
        variant="light"
      >
        View Message
      </Button>
      {viewMessageModalIsOpen && (
        <ViewMessageModal randomMessage={data?.message as Message} />
      )}
    </>
  );
};

export default ViewMessageButton;
