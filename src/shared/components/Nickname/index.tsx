import { Badge, Space, TextInput } from '@mantine/core';
import { isAfter } from 'date-fns';
import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { DEFAULT_NICKNAME, NICKNAME_MAX_LENGTH } from '../../constants';
import { useIsProfaneNickname, useNickname } from '../../context/AppContext';
import { useUser } from '../../context/UserContext';
import Filter from 'bad-words';

export const Nickname: FC = () => {
  const { user } = useUser();
  const { nickname, setNickname } = useNickname();
  const { isProfaneNickname, setIsProfaneNickname } = useIsProfaneNickname();

  const filter = useMemo(() => new Filter(), []);

  const shouldDisable = useMemo(
    () => isAfter(user?.canSendMessageTimestamp as Date, new Date()),
    [user]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setNickname(value);
      setIsProfaneNickname(filter.isProfane(value));
    },
    [setNickname, setIsProfaneNickname, filter]
  );

  return (
    <>
      <TextInput
        maxLength={NICKNAME_MAX_LENGTH}
        value={nickname}
        label={`Nickname: (${nickname.length} / ${NICKNAME_MAX_LENGTH})`}
        onChange={handleChange}
        disabled={shouldDisable}
        placeholder={`Defaults to ${DEFAULT_NICKNAME}`}
      />
      {isProfaneNickname && (
        <>
          <Space h="md" />
          <Badge color="red">Please be nice...</Badge>
        </>
      )}
    </>
  );
};

export default Nickname;
