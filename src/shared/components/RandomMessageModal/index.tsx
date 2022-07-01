import { Button, Modal, Space, Text } from '@mantine/core';
import { Message } from '@prisma/client';
import React, { useCallback } from 'react';
import { FC } from 'react';
import { ThumbDown, ThumbUp } from 'tabler-icons-react';
import { useRandomMessageModalIsOpen } from '../../context/AppContext';
import styles from '../../styles/RandomMessageModal.module.scss';
import { trpc } from '../../utils/trpc';

interface Props {
  randomMessage: Message | undefined;
}

export const RandomMessageModal: FC<Props> = ({ randomMessage }) => {
  const { randomMessageModalIsOpen, setRandomMessageModalIsOpen } =
    useRandomMessageModalIsOpen();
  const [isDownvoting, setIsDownvoting] = React.useState(false);
  const [isUpvoting, setIsUpvoting] = React.useState(false);
  const [modalData, setModalData] = React.useState<Message | undefined>(
    randomMessage
  );

  const { refetch } = trpc.useQuery(
    [
      'message.find',
      {
        id: modalData?.id as number,
      },
    ],
    {
      enabled: false,
    }
  );
  const downvoteMessageMutation = trpc.useMutation('message.downvote-message');
  const upvoteMessageMutation = trpc.useMutation('message.upvote-message');

  const handleDownvote = useCallback(async () => {
    setIsDownvoting(true);

    if (modalData) {
      await downvoteMessageMutation.mutateAsync({
        id: modalData.id,
      });
    }

    const res = await refetch();
    setModalData(res.data?.message as Message);
    setIsDownvoting(false);
  }, [downvoteMessageMutation, modalData, refetch]);

  const handleUpvote = useCallback(async () => {
    setIsUpvoting(true);

    if (modalData) {
      await upvoteMessageMutation.mutateAsync({
        id: modalData.id,
      });
    }

    const res = await refetch();
    setModalData(res.data?.message as Message);
    setIsUpvoting(false);
  }, [modalData, refetch, upvoteMessageMutation]);

  return (
    <>
      <Modal
        opened={randomMessageModalIsOpen}
        onClose={() => setRandomMessageModalIsOpen((prev) => !prev)}
        title="Viewing Daily Message"
        centered
      >
        <Text size="lg">{modalData?.content}</Text>
        <Space h="md" />
        <Text size="sm">{modalData?.views} views</Text>
        <Space h="md" />
        <Text size="xs" weight="bold">
          From {modalData?.nickname}
        </Text>
        <Text size="xs" color="dimmed">
          Sent on {modalData?.createdAt.toDateString()}
        </Text>
        <Space h="md" />
        <div>
          <Button
            onClick={handleDownvote}
            rightIcon={<ThumbDown />}
            className={styles.voteIcon}
            loading={isDownvoting}
            loaderPosition="right"
            variant="light"
            color="red"
          >
            Bad ({modalData?.downvotes})
          </Button>
          <Button
            onClick={handleUpvote}
            rightIcon={<ThumbUp />}
            className={styles.voteIcon}
            loading={isUpvoting}
            loaderPosition="right"
            variant="light"
            color="green"
          >
            Nice ({modalData?.upvotes})
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RandomMessageModal;
