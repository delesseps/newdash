import { metaMap } from "./GLOBAL";
import { identity } from "./identity";

/**
 * The base implementation of `setData` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
const baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};


export default baseSetData
