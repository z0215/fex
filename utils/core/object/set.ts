import type { AnyObject } from '../../../types'
import {
  isArray,
  isEmpty,
  isInt,
  isUndefined,
} from '../typed'

/**
 * @example
 * set({}, 'a.b.c', 'ccc') // => { a: b: { c: 'ccc' } }
 * set({}, ['a', 'b', 'c'], 'ccc') // => { a: b: { c: 'ccc' } }
 */
export const set = <T extends AnyObject, V>(
  obj: T,
  path: string | string[],
  value: V,
) => {
  if (!obj)
    return obj

  if (isEmpty(path) || isUndefined(value))
    return obj

  const root = { ...obj }
  const keys = (isArray(path) ? path.join('.') : path).match(/[^.[\]]+/g)
  if (keys) {
    keys.reduce<AnyObject>(
      (object, key, i) =>
        i < keys.length - 1
          ? (object[key] ??= isInt(+keys[i + 1]) ? [] : {})
          : (object[key] = value),
      root,
    )
  }

  return root
}
