import React, { FC } from 'react';
import { Container, Loader, Title } from '@mantine/core';
import styles from '../../styles/Loading.module.scss';

interface LoadingProps {
  text?: string;
}

export const Loading: FC<LoadingProps> = ({ text }) => {
  return (
    <Container className={styles.loadingContainer}>
      {text && <Title order={3}>{text}</Title>}
      <Loader color="indigo" variant="dots" />
    </Container>
  );
};

export default Loading;
