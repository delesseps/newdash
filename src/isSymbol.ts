import getTag from './.internal/getTag';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @since 5.5.0
 * @category Lang
 * @param value The value to check.
 * @returns Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * ```js
 * isSymbol(Symbol.iterator)
 * // => true
 *
 * isSymbol('abc')
 * // => false
 * ```
 */
export function isSymbol(value: any): value is Symbol {
  const type = typeof value;
  return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]');
}

export default isSymbol;
