import type { MutableRefObject } from 'react'
import type { Maybe } from '../types'
import { isFunction, isObject } from '../utils'

export type Target<T> = MutableRefObject<Maybe<T>> | (() => Maybe<T>) | Maybe<T>

export const getTarget = <T>(target: Target<T>) => {
  if (isFunction(target))
    return target()

  if (isObject(target) && 'current' in target)
    return target.current

  return target
}
