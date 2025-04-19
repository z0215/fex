import type { AnyObject } from '../../../types'
import {
  isArray,
  isDate,
  isMap,
  isNaN,
  isNumber,
  isObject,
  isRegExp,
  isSet,
  isUndefined,
} from '../typed'

interface CloneOptions {
  /**
   * Clone depth
   */
  depth?: number
  /**
   * Custom data formatting
   */
  formatter?: <T>(key: string | number | symbol, value: T) => T
}

/**
 * @example
 * clone({ a: 1 }) // => { a: 1 }
 * clone({ a: 1, b: 2 }, {
 *   formatter(key, value) {
 *     return key === 'a' ? 'cutom' : value
 *   }
 * }) // => { a: 'cutom', b: 2 }
 *
 * const obj = { a: 1, b: { c: { d: 'ddd' } } }
 * clone(obj,{
 *   depth:3
 * }) // => { a: 1, b: { c: { d: 'updated' } } }
 * clone(obj) // => { a: 1, b: { c: { d: 'ddd' } } }
 * // obj => { a: 1, b: { c: { d: 'updated' } } }
 * obj.b.c.d = 'updated'
 */
export const clone = <T extends AnyObject>(obj: T, options?: CloneOptions) => {
  const {
    depth,
    formatter,
  } = options ?? {}
  const map = new Map()

  const cloneDeep = (target: any, dep = 1) => {
    const getValue = (value: T) => {
      if (isNumber(depth) && !isNaN(depth)) {
        if (dep > depth) {
          return value
        }
      }

      if (value && typeof value === 'object') {
        if (map.has(value)) {
          return map.get(value) as T
        }

        const data = cloneDeep(value, dep + 1) as T
        map.set(target, data)
        return data
      }
      return value
    }
    if (isArray(target)) {
      const output = []
      for (const item of target) {
        output.push(getValue(item))
      }
      map.set(target, output)
      return output
    }
    if (isObject(target)) {
      const output = Object.create(null)
      for (const key of Object.keys(target)) {
        const value = Reflect.get(target, key)
        const newValue = isUndefined(formatter) ? value : formatter(key, value)
        Reflect.set(output, key, getValue(newValue))
      }
      map.set(target, output)
      return output
    }
    if (isSet(target)) {
      const output = new Set()
      for (const value of target) {
        output.add(getValue(value))
      }
      map.set(target, output)
      return output
    }
    if (isMap(target)) {
      const output = new Map()
      for (const [key, value] of target) {
        output.set(key, getValue(value))
      }
      map.set(target, output)
      return output
    }
    if (isDate(target)) {
      return new Date(Number(target))
    }
    if (isRegExp(target)) {
      const output = new RegExp(target.source, target.flags)
      output.lastIndex = target.lastIndex
      return output
    }
    return target
  }

  return cloneDeep(obj)
}
