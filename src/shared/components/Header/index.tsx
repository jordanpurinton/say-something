import { Anchor, Header as MantineHeader, Text } from '@mantine/core';
import React, { FC } from 'react';
import styles from '../../styles/Header.module.scss';
import Avatar from '../Avatar';

export const Header: FC = () => {
  return (
    <MantineHeader className={styles.header} height={60} p="xs">
      <Anchor className={styles.headerAnchor} href="/">
        <Text className={styles.headerLink}>Home</Text>
      </Anchor>
      <Anchor className={styles.headerAnchor} href="/send-history">
        <Text className={styles.headerLink}>Send History</Text>
      </Anchor>
      <Anchor className={styles.headerAnchor} href="/view-history">
        <Text className={styles.headerLink}>View History</Text>
      </Anchor>
      <Avatar />
    </MantineHeader>
  );
};

export default Header;
