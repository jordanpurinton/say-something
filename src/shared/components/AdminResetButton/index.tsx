import { Button, Space } from '@mantine/core';
import React, { FC, useCallback, useMemo } from 'react';
import { RefreshDot } from 'tabler-icons-react';
import { useUser } from '../../context/UserContext';
import { trpc } from '../../utils/trpc';

export const AdminResetButton: FC = () => {
  const { user, setUser } = useUser();

  const resetTimeoutsMutation = trpc.useMutation('user.admin-reset-timeouts');

  const findUserQuery = trpc.useQuery(
    [
      'user.find',
      {
        id: user?.id as string,
      },
    ],
    {
      enabled: false,
    }
  );

  const shouldDisable = useMemo(
    () => resetTimeoutsMutation.isLoading || findUserQuery.isLoading,
    [resetTimeoutsMutation.isLoading, findUserQuery.isLoading]
  );

  const handleClick = useCallback(async () => {
    await resetTimeoutsMutation.mutate();
    const fetchUserRes = await findUserQuery.refetch();
    const newUserData = fetchUserRes.data?.user;
    if (newUserData) {
      setUser(newUserData);
    }
  }, [findUserQuery, resetTimeoutsMutation, setUser]);

  if (!user?.isAdmin ?? false) {
    return null;
  }

  return (
    <>
      <Space h="xl" />
      <Space h="xl" />
      <Button
        onClick={handleClick}
        rightIcon={<RefreshDot />}
        loading={shouldDisable}
        disabled={shouldDisable}
        loaderPosition="right"
        size="md"
        color="red"
      >
        Reset Timeouts
      </Button>
    </>
  );
};

export default AdminResetButton;
