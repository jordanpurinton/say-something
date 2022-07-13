import data from '../data/badWords.json';

export const isProfane = (content: string) => {
  const parsedData = JSON.parse(JSON.stringify(data));
  const words = content.split(' ');
  for (const word of words) {
    if (word in parsedData) {
      return true;
    }
  }
  return false;
};
