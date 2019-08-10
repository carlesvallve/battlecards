import { getRandomItemFromArray } from './utils';

export const getRandomColor = () => {
  const colors = [
    'white',
    'yellow',
    'orange',
    'pink',
    'cyan',
    'red',
    'grey',
    'green',
    'magenta',
    'black',
    'blue',
  ];

  return getRandomItemFromArray(colors);
};
