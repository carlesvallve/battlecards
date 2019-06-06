import View from 'ui/View';
import Image from 'ui/resource/Image';

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
}

// utility types

export const tuple = <T extends string[]>(...args: T) => args;
export type Tuple<T, TLength extends number> = [T, ...T[]] & {
  length: TLength;
};
