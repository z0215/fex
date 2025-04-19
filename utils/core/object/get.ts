import type { AnyObject } from '../../../types'
import {
  isArray,
  isNil,
  isUndefined,
} from '../typed'

/**
 * @example
 * const person = {
 *   name: 'John',
 *   friends: [{ name: 'Jane' }]
 * }
 *
 * get(person, 'friends[0].name') // => 'Jane'
 * get(person, ['friends', '0', 'name']) // => 'Jane'
 */
export const get = <T extends AnyObject>(
  obj: T,
  path: string | string[],
  defaultValue?: T,
): T => {
  if (!obj)
    return obj
  const paths = isArray(path) ? path : path.split(/[.[\]]/g)
  let current = obj
  for (const key of paths) {
    if ((isNil(current)))
      return defaultValue as T

    const unquotedKey = key.replace(/['"]/g, '')
    if (unquotedKey.trim() === '') {
      continue
    }
    current = current[unquotedKey]
  }

  if (!isUndefined(defaultValue) && isUndefined(current))
    return defaultValue

  return current
}
