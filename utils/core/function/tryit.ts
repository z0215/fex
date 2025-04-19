import type { AnyFunction } from '../../../types'
import { isPromise } from '../typed'

/**
 * @example
 * const [err, result] = await tryit(() => fetch('/test'))()
 * console.log(err) // null
 * console.log(result) // Response
 *
 * const [err, result] = tryit((text: string) => JSON.parse(text))('Test')
 * console.log(err) // SyntaxError
 * console.log(result) // null
 *
 * const [err, result] = tryit((text: string) => JSON.parse(text))('{"a":1}')
 * console.log(err) // null
 * console.log(result) // { a: 1 }
 */
export const tryit = <T extends AnyFunction>(fn: T) => {
  return <E = Error>(...args: Parameters<T>): ReturnType<T> extends Promise<infer R> ?
    Promise<[E, null] | [null, R]> :
    [E, null] | [null, ReturnType<T>] => {
    try {
      const result = fn(...args)
      return (
        isPromise(result)
          ? result.then(
              value => [null, value],
              err => [err, null],
            )
          : [null, result]
      ) as any
    }
    catch (err) {
      return [err as E, null] as any
    }
  }
}
