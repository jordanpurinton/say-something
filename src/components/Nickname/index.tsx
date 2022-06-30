import { TextInput } from '@mantine/core';
import React, { FC } from 'react';
import { useNickname } from '../../context/AppContext';

export const Nickname: FC = () => {
  const { nickname, setNickname } = useNickname();
  return (
    <TextInput
      label="Nickname"
      value={nickname}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setNickname(e.target.value)
      }
      placeholder={'Anonymous'}
    />
  );
};

export default Nickname;
