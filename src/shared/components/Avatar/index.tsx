import { Avatar as MantineAvatar, UnstyledButton, Anchor } from '@mantine/core';
import { useSession } from 'next-auth/react';
import React, { FC } from 'react';
import styles from '../../styles/Avatar.module.scss';

export const Avatar: FC = () => {
  const { data } = useSession();

  return (
    <UnstyledButton>
      <Anchor href="/profile">
        <MantineAvatar
          className={styles.avatar}
          src={data?.user?.image || ''}
          alt={data?.user?.name || ''}
          size={32}
        />
      </Anchor>
    </UnstyledButton>
  );
};

export default Avatar;
