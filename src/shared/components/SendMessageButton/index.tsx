import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import { isAfter } from 'date-fns';
import React, { FC, useCallback, useMemo } from 'react';
import { Message } from 'tabler-icons-react';
import { DEFAULT_NICKNAME } from '../../constants';
import {
  useIsProfaneInput,
  useMessageContent,
  useNickname,
} from '../../context/AppContext';
import { useUser } from '../../context/UserContext';
import { trpc } from '../../utils/trpc';

export const SendMessageButton: FC = () => {
  const { user, setUser } = useUser();
  const { messageContent, setMessageContent } = useMessageContent();
  const { nickname, setNickname } = useNickname();
  const { isProfaneInput } = useIsProfaneInput();

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

  const shouldDisable = useMemo(
    () =>
      messageContent.trim().length === 0 ||
      isAfter(user?.canSendMessageTimestamp as Date, new Date()) ||
      updateCanSendMessageTimestampMutation.isLoading ||
      isProfaneInput,
    [
      messageContent,
      user?.canSendMessageTimestamp,
      updateCanSendMessageTimestampMutation.isLoading,
      isProfaneInput,
    ]
  );

  const handleClick = useCallback(async () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);

    setMessageContent('');
    setNickname('');

    createMessageMutation.mutateAsync({
      content: messageContent,
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
  }, [
    createMessageMutation,
    messageContent,
    nickname,
    updateCanSendMessageTimestampMutation,
    user?.id,
    findUserQuery,
    setUser,
    setMessageContent,
    setNickname,
  ]);

  // TODO: fix disabled not updating when user countdown expires
  return (
    <Button
      disabled={shouldDisable}
      onClick={handleClick}
      loading={updateCanSendMessageTimestampMutation.isLoading}
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
