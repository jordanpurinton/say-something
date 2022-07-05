import { Container } from '@mantine/core';
import React, { FC, ReactNode } from 'react';
import styles from '../../styles/PageContainer.module.scss';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ children }) => (
  <Container className={styles.flexContainer}>{children}</Container>
);

export default PageContainer;
