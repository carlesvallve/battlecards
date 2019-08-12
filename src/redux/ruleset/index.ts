import cards from './cards';
import monsters from './monsters';

export default {
  maxHP: 20,
  maxEP: 20,
  maxCards: 20,
  maxHand: 5,

  baselineY: 0.58,

  ...cards,
  ...monsters,
};
