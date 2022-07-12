import { useEffect, useState } from 'react';

// https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks

const padWithZero = (value: number): string =>
  value < 10 ? `0${value}` : value.toString();

const getReturnValues = (
  countDown: number
): {
  hours: string;
  minutes: string;
  seconds: string;
} => {
  const hours = padWithZero(
    Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const minutes = padWithZero(
    Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  );
  const seconds = padWithZero(Math.floor((countDown % (1000 * 60)) / 1000));

  return { hours, minutes, seconds };
};

export { useCountdown };

const useCountdown = (targetDate: Date) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};
