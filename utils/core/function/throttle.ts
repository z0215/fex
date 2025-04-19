import type { AnyFunction } from '../../../types'

/**
 * @example
 * throttle(() => console.log('Trigger'))
 */
export const throttle = <T extends AnyFunction>(fn: T, time = 300) => {
  let startTime = Date.now()
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (Date.now() - startTime < time) {
      return
    }
    fn.apply(this, args)
    startTime = Date.now()
  }
}
