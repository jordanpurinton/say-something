import { Container } from '@mantine/core';
import React, { FC, ReactNode } from 'react';
import styles from '../../styles/HomeContainer.module.scss';

interface HomeContainerProps {
  children: ReactNode;
}

const HomeContainer: FC<HomeContainerProps> = ({ children }) => (
  <Container className={styles.flexContainer}>{children}</Container>
);

export default HomeContainer;
