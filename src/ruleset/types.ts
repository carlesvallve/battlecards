export const tuple = <T extends string[]>(...args: T) => args;

export type Tuple<T, TLength extends number> = [T, ...T[]] & {
  length: TLength;
};

export function isKey<T>(
  key: string | number | symbol,
  value: T,
): key is keyof T {
  return key in value;
}

// export type Point = { x: number; y: number };
// export type Rect = { x: number; y: number; width: number; height: number };
