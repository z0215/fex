import type { AnyFunction } from '../../../types'

/**
 * @example
 * debounce(() => console.log('Trigger'))
 */
export const debounce = <T extends AnyFunction>(fn: T, delay = 300) => {
  let timer: ReturnType<typeof setTimeout>

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
