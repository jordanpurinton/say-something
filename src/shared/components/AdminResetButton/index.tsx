import { Button, Space } from '@mantine/core';
import React, { FC, useCallback } from 'react';
import { RefreshDot } from 'tabler-icons-react';
import { useUser } from '../../context/UserContext';
import { trpc } from '../../utils/trpc';

export const AdminResetButton: FC = () => {
  const { user, setUser } = useUser();
  const [isResetting, setIsResetting] = React.useState(false);

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

  const handleClick = useCallback(async () => {
    setIsResetting(true);
    await resetTimeoutsMutation.mutateAsync();
    const fetchUserRes = await findUserQuery.refetch();
    const newUserData = fetchUserRes.data?.user;
    if (newUserData) {
      setUser(newUserData);
    }
    setIsResetting(false);
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
        loading={isResetting}
        disabled={isResetting}
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
