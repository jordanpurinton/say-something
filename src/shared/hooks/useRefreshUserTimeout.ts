import { User } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

export const useRefreshUserTimeout = (
  prevIsDisabled: boolean,
  isDisabled: boolean,
  setUser: Dispatch<SetStateAction<User | undefined>>,
  findUserQuery: UseQueryResult<{
    success: boolean;
    user: User | null;
  }>
): void => {
  useEffect(() => {
    const fetchUser = async () => {
      if (prevIsDisabled !== undefined && prevIsDisabled !== isDisabled) {
        // wait for query to ensure UI is updated
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const newUserData = await findUserQuery.refetch();
        setUser(newUserData.data?.user as User);
      }
    };
    fetchUser();
  }, [prevIsDisabled, isDisabled, setUser, findUserQuery]);
};
