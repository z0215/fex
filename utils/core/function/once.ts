import type { AnyFunction } from '../../../types'

/**
 * @example
 * const fn = once(() => Math.random())
 * // Only run once
 * fn() // => 0.5
 * fn() // => 0.5
 */
export const once = <T extends AnyFunction>(fn: T) => {
  let executed = false
  let result: ReturnType<T>
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!executed) {
      result = fn.apply(this, args)
      executed = true
    }
    return result
  }
}
