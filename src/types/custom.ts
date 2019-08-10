
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

export type Target = 'hero' | 'monster';

export type TargetStat = { current?: number; max?: number };

export type TargetData = {
  meter: number;
  overhead: number;
  resolved: boolean;
  stats: {
    hp: TargetStat;
    ep: TargetStat;
    attack: TargetStat;
    defense: TargetStat;
  };
};

// custom types

export type Screen = { width: number; height: number };
export type Point = { x: number; y: number };
