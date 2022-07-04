import { TextInput } from '@mantine/core';
import { isAfter } from 'date-fns';
import React, { FC, useMemo } from 'react';
import { DEFAULT_NICKNAME, NICKNAME_MAX_LENGTH } from '../../constants';
import { useNickname } from '../../context/AppContext';
import { useUser } from '../../context/UserContext';

export const Nickname: FC = () => {
  const { user } = useUser();
  const { nickname, setNickname } = useNickname();

  const shouldDisable = useMemo(
    () => isAfter(user?.canSendMessageTimestamp as Date, new Date()),
    [user]
  );

  return (
    <TextInput
      maxLength={NICKNAME_MAX_LENGTH}
      value={nickname}
      label={`Nickname: (${nickname.length} / ${NICKNAME_MAX_LENGTH})`}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setNickname(e.target.value)
      }
      disabled={shouldDisable}
      placeholder={`Defaults to ${DEFAULT_NICKNAME}`}
    />
  );
};

export default Nickname;
