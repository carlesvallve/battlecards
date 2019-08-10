const monsters = {
  bat: {
    name: 'Bat',
    desc: 'flying scavenger',
    attack: 0,
    defense: 0,
    image: 'bat',
  },
  beholder: {
    name: 'Beholder',
    desc: 'evil flying eye',
    attack: 0,
    defense: 0,
    image: 'beholder',
  },
  brute: { name: 'Brute', desc: '', attack: 0, defense: 0, image: 'brute' },
  cowled: { name: 'Cowled', desc: '', attack: 0, defense: 0, image: 'cowled' },
  cyclop: { name: 'Cyclop', desc: '', attack: 0, defense: 0, image: 'cyclop' },
  darknight: {
    name: 'Dark Knight',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'darknight',
  },
  delighted: {
    name: 'Delighted',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'delighted',
  },
  dragon: { name: 'Dragon', desc: '', attack: 0, defense: 0, image: 'dragon' },
  dwarf1: { name: 'Dwarf', desc: '', attack: 0, defense: 0, image: 'dwarf-1' },
  dwarf2: {
    name: 'Battle Dwarf',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'dwarf-2',
  },
  elf: { name: 'Dark Elf', desc: '', attack: 0, defense: 0, image: 'elf' },
  executioner: {
    name: 'Executioner',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'executioner',
  },
  goblin: { name: 'Goblin', desc: '', attack: 0, defense: 0, image: 'goblin' },
  golem: { name: 'Golem', desc: '', attack: 0, defense: 0, image: 'golem' },
  ifrit: { name: 'Ifrit', desc: '', attack: 0, defense: 0, image: 'ifrit' },
  imp: { name: 'Imp', desc: '', attack: 0, defense: 0, image: 'imp' },
  litch: { name: 'Litch', desc: '', attack: 0, defense: 0, image: 'litch' },
  minion1: {
    name: 'Minion',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'minion-1',
  },
  minion2: {
    name: 'Demon',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'minion-2',
  },
  overlord: {
    name: 'Overlord',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'overlord',
  },
  psionic: {
    name: 'Psionic',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'psionic',
  },
  pyromaniac: {
    name: 'Pyromaniac',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'pyromaniac',
  },
  slime: { name: 'Slime', desc: '', attack: 0, defense: 0, image: 'slime' },
  troglodyte: {
    name: 'Troglodyte',
    desc: '',
    attack: 0,
    defense: 0,
    image: 'troglodyte',
  },
};

export type MonsterID = keyof typeof monsters;
export type Monster = (typeof monsters)[MonsterID];
const monsterIds: MonsterID[] = Object.keys(monsters) as MonsterID[];

export default {
  monsterIds,
  monsters,
};

// ======================================================
// getters

export const getMonstersArray = (): string[] => {
  return Object.keys(monsters);
};
