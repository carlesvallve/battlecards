import { CardNum } from "src/game/components/cards/CardNumber";

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

export type Target = 'hero' | 'monster';

export type CombatResult = {
  winner: Target;
  loser: Target;
  attacks: number;
  isOverhead: boolean;
  isCritical: boolean;
  attacking: boolean;
};

export type CombatTurn = {
  target: Target;
  index: number;
  dice: CardNum;
};

export type CombatStats = {
  meter: number;
  hp: number;
  hpMax: number;
  ep: number;
  epMax: number;
  damage: number;
  armour: number;
};

// custom types

export type Screen = { width: number; height: number };
export type Point = { x: number; y: number };
