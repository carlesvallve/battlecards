import cards from './cards';
import monsters from './monsters';

export default {
  // cheats
  cheats: {
    player: {
      skipCostEP: true,
    },

    monster: {
      skipCostEP: true,
    },
  },

  maxHP: 20,
  maxEP: 20,
  maxCards: 20,
  maxHand: 5,

  baselineY: 0.57,

  ...cards,
  ...monsters,
};
