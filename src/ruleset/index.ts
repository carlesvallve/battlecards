
import cards from './cards';
import { getRandomItemFromArray } from 'src/lib/utils';


export default {
  maxHP: 20,
  maxEP: 20,
  maxCards: 20,
  maxHand: 5,

  ...cards,
};
