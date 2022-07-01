import { Button, Modal, Space, Text } from '@mantine/core';
import { Message } from '@prisma/client';
import React from 'react';
import { FC } from 'react';
import { ThumbDown, ThumbUp } from 'tabler-icons-react';
import { useRandomMessageModalIsOpen } from '../../context/AppContext';
import styles from '../../styles/RandomMessageModal.module.scss';

interface Props {
  randomMessage: Message | undefined;
}

export const RandomMessageModal: FC<Props> = ({ randomMessage }) => {
  const { randomMessageModalIsOpen, setRandomMessageModalIsOpen } =
    useRandomMessageModalIsOpen();

  return (
    <>
      <Modal
        opened={randomMessageModalIsOpen}
        onClose={() => setRandomMessageModalIsOpen((prev) => !prev)}
        title="Viewing Random Message"
        centered
      >
        <Text size="lg">{randomMessage?.content}</Text>
        <Space h="md" />
        <Text size="sm">{randomMessage?.views} views</Text>
        <Space h="md" />
        <Text size="xs" weight="bold">
          From {randomMessage?.nickname}
        </Text>
        <Text size="xs" color="dimmed">
          Sent on {randomMessage?.createdAt.toDateString()}
        </Text>
        <Space h="md" />
        <div>
          <Button
            rightIcon={<ThumbDown />}
            className={styles.voteIcon}
            variant="light"
            color="red"
          >
            Bad ({randomMessage?.downvotes})
          </Button>
          <Button
            rightIcon={<ThumbUp />}
            className={styles.voteIcon}
            variant="light"
            color="green"
          >
            Nice ({randomMessage?.upvotes})
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RandomMessageModal;
