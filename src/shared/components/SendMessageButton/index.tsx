import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import { isAfter } from 'date-fns';
import { FC, useCallback, useMemo } from 'react';
import { Message } from 'tabler-icons-react';
import { DEFAULT_NICKNAME } from '../../constants';
import {
  useMessageContent,
  useNickname,
  useUser,
} from '../../context/AppContext';
import { trpc } from '../../utils/trpc';

export const SendMessageButton: FC = () => {
  const { user, setUser } = useUser();
  const { messageContent } = useMessageContent();
  const { nickname } = useNickname();

  const createMessageMutation = trpc.useMutation('message.create');
  const updateCanSendMessageTimestampMutation = trpc.useMutation(
    'user.update-can-send-message-timestamp'
  );
  const findUserQuery = trpc.useQuery(
    [
      'user.find',
      {
        id: user?.id as string,
      },
    ],
    {
      enabled: false,
    }
  );

  const shouldDisable = useMemo(() => {
    return (
      messageContent.trim().length === 0 ||
      isAfter(user?.canSendMessageTimestamp as Date, new Date())
    );
  }, [messageContent, user?.canSendMessageTimestamp]);

  const handleClick = useCallback(async () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);

    createMessageMutation.mutateAsync({
      content: messageContent,
      userId: user?.id as string,
      nickname: nickname || DEFAULT_NICKNAME,
    });

    await updateCanSendMessageTimestampMutation.mutateAsync({
      id: user?.id as string,
      canSendMessageTimestamp: newDate.toISOString(),
    });

    const newUserData = await findUserQuery.refetch();
    setUser(newUserData.data?.user as User);

    showNotification({
      title: 'Nice',
      message: 'Message was sent',
    });
  }, [createMessageMutation, messageContent, user?.id, nickname]);

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

export default SendMessageButton;
