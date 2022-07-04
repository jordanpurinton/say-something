import { TextInput } from '@mantine/core';
import React, { FC } from 'react';
import { DEFAULT_NICKNAME, NICKNAME_MAX_LENGTH } from '../../constants';
import { useNickname } from '../../context/AppContext';

export const Nickname: FC = () => {
  const { nickname, setNickname } = useNickname();
  return (
    <TextInput
      maxLength={NICKNAME_MAX_LENGTH}
      value={nickname}
      label={`Nickname: (${nickname.length} / ${NICKNAME_MAX_LENGTH})`}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
      placeholder={`Defaults to ${DEFAULT_NICKNAME}`}
    />
  );
};

export default Nickname;
