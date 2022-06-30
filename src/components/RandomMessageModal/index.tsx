import { Modal } from '@mantine/core';
import React from 'react';
import { FC } from 'react';
import { useRandomMessageModalIsOpen } from '../../context/AppContext';

interface Props {
  randomMessage: any;
}

export const RandomMessageModal: FC<Props> = ({ randomMessage }) => {
  const { randomMessageModalIsOpen, setRandomMessageModalIsOpen } =
    useRandomMessageModalIsOpen();

  return (
    <>
      <Modal
        opened={randomMessageModalIsOpen}
        onClose={() => setRandomMessageModalIsOpen((prev) => !prev)}
        title="Introduce yourself!"
      >
        {JSON.stringify(randomMessage)}
      </Modal>
    </>
  );
};

export default RandomMessageModal;
