import { Badge, Space, Textarea } from '@mantine/core';
import { isAfter } from 'date-fns';
import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { MAX_MESSAGE_LENGTH } from '../../constants';
import { useIsProfaneInput, useMessageContent } from '../../context/AppContext';
import { useUser } from '../../context/UserContext';
import styles from '../../styles/MessageInput.module.scss';
import Filter from 'bad-words';

export const MessageInput: FC = () => {
  const { user } = useUser();
  const { messageContent, setMessageContent } = useMessageContent();
  const { isProfaneInput, setIsProfaneInput } = useIsProfaneInput();

  const filter = useMemo(() => new Filter(), []);

  const shouldDisable = useMemo(
    () => isAfter(user?.canSendMessageTimestamp as Date, new Date()),
    [user]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      setMessageContent(value);
      setIsProfaneInput(filter.isProfane(value));
    },
    [setMessageContent, setIsProfaneInput, filter]
  );

  return (
    <>
      <Textarea
        className={styles.messageInput}
        onChange={handleChange}
        label={`Message: (${messageContent.length} / ${MAX_MESSAGE_LENGTH})`}
        maxLength={MAX_MESSAGE_LENGTH}
        disabled={shouldDisable}
        required
      />
      {isProfaneInput && (
        <>
          <Space h="md" />
          <Badge color="red">Please be nice...</Badge>
        </>
      )}
    </>
  );
};

export default MessageInput;
