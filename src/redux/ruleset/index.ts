import cards from './cards';
import { getRandomItemFromArray } from 'src/lib/utils';
import monsters from './monsters';

export default {
  maxHP: 20,
  maxEP: 20,
  maxCards: 20,
  maxHand: 5,

  baselineY: 0.575,

  ...cards,
  ...monsters,
};
