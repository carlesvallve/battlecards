import { CardNum } from 'src/game/components/cards/CardNumber';

// utility types

export const tuple = <T extends string[]>(...args: T) => args;
export type Tuple<T, TLength extends number> = [T, ...T[]] & {
  length: TLength;
};

// ui

export type GameState = 'title' | 'playing' | 'paused' | 'over';

export type NavState = 'leaving' | 'left' | 'entering' | 'entered';

export type SceneID = 'title' | 'game';

export type PopupID = 'popupPause';

export type PopupOpts = {
  id: string;
  enabled: boolean;
  opts?: any;
};

// combat

// export type CombatPhase = 'none' | 'dice' | 'resolve' | 'attack' | 'end';

// export type MonsterID =
//   | 'bat'
//   | 'beholder'
//   | 'brute'
//   | 'cowled'
//   | 'cyclop'
//   | 'darknight'
//   | 'delighted'
//   | 'dragon'
//   | 'dwarf-1'
//   | 'dwarf-2'
//   | 'elf'
//   | 'executioner'
//   | 'goblin'
//   | 'golem'
//   | 'ifrit'
//   | 'imp'
//   | 'litch'
//   | 'minion-1'
//   | 'minion-2'
//   | 'overlord'
//   | 'psionic'
//   | 'pyromaniac'
//   | 'slime'
//   | 'troglodyte';

export type Target = 'hero' | 'monster';

export type TargetData = {
  meter: number;
  overhead: number;
  resolved: boolean;
};

// export type CombatResult = {
//   winner: Target;
//   loser: Target;
//   attacks: number;
//   isOverhead: boolean;
//   isCritical: boolean;
//   attacking: boolean;
// };

// export type CombatTurn = {
//   target: Target;
//   index: number;
//   dice: CardNum;
// };

// export type CombatStats = {
//   resolved: boolean,
//   meter: number;
//   hp: number;
//   hpMax: number;
//   ep: number;
//   epMax: number;
//   damage: number;
//   armour: number;
// };

// custom types

export type Screen = { width: number; height: number };
export type Point = { x: number; y: number };
