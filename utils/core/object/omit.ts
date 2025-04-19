import type { AnyObject } from '../../../types'

/**
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * omit(obj, ['b']) // => { a: 1, c: 3 }
 */
export const omit = <T extends AnyObject, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  if (!obj) {
    return {} as Omit<T, K>
  }
  if (!keys.length) {
    return obj as Omit<T, K>
  }
  return keys.reduce(
    (acc, key) => {
      Reflect.deleteProperty(acc, key)
      return acc
    },
    { ...obj },
  )
}
