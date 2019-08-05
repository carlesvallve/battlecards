// utility types

export const tuple = <T extends string[]>(...args: T) => args;
export type Tuple<T, TLength extends number> = [T, ...T[]] & {
  length: TLength;
};

// ui

export type GameState = 'title' | 'playing' | 'paused' | 'over';

export type NavState = 'leaving' | 'left' | 'entering' | 'entered';

export type SceneID = 'title' | 'game';

export type PopupID = 'popupPause'; // | 'continue';

export type PopupOpts = {
  id: string;
  enabled: boolean;
  opts?: any;
};

// combat

export type CombatPhase = 'none' | 'drawing' | 'preparingAttacks' | 'attacking';

export type Target = 'hero' | 'monster';

// custom types

export type Screen = { width: number; height: number };
export type Point = { x: number; y: number };

// export type debugLine = { enabled: boolean; debugView: View; duration: number };

// export type raycastResult = {
//   doCollide: boolean;
//   position: point;
//   distance: number;
// };

// export type tileData = {
//   type: number;
//   image: Image;
//   offset: point;
//   walkable: boolean;
// };

// export const entityStates = tuple('Idle', 'Run', 'Jump', 'Attack', 'Die');
// export type entityState = typeof entityStates[number];
