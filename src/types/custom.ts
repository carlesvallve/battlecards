import { MonsterID } from 'src/redux/ruleset/monsters';

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

// cards

export type CardPlayType =
  | 'modifier'
  | 'offensive'
  | 'defensive'
  | 'playable'
  | 'instant';

export type CardType = 'modifier' | 'shield' | 'weapon' | 'potion' | 'spell';

export type CardStat = {
  min?: number;
  max?: number;
  type?: string;
  randomMode?: string;
};

// combat

export type Target = 'hero' | 'monster';

export type TargetStat = {
  current?: number;
  max?: number;
  last?: number;
};

export type TargetAttitude = 'defensive' | 'neutral' | 'agressive';

export type TargetStatus =
  | 'bleeding'
  | 'wounded'
  | 'blinded'
  | 'stunned'
  | 'poisoned'
  | 'electrocuted'
  | 'burned'
  | 'frozen'
  | 'brokenarmour';

export type TargetData = {
  id: MonsterID | 'hero';
  meter: number;
  maxSteps: number;
  overhead: number;
  resolved: boolean;
  stats: {
    hp: TargetStat;
    ep: TargetStat;
    attack: TargetStat;
    defense: TargetStat;
    status: TargetStatus[];
  };
};

export type Combat = {
  index: {
    combat: number;
    turn: number;
  };

  target: Target;
  enemy: Target;
  hero: TargetData;
  monster: TargetData;
};

export type CombatResult = {
  winner: Target;
  loser: Target;
  attacks: number;
  isOverhead?: boolean;
};

// custom types

export type Screen = { width: number; height: number };
export type Point = { x: number; y: number };
