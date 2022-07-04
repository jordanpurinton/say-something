import { Textarea } from '@mantine/core';
import React, { ChangeEvent, FC } from 'react';
import { MAX_MESSAGE_LENGTH } from '../../constants';
import { useMessageContent } from '../../context/AppContext';
import styles from '../../styles/MessageInput.module.scss';

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
