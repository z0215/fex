import type { Arrayable, Maybe } from '../../../types'
import { isArray } from '../typed'

/**
 * @example
 * toArray('hello') // => ['hello']
 * toArray(['hello']) // => ['hello']
 */
export function toArray<T>(array?: Maybe<Arrayable<T>>): Array<T> {
  array = array ?? []
  return isArray(array) ? array : [array]
}
