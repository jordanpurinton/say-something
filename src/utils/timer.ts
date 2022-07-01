import { differenceInSeconds } from 'date-fns';

export const getTimerDifference = (start: Date, end: Date) => {
  // get timer difference in seconds
  const difference = differenceInSeconds(end, start);
  return difference;
};

export const formatSecondsToTimer = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  const hoursString = hours > 0 ? `${hours}:` : '';
  const minutesString = minutes > 0 ? `${minutes}:` : '';
  const secondsString = secondsLeft > 0 ? `${secondsLeft}` : '';
  const timer = `${hoursString}${minutesString}${secondsString}`;
  return timer;
};
