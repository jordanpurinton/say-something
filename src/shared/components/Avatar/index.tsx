import { Avatar as MantineAvatar, UnstyledButton } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import styles from '../../styles/Avatar.module.scss';

export const Avatar: FC = () => {
  const { data } = useSession();
  const router = useRouter();

  return (
    <UnstyledButton onClick={() => router.push('/profile')}>
      <MantineAvatar
        className={styles.avatar}
        src={data?.user?.image || ''}
        alt={data?.user?.name || ''}
        size="md"
      />
    </UnstyledButton>
  );
};

export default Avatar;
