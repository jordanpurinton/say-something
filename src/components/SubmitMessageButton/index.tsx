import { FC, useCallback, useMemo } from 'react';
import { Button } from '@mantine/core';
import { Message } from 'tabler-icons-react';
import { trpc } from '../../utils/trpc';
import { useMessageContent } from '../../context/AppContext';
import { showNotification } from '@mantine/notifications';
import { useSession } from 'next-auth/react';

export const SubmitMessageButton: FC = () => {
  const createMessageMutation = trpc.useMutation('message.create');
  const { data: session } = useSession();
  const { messageContent } = useMessageContent();

  const shouldDisable = useMemo(() => {
    return messageContent.trim().length === 0;
  }, [messageContent]);

  const handleClick = useCallback(async () => {
    await createMessageMutation.mutateAsync({
      content: messageContent,
      author: {
        id: '1234',
        // todo: fix this
        name: session?.user?.name ?? 'Anonymous',
        email: session?.user?.email ?? 'None',
      },
    });
    showNotification({
      title: 'Sweet!',
      message: 'Message successfully sent',
    });
  }, [createMessageMutation, messageContent, session?.user]);

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
