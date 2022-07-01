import { ChangeEvent, FC } from 'react';
import { Textarea } from '@mantine/core';
import styles from '../../styles/MessageInput.module.scss';
import { MAX_MESSAGE_LENGTH } from '../../constants';
import { useMessageContent } from '../../context/AppContext';

export const MessageInput: FC = () => {
  const { messageContent, setMessageContent } = useMessageContent();

  return (
    <Textarea
      className={styles.messageInput}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        setMessageContent(e.target.value)
      }
      label={`Message: (${messageContent.length} / ${MAX_MESSAGE_LENGTH})`}
      maxLength={MAX_MESSAGE_LENGTH}
      required
    />
  );
};

export default MessageInput;