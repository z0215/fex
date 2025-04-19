import type { AnyObject } from '../../../types'
import { isArray, isObject } from '../typed'
import { clone } from './clone'

/**
 * @example
 * const obj1 = { a: 1, obj: { d: 'ddd', e: 'eee' }, arr: [1, 2] }
 * const obj2 = { a: 2, obj: { c: 'ccc', e: 'fff' }, arr: [3, 4] }
 * console.log(merge(obj1, obj2)) // => { a: 2, obj: { d: 'ddd', c: 'ccc', e: 'fff' }, arr: [1, 2, 3, 4] }
 */
export const merge = <
  S1 extends AnyObject,
  S2 extends AnyObject,
>(
  source1: S1,
  source2: S2,
) => {
  const result = clone(source1) as AnyObject
  for (const key of Object.keys(source2)) {
    result[key] = isObject(source1[key]) && isObject(source2[key])
      ? merge(source1[key], source2[key])
      : key in source1 && isArray(source1[key]) && isArray(source2[key])
        ? [...source1[key], ...source2[key]]
        : source2[key]
  }
  return result as S1 & S2
}
