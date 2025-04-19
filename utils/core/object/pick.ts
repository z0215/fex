import type { AnyObject } from '../../../types'

/**
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * pick(obj, ['a', 'c']) // => { a: 1, c: 3 }
 */
export const pick = <T extends AnyObject, K extends keyof T>(
  obj: T,
  keys: K[],
) => Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k as K))) as Pick<T, K>
