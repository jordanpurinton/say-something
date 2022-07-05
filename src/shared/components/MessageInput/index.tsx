import { Textarea } from '@mantine/core';
import { isAfter } from 'date-fns';
import React, { ChangeEvent, FC, useMemo } from 'react';
import { MAX_MESSAGE_LENGTH } from '../../constants';
import { useMessageContent } from '../../context/AppContext';
import { useUser } from '../../context/UserContext';
import styles from '../../styles/MessageInput.module.scss';

export const MessageInput: FC = () => {
  const { user } = useUser();
  const { messageContent, setMessageContent } = useMessageContent();

  const shouldDisable = useMemo(
    () => isAfter(user?.canSendMessageTimestamp as Date, new Date()),
    [user]
  );

  return (
    <Textarea
      className={styles.messageInput}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        setMessageContent(e.target.value)
      }
      label={`Message: (${messageContent.length} / ${MAX_MESSAGE_LENGTH})`}
      maxLength={MAX_MESSAGE_LENGTH}
      disabled={shouldDisable}
      required
    />
  );
};

export default MessageInput;
