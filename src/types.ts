
/**
 * Convert Array To Tuple (with order)
 * @private
 * @internal
 * @ignore
 */
export type Tuple<T extends Array<any>> = { [K in keyof T]: T[K] };

/**
 * @ignore
 */
export type Collection<T = any> = Array<T> | Record<string, T>

/**
 * @ignore
 */
export type PlainObject<T = any> = Record<string, T>

interface Iteratee<T, R> {
  (value?: T, key?: number, ref?: Array<T>): R;
  (value?: T, key?: string, ref?: Record<string, T>): R;
}

/**
 * @ignore
 */
interface AccumulatorIteratee<T, R> {
  (accumulator?: R, value?: T, key?: number): R | void
  (accumulator?: R, value?: T, key?: string): R | void
}


/**
 * @ignore
 * @template T item type
 * @template R return type
 */
export type CollectionIteratee<T = any, R = any> = Iteratee<T, R>
/**
 * @ignore
 */
export type AccCollectionIteratee<T = any, R = any> = AccumulatorIteratee<T, R>
/**
 * @ignore
 */
export type KeyIteratee = string | number
/**
 * @ignore
 */
export type Entry<T = any> = [string, T]

/**
 * @ignore
 */
export type ArrayAble<T> = T | Array<T>