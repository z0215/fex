import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { isFunction, isUndefined } from '../../utils'
import { useMemoFn } from '../useMemoFn'
import { type CookieOptions, createCookie } from './cookie'

export const cookie = createCookie()

/**
 * @example
 * const [cookie, setCookie] = useCookie('test')
 *
 * // Add & Update
 * setCookie('value')
 *
 * // Remove
 * setCookie(undefined)
 */
export const useCookie = (key: string, options?: CookieOptions) => {
  const [value, setValue] = useState(() => cookie.get(key))
  const updateValue = useMemoFn<Dispatch<SetStateAction<string | undefined>>>((newValue) => {
    const val = isFunction(newValue) ? newValue(value) : newValue
    if (isUndefined(val)) {
      cookie.remove(key)
    }
    else {
      cookie.set(key, val, options)
    }
    setValue(val)
  })
  return [value, updateValue] as const
}
