import type { AnyObject } from '../../../types'
import { isArray, isNil } from '../typed'

/**
 * @example
 * const obj = { a: 1, b: { c: 2 }, d: { e: 'eee' } }
 * remove(obj, 'b.c')
 * obj  // => const obj = { a: 1, b: {}, d: { e: 'eee' } }
 * remove(obj, ['d', 'e'])
 * obj  // => const obj = { a: 1, b: {}, d: {} }
 */
export const remove = <T extends AnyObject>(
  obj: T,
  path: string | string[],
) => {
  if (!obj)
    return true

  const paths = isArray(path) ? path : path.split(/[.[\]]/g)
  const lastKey = paths.pop()
  if (!lastKey)
    return true
  let current = obj

  for (const key of paths) {
    if ((isNil(current)))
      return true

    const unquotedKey = key.replace(/['"]/g, '')
    if (unquotedKey.trim() === '') {
      continue
    }
    current = current[unquotedKey]
  }

  return Reflect.deleteProperty(current, lastKey)
}
