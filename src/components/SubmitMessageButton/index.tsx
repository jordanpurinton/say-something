import { FC, useCallback, useMemo } from 'react';
import { Button } from '@mantine/core';
import { Message } from 'tabler-icons-react';
import { trpc } from '../../utils/trpc';
import { useMessageContent, useNickname } from '../../context/AppContext';
import { showNotification } from '@mantine/notifications';

const SubmitMessageButton: FC = () => {
  const createMessageMutation = trpc.useMutation('create-message');
  const { messageContent } = useMessageContent();
  const { nickname } = useNickname();

  const shouldDisable = useMemo(() => {
    return messageContent.trim().length === 0;
  }, [messageContent, nickname]);

  const handleClick = useCallback(async () => {
    await createMessageMutation.mutateAsync({
      content: messageContent,
      views: 0,
      sentBy: nickname || 'Anonymous',
    });
    showNotification({
      title: 'Sweet!',
      message: 'Message successfully sent',
    });
  }, [createMessageMutation]);

  return (
    <Button
      disabled={shouldDisable}
      onClick={handleClick}
      loading={createMessageMutation.isLoading}
      loaderPosition="right"
      rightIcon={<Message />}
      size="md"
    >
      Submit
    </Button>
  );
};

export default SubmitMessageButton;
