import { User } from '@prisma/client';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

interface AppState {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const UserContext = createContext<AppState>({
  user: undefined,
  setUser: () => {},
});

export const UserProvider = (props: any) => {
  const { children } = props;
  const [user, setUser] = useState<User | undefined>(undefined);

  const memoizedProviderValues = useMemo(
    () => ({ user, setUser }),
    [user, setUser]
  );

  return (
    <UserContext.Provider value={memoizedProviderValues}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  return { user, setUser };
};
