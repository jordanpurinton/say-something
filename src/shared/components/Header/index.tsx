import { Button, Header as MantineHeader, Title } from '@mantine/core';
import Avatar from '../Avatar';
import styles from '../../styles/Header.module.scss';
import { useRouter } from 'next/router';
import { FC } from 'react';

export const Header: FC = () => {
  const router = useRouter();

  return (
    <MantineHeader className={styles.header} height={60} p="xs">
      <Button className={styles.headerButton} onClick={() => router.push('/')}>
        <Title order={2}>Say Something</Title>
      </Button>
      <Avatar />
    </MantineHeader>
  );
};

export default Header;