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
}

const AppContext = createContext<AppState>({
  messageContent: '',
  setMessageContent: () => {},
  nickname: '',
  setNickname: () => {},
});

export const AppProvider = (props: any) => {
  const { children } = props;
  const [messageContent, setMessageContent] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  return (
    <AppContext.Provider
      value={{
        messageContent,
        setMessageContent,
        nickname,
        setNickname,
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
