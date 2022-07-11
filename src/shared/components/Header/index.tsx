import { Header as MantineHeader, Text } from '@mantine/core';
import Link from 'next/link';
import React, { FC } from 'react';
import styles from '../../styles/Header.module.scss';
import Avatar from '../Avatar';

export const Header: FC = () => {
  return (
    <MantineHeader className={styles.header} height={60} p="xs">
      <Link className={styles.headerButton} href="/">
        <Text className={styles.headerLink}>Home</Text>
      </Link>
      <Link className={styles.headerButton} href="/send-history">
        <Text className={styles.headerLink}>Send History</Text>
      </Link>
      <Link className={styles.headerButton} href="/view-history">
        <Text className={styles.headerLink}>View History</Text>
      </Link>
      <Avatar />
    </MantineHeader>
  );
};

export default Header;
