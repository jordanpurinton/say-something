import { Message } from '@prisma/client';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

interface AppState {
  messageContent: string;
  setMessageContent: Dispatch<SetStateAction<string>>;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  viewMessageModalIsOpen: boolean;
  setViewMessageModalIsOpen: Dispatch<SetStateAction<boolean>>;
  sentMessages: Message[];
  setSentMessages: Dispatch<SetStateAction<Message[]>>;
  viewedMessages: Message[];
  setViewedMessages: Dispatch<SetStateAction<Message[]>>;
}

const AppContext = createContext<AppState>({
  messageContent: '',
  setMessageContent: () => {},
  nickname: '',
  setNickname: () => {},
  viewMessageModalIsOpen: false,
  setViewMessageModalIsOpen: () => {},
  sentMessages: [],
  setSentMessages: () => {},
  viewedMessages: [],
  setViewedMessages: () => {},
});

export const AppProvider = (props: any) => {
  const { children } = props;
  const [messageContent, setMessageContent] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [viewMessageModalIsOpen, setViewMessageModalIsOpen] =
    useState<boolean>(false);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [viewedMessages, setViewedMessages] = useState<Message[]>([]);

  const memoizedProviderValues = useMemo(
    () => ({
      messageContent,
      setMessageContent,
      nickname,
      setNickname,
      viewMessageModalIsOpen,
      setViewMessageModalIsOpen,
      sentMessages,
      setSentMessages,
      viewedMessages,
      setViewedMessages,
    }),
    [
      messageContent,
      setMessageContent,
      nickname,
      setNickname,
      viewMessageModalIsOpen,
      setViewMessageModalIsOpen,
      sentMessages,
      setSentMessages,
      viewedMessages,
      setViewedMessages,
    ]
  );

  return (
    <AppContext.Provider value={memoizedProviderValues}>
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

export const useSentMessages = () => {
  const { sentMessages, setSentMessages } = useContext(AppContext);
  return { sentMessages, setSentMessages };
};

export const useViewedMessages = () => {
  const { viewedMessages, setViewedMessages } = useContext(AppContext);
  return { viewedMessages, setViewedMessages };
};
