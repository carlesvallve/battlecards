// eslint-disable

// Source:
// https://github.com/Microsoft/TypeScript/issues/13923#issuecomment-402901005

type Primitive = undefined | null | boolean | string | number | Function;

// prettier-ignore
export type Immutable<T> = T extends Primitive
    ? T
    : T extends Array<infer U>
        ? DeepImmutableArray<U>
        : T extends Map<infer K, infer V> ? DeepImmutableMap<K, V> : DeepImmutableObject<T>;

interface DeepImmutableArray<T> extends Readonly<Array<Immutable<T>>> {}
interface DeepImmutableMap<K, V>
  extends Readonly<Map<Immutable<K>, Immutable<V>>> {}
type DeepImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };
