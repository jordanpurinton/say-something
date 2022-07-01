import { FC, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getTimerDifference } from '../../utils/timer';

export const ViewMessageTimer: FC = () => {
  const { data } = useSession();
  const [now, setNow] = useState(new Date());
  const [secondsremaining, setSecondsRemaining] = useState(
    getTimerDifference(
      new Date(data?.userWithProfile.canViewMessageTimestamp as string),
      now
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newNow = new Date();
      setNow(newNow);
      setSecondsRemaining(
        getTimerDifference(
          now,
          new Date(data?.userWithProfile?.canViewMessageTimestamp as string)
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.userWithProfile?.canViewMessageTimestamp, now]);

  return <div>{secondsremaining}</div>;
};

export default ViewMessageTimer;
