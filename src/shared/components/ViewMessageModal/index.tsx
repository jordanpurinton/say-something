import { Button, Modal, Space, Text } from '@mantine/core';
import { Message, User } from '@prisma/client';
import React, { FC, useCallback, useEffect } from 'react';
import { ThumbDown, ThumbUp } from 'tabler-icons-react';
import { Vote, VoteChoice } from '../../constants';
import { useViewMessageModalIsOpen } from '../../context/AppContext';
import { useUser } from '../../context/UserContext';
import styles from '../../styles/ViewMessageModal.module.scss';
import { trpc } from '../../utils/trpc';

interface Props {
  randomMessage: Message;
}

export const ViewMessageModal: FC<Props> = ({ randomMessage }) => {
  const { user, setUser } = useUser();
  const { viewMessageModalIsOpen, setViewMessageModalIsOpen } =
    useViewMessageModalIsOpen();

  const [modalData, setModalData] = React.useState<Message>(randomMessage);
  const [didVote, setDidVote] = React.useState(false);
  const [voteChoice, setVoteChoice] = React.useState<VoteChoice | undefined>(
    undefined
  );

  const downvoteMessageMutation = trpc.useMutation('message.downvote-message');
  const upvoteMessageMutation = trpc.useMutation('message.upvote-message');
  const updateViewsMutation = trpc.useMutation('message.update-views');
  const updateCanViewMessageTimestampMutation = trpc.useMutation(
    'user.update-can-view-message-timestamp'
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

  const handleClose = useCallback(async () => {
    setViewMessageModalIsOpen((prev) => !prev);
    updateViewsMutation.mutateAsync({ id: modalData.id });
    if (modalData && voteChoice) {
      voteChoice === Vote.down
        ? await downvoteMessageMutation.mutateAsync({ id: modalData.id })
        : await upvoteMessageMutation.mutateAsync({ id: modalData.id });
    }
  }, [
    downvoteMessageMutation,
    modalData,
    setViewMessageModalIsOpen,
    updateViewsMutation,
    upvoteMessageMutation,
    voteChoice,
  ]);

  const handleOptimisticUpdate = useCallback(
    async (newVoteChoice: VoteChoice) => {
      let newMessageData: Message = { ...modalData };
      const isSameVoteChoice = newVoteChoice === voteChoice;
      const otherVoteChoice = newVoteChoice === Vote.up ? Vote.down : Vote.up;

      // @ts-ignore
      const currentValue = newMessageData[newVoteChoice as string];
      // @ts-ignore
      const otherCurrentValue = newMessageData[otherVoteChoice as string];

      if (didVote && isSameVoteChoice) {
        newMessageData = {
          ...newMessageData,
          [newVoteChoice as string]: currentValue - 1,
        };
      } else if (didVote && !isSameVoteChoice) {
        newMessageData = {
          ...newMessageData,
          [newVoteChoice as string]: currentValue + 1,
          [otherVoteChoice as string]: otherCurrentValue - 1,
        };
      } else if (!didVote) {
        newMessageData = {
          ...newMessageData,
          [newVoteChoice as string]: currentValue + 1,
        };
      }

      setModalData(newMessageData);
      setDidVote(newVoteChoice !== voteChoice);
      setVoteChoice((prev) =>
        prev === newVoteChoice ? undefined : newVoteChoice
      );
    },
    [didVote, modalData, voteChoice]
  );

  useEffect(() => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);

    const updateUser = async () => {
      await updateCanViewMessageTimestampMutation.mutateAsync({
        id: user?.id as string,
        canViewMessageTimestamp: newDate.toISOString(),
      });
      const newUserData = await findUserQuery.refetch();
      setUser(newUserData.data?.user as User);
    };

    updateUser();
    setModalData({
      ...modalData,
      views: modalData.views + 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
  );
};

export default ViewMessageModal;
