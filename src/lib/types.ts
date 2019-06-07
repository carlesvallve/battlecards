import View from 'ui/View';
import Image from 'ui/resource/Image';
// import { gameStates, entityStates } from 'src/lib/enums';

// utility types

export const tuple = <T extends string[]>(...args: T) => args;
export type Tuple<T, TLength extends number> = [T, ...T[]] & {
  length: TLength;
};

// custom types

export type point = { x: number; y: number };
export type screen = { width: number; height: number };
export type debugLine = { enabled: boolean; debugView: View; duration: number };

export type raycastResult = {
  doCollide: boolean;
  position: point;
  distance: number;
};

export type tileData = {
  type: number;
  image: Image;
  offset: point;
  walkable: boolean;
};

export const gameStates = tuple('Title', 'Play', 'Pause', 'GameOver');
export type gameState = typeof gameStates[number];

export const entityStates = tuple('Idle', 'Run', 'Jump', 'Attack', 'Die');
export type entityState = typeof entityStates[number];
