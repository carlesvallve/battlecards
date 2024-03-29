import {
  CardType,
  TargetStatus,
  CardPlayType,
  CardStat,
} from 'src/types/custom';

/*
- stun punch
- pass meter and give attack bonus next round
- +1 attack for rest of combat
- kick to double next dice
- play next card 2 times
- get hp for each successfull attack
- 
*/

// ================ cards =================

const cards = {
  // ============================================
  // modifier

  one: {
    playType: 'modifier' as CardPlayType,
    type: 'modifier' as CardType,
    value: { min: 1, max: 1 } as CardStat,
    image: null,
    name: '+1',
    desc: 'Adds +1 to your combat meter',
    ep: 5,
  },

  two: {
    playType: 'modifier' as CardPlayType,
    type: 'modifier' as CardType,
    value: { min: 2, max: 2 } as CardStat,
    image: null,
    name: '+2',
    desc: 'Adds +2 to your combat meter',
    ep: 5,
  },

  three: {
    playType: 'modifier' as CardPlayType,
    type: 'modifier' as CardType,
    value: { min: 3, max: 3 } as CardStat,
    image: null,
    name: '+3',
    desc: 'Adds +3 to your combat meter',
    ep: 5,
  },

  six: {
    playType: 'modifier' as CardPlayType,
    type: 'modifier' as CardType,
    value: { min: 3, max: 3 } as CardStat,
    image: null,
    name: '+6',
    desc: 'Adds +6 to your combat meter',
    ep: 5,
  },

  oneToThree: {
    playType: 'modifier' as CardPlayType,
    type: 'modifier' as CardType,
    value: { min: 1, max: 3, randomMode: 'BETWEEN' } as CardStat,
    image: null,
    name: '1-3',
    desc: 'Adds a random value between 1 and 3 to your combat meter',
    ep: 5,
  },

  oneToFive: {
    playType: 'modifier' as CardPlayType,
    type: 'modifier' as CardType,
    value: { min: 1, max: 5, randomMode: 'BETWEEN' } as CardStat,
    image: null,
    name: '1-5',
    desc: 'Adds a random value between 1 and 5 to your combat meter',
    ep: 5,
  },

  oneOrTen: {
    playType: 'modifier' as CardPlayType,
    type: 'modifier' as CardType,
    value: { min: 1, max: 10, randomMode: 'OR' } as CardStat,
    image: null,
    name: '1/10',
    desc: 'Adds either +1 or +10 to your combat meter',
    ep: 5,
  },

  // ============================================
  // shield

  buckler: {
    playType: 'defensive' as CardPlayType,
    type: 'shield' as CardType,
    value: { min: 1 } as CardStat,
    image: 'resources/images/cards/shields/round-shield.png',
    name: 'Buckler',
    desc: 'Block 1 attack',
    ep: 10,
  },

  shield: {
    playType: 'defensive' as CardPlayType,
    type: 'shield' as CardType,
    value: { min: 2 } as CardStat,
    image: 'resources/images/cards/shields/griffin-shield.png',
    name: 'Shield',
    desc: 'Block 2 attacks',
    ep: 10,
  },

  // superiorShield: {
  //   playType: 'defensive' as CardPlayType,
  //   type: 'shield' as CardType,
  //   value: { min: 3 } as CardStat,
  //   image: 'resources/images/cards/shields/winged-shield.png',
  //   name: 'Superior Shield',
  //   desc: 'Block 3 attacks',
  //   ep: 10,
  // },

  // ============================================
  // weapon

  dagger: {
    playType: 'offensive' as CardPlayType,
    type: 'weapon' as CardType,
    value: { min: 1, max: 1 } as CardStat,
    image: 'resources/images/cards/weapons/machete.png',
    name: 'Dagger',
    desc: 'Add 1 attacks and cause BLEEDING',
    ep: 10,
    effect: 'bleeding' as TargetStatus,
  },

  sword: {
    playType: 'offensive' as CardPlayType,
    type: 'weapon' as CardType,
    value: { min: 2, max: 2 } as CardStat,
    image: 'resources/images/cards/weapons/sword-brandish.png',
    name: 'Sword',
    desc: 'Add 1 attacks and cause BLEEDING',
    ep: 10,
    effect: 'bleeding' as TargetStatus,
  },

  // superiorSword: {
  //   playType: 'offensive' as CardPlayType,
  //   type: 'weapon' as CardType,
  //   value: { min: 3, max: 3 } as CardStat,
  //   image: 'resources/images/cards/weapons/pointy-sword.png',
  //   name: 'superior Sword',
  //   desc: 'Add 2 attacks and cause BLEEDING',
  //   ep: 10,
  //   effect: 'wounded' as TargetStatus,
  // },

  axe: {
    playType: 'offensive' as CardPlayType,
    type: 'weapon' as CardType,
    value: { min: 2, max: 2 } as CardStat,
    image: 'resources/images/cards/weapons/battered-axe.png',
    name: 'Battle Axe',
    desc: 'Add 1 attack and cause ARMOUR BREAK',
    ep: 10,
    effect: 'brokenarmour' as TargetStatus,
  },

  // greatAxe: {
  //   playType: 'offensive' as CardPlayType,
  //   type: 'weapon' as CardType,
  //   value: { min: 3, max: 3 } as CardStat,
  //   image: 'resources/images/cards/weapons/sharp-axe.png',
  //   name: 'Great Axe',
  //   desc: 'Add 2 attacks and cause ARMOUR BREAK',
  //   ep: 10,
  //   effect: 'brokenarmour' as TargetStatus,
  // },

  // club: {
  //   playType: 'offensive' as CardPlayType,
  //   type: 'weapon' as CardType,
  //   value: { min: 1, max: 1 } as CardStat,
  //   image: 'resources/images/cards/weapons/wood-club.png',
  //   name: 'Club',
  //   desc: 'Add 1 attacks and cause STUNNING',
  //   ep: 10,
  //   effect: 'stunned' as TargetStatus,
  // },

  flail: {
    playType: 'offensive' as CardPlayType,
    type: 'weapon' as CardType,
    value: { min: 3, max: 3 } as CardStat,
    image: 'resources/images/cards/weapons/flail.png',
    name: 'Morning Star',
    desc: 'Add 2 attacks and cause STUNNING',
    ep: 10,
    effect: 'stunned' as TargetStatus,
  },

  // ============================================
  // potions

  potionHP: {
    playType: 'instant' as CardPlayType,
    type: 'potion' as CardType,
    value: { min: 10, max: 10, type: 'hp' } as CardStat,
    image: 'resources/images/cards/potions/health-potion.png',
    name: 'HP Potion',
    desc: 'Restores 10 HP',
    ep: 0,
  },

  potionEP: {
    playType: 'instant' as CardPlayType,
    type: 'potion' as CardType,
    value: { min: 10, max: 10, type: 'ep' } as CardStat,
    image: 'resources/images/cards/potions/potion-ball.png',
    name: 'EP Potion',
    desc: 'Restores 10 EP',
    ep: 0,
  },

  // ============================================
  // spells

  fire: {
    playType: 'instant' as CardPlayType,
    type: 'spell' as CardType,
    value: { min: 14, max: 10 } as CardStat,
    image: 'resources/images/cards/spells/fire-spell-cast.png',
    name: 'Fire Ball',
    desc: '14 fire damage and cause BURNING',
    ep: 10,
    effect: 'burned' as TargetStatus,
  },

  ice: {
    playType: 'instant' as CardPlayType,
    type: 'spell' as CardType,
    value: { min: 10, max: 10 } as CardStat,
    image: 'resources/images/cards/spells/ice-spell-cast.png',
    name: 'Ice Blast',
    desc: '10 ice damage and cause FROZEN',
    ep: 10,
    effect: 'frozen' as TargetStatus,
  },

  poison: {
    playType: 'instant' as CardPlayType,
    type: 'spell' as CardType,
    value: { min: 10, max: 10 } as CardStat,
    image: 'resources/images/cards/spells/poison-gas.png',
    name: 'Poison Spit',
    desc: '10 poison damage and cause POISON',
    ep: 10,
    effect: 'poisoned' as TargetStatus,
  },

  bolt: {
    playType: 'instant' as CardPlayType,
    type: 'spell' as CardType,
    value: { min: 10, max: 10 } as CardStat,
    image: 'resources/images/cards/spells/bolt-spell-cast.png',
    name: 'Bolt',
    desc: '10 electric damage and cause ELECTRO',
    ep: 10,
    effect: 'electrocuted' as TargetStatus,
  },
};

// ======================================================

export type CardID = keyof typeof cards;
export type CardData = (typeof cards)[CardID];
const cardIds: CardID[] = Object.keys(cards) as CardID[];

export default {
  cardIds,
  cards,
};

// ======================================================
