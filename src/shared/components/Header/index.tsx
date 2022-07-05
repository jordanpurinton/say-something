import { Anchor, Header as MantineHeader, Text, Title } from '@mantine/core';
import React, { FC } from 'react';
import styles from '../../styles/Header.module.scss';
import Avatar from '../Avatar';
import Link from 'next/link';

export const Header: FC = () => {
  return (
    <MantineHeader className={styles.header} height={60} p="xs">
      <Link href="/">
        <Anchor className={styles.headerAnchor}>
          <Title order={2}>Say Something</Title>
        </Anchor>
      </Link>
      <Link href="/send-history">
        <Anchor className={styles.headerAnchor}>
          <Text className={styles.headerLink}>Send History</Text>
        </Anchor>
      </Link>
      <Link href="/view-history">
        <Anchor className={styles.headerAnchor}>
          <Text className={styles.headerLink}>View History</Text>
        </Anchor>
      </Link>
      <Avatar />
    </MantineHeader>
  );
};

export default Header;
