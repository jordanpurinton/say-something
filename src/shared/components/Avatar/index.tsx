import { Avatar as MantineAvatar } from '@mantine/core';
import { useSession } from 'next-auth/react';
import React, { FC } from 'react';
import styles from '../../styles/Avatar.module.scss';

export const Avatar: FC = () => {
  const { data } = useSession();

  return (
    <MantineAvatar
      className={styles.avatar}
      src={data?.user?.image || ''}
      alt={data?.user?.name || ''}
      size={40}
    />
  );
};

export default Avatar;
