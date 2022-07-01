import { FC, useCallback, useMemo } from 'react';
import { Button } from '@mantine/core';
import { Message } from 'tabler-icons-react';
import { trpc } from '../../utils/trpc';
import { useMessageContent, useNickname } from '../../context/AppContext';
import { showNotification } from '@mantine/notifications';
import { useSession } from 'next-auth/react';
import { DEFAULT_NICKNAME } from '../../constants';

export const SubmitMessageButton: FC = () => {
  const { data } = useSession();

  const createMessageMutation = trpc.useMutation('message.create');

  const { messageContent } = useMessageContent();
  const { nickname } = useNickname();

  const shouldDisable = useMemo(() => {
    return messageContent.trim().length === 0;
  }, [messageContent]);

  const handleClick = useCallback(async () => {
    await createMessageMutation.mutateAsync({
      content: messageContent,
      userId: data?.userId as string,
      nickname: nickname || DEFAULT_NICKNAME,
    });
    showNotification({
      title: 'Nice',
      message: 'Message was sent',
    });
  }, [createMessageMutation, messageContent, nickname, data?.userId]);

  return (
    <Button
      disabled={shouldDisable}
      onClick={handleClick}
      loading={createMessageMutation.isLoading}
      rightIcon={<Message />}
      variant="gradient"
      gradient={{ from: 'indigo', to: 'cyan' }}
      loaderPosition="right"
      size="md"
    >
      Send Message
    </Button>
  );
};

export default SubmitMessageButton;
