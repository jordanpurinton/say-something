import { User } from '@prisma/client';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface AppState {
  messageContent: string;
  setMessageContent: Dispatch<SetStateAction<string>>;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  viewMessageModalIsOpen: boolean;
  setViewMessageModalIsOpen: Dispatch<SetStateAction<boolean>>;
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const AppContext = createContext<AppState>({
  messageContent: '',
  setMessageContent: () => {},
  nickname: '',
  setNickname: () => {},
  viewMessageModalIsOpen: false,
  setViewMessageModalIsOpen: () => {},
  user: undefined,
  setUser: () => {},
});

export const AppProvider = (props: any) => {
  const { children } = props;
  const [messageContent, setMessageContent] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [viewMessageModalIsOpen, setViewMessageModalIsOpen] =
    useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <AppContext.Provider
      value={{
        messageContent,
        setMessageContent,
        nickname,
        setNickname,
        viewMessageModalIsOpen,
        setViewMessageModalIsOpen,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useMessageContent = () => {
  const { messageContent, setMessageContent } = useContext(AppContext);
  return { messageContent, setMessageContent };
};

export const useNickname = () => {
  const { nickname, setNickname } = useContext(AppContext);
  return { nickname, setNickname };
};

export const useViewMessageModalIsOpen = () => {
  const { viewMessageModalIsOpen, setViewMessageModalIsOpen } =
    useContext(AppContext);
  return { viewMessageModalIsOpen, setViewMessageModalIsOpen };
};

export const useUser = () => {
  const { user, setUser } = useContext(AppContext);
  return { user, setUser };
};
