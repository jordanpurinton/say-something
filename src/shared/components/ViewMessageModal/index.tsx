import { Button, Modal, Space, Text } from '@mantine/core';
import { Message } from '@prisma/client';
import React, { FC, useCallback, useEffect } from 'react';
import { ThumbDown, ThumbUp } from 'tabler-icons-react';
import { Vote, VoteChoice } from '../../constants';
import { useUser, useViewMessageModalIsOpen } from '../../context/AppContext';
import styles from '../../styles/ViewMessageModal.module.scss';
import { trpc } from '../../utils/trpc';

interface Props {
  randomMessage: Message | undefined;
}

export const ViewMessageModal: FC<Props> = ({ randomMessage }) => {
  const { user } = useUser();
  const { viewMessageModalIsOpen, setViewMessageModalIsOpen } =
    useViewMessageModalIsOpen();

  const [modalData, setModalData] = React.useState<Message | undefined>(
    randomMessage
  );
  const [didVote, setDidVote] = React.useState(false);
  const [voteChoice, setVoteChoice] = React.useState<VoteChoice>();

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
  const updateViewsMutation = trpc.useMutation('message.update-views');
  const updateCanViewMessageTimestampMutation = trpc.useMutation(
    'user.update-can-view-message-timestamp'
  );

  const handleClose = useCallback(async () => {
    setViewMessageModalIsOpen((prev) => !prev);
    if (modalData && voteChoice) {
      voteChoice === Vote.down
        ? await downvoteMessageMutation.mutateAsync({ id: modalData.id })
        : await upvoteMessageMutation.mutateAsync({ id: modalData.id });
    }
  }, [
    downvoteMessageMutation,
    modalData,
    setViewMessageModalIsOpen,
    upvoteMessageMutation,
    voteChoice,
  ]);

  const handleOptimisticUpdate = useCallback(
    async (type: VoteChoice) => {
      if (didVote && type === voteChoice) return;

      if (modalData) {
        const otherType: VoteChoice = type === Vote.down ? Vote.up : Vote.down;
        const newValue =
          type === Vote.down ? modalData.downvotes + 1 : modalData.upvotes + 1;

        const newMessageData = {
          ...modalData,
          [type as string]: newValue,
        };

        if (didVote && newMessageData[otherType] > 0) {
          newMessageData[otherType] -= 1;
        }

        setModalData(newMessageData as Message);
        setVoteChoice(type as VoteChoice);
        setDidVote(true);
      }
    },
    [didVote, modalData, voteChoice]
  );

  useEffect(() => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);

    const updateViews = async () => {
      if (modalData) {
        await updateViewsMutation.mutateAsync({ id: modalData.id });
        const res = await refetch();
        setModalData(res.data?.message as Message);
      }
    };
    updateViews();
    updateCanViewMessageTimestampMutation.mutateAsync({
      id: user?.id as string,
      canViewMessageTimestamp: newDate.toISOString(),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal
        opened={viewMessageModalIsOpen}
        onClose={handleClose}
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
            onClick={() => handleOptimisticUpdate(Vote.down)}
            rightIcon={
              <ThumbDown
                className={voteChoice === Vote.down ? styles.downFilled : ''}
              />
            }
            className={styles.voteButton}
            loaderPosition="right"
            variant="light"
            color="red"
          >
            Bad ({modalData?.downvotes})
          </Button>
          <Button
            onClick={() => handleOptimisticUpdate(Vote.up)}
            rightIcon={
              <ThumbUp
                className={voteChoice === Vote.up ? styles.upFilled : ''}
              />
            }
            className={styles.voteButton}
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

export default ViewMessageModal;
