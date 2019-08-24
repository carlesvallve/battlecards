import cards from './cards';
import monsters from './monsters';
import cheats from './cheats';

export default {
  maxHP: 20,
  maxEP: 20,
  maxCards: 20,
  maxHand: 5,

  baselineY: 0.57,

  ...cards,
  ...monsters,
  ...cheats,
};
