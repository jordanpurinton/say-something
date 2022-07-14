import { Message } from '@prisma/client';
import { Button, Card, Space, Text } from '@mantine/core';
import { FC, useCallback } from 'react';
import { ThumbDown, ThumbUp } from 'tabler-icons-react';
import { Vote, VoteChoice } from '../../constants';
import React from 'react';
import styles from '../../styles/MessageCard.module.scss';
import { format } from 'date-fns';

interface MessageCardProps {
  message: Message;
  readonly?: boolean;
  voteChoice?: VoteChoice | undefined;
  handleOptimisticVoteUpdate?: (newVoteChoice: VoteChoice) => void;
}

export const MessageCard: FC<MessageCardProps> = ({
  message,
  readonly,
  voteChoice,
  handleOptimisticVoteUpdate,
}) => {
  const handleVote = useCallback(
    async (newVoteChoice: VoteChoice) => {
      if (handleOptimisticVoteUpdate && !readonly) {
        handleOptimisticVoteUpdate(newVoteChoice);
      }
    },
    [handleOptimisticVoteUpdate, readonly]
  );
  return (
    <Card style={{ width: 340, margin: 'auto' }} shadow="md">
      <Text size="lg">{message?.content}</Text>
      <Space h="md" />
      <Text size="sm">{message?.views} views</Text>
      <Space h="md" />
      <Text size="xs" weight="bold">
        From {message?.nickname}
      </Text>
      <Text size="xs" color="dimmed">
        {format(message?.createdAt, 'MMM dd, yyyy')}
        <Space w="xs" />
        {format(message?.createdAt, 'hh:mm a')}
      </Text>
      <Space h="md" />
      <div>
        <Button
          className={`${styles.voteButton} ${
            readonly ? styles.disabledVoteButton : ''
          }`}
          onClick={() => (readonly ? {} : handleVote(Vote.down))}
          rightIcon={
            <ThumbDown
              className={voteChoice === Vote.down ? styles.downFilled : ''}
            />
          }
          loaderPosition="right"
          variant="light"
          color="red"
        >
          Bad ({message?.downvotes})
        </Button>
        <Button
          onClick={() => (readonly ? {} : handleVote(Vote.up))}
          rightIcon={
            <ThumbUp
              className={voteChoice === Vote.up ? styles.upFilled : ''}
            />
          }
          className={`${styles.voteButton} ${
            readonly ? styles.disabledVoteButton : ''
          }`}
          loaderPosition="right"
          variant="light"
          color="green"
        >
          Nice ({message?.upvotes})
        </Button>
      </div>
    </Card>
  );
};

export default MessageCard;
