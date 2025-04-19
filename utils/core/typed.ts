export const getTag = (value: unknown) => Object.prototype.toString.call(value).replace(/\[object (.*)\]/, '$1')

export const isNaN = (value: unknown): value is number => Number.isNaN(value)

export const isInt = (value: unknown): value is number => Number.isInteger(value)

export const isNumber = (value: unknown): value is number => getTag(value) === 'Number' && !isNaN(value)

export const isFloat = (value: unknown): value is number => isNumber(value) && !isInt(value)

export const isUndefined = (value: unknown): value is undefined => getTag(value) === 'Undefined'

export const isNull = (value: unknown): value is null => getTag(value) === 'Null'

export const isBoolean = (value: unknown): value is boolean => getTag(value) === 'Boolean'

export const isString = (value: unknown): value is string => getTag(value) === 'String'

export const isFunction = <Args = any, R = any>(value: unknown): value is (...args: Args[]) => R => getTag(value) === 'Function'

export const isDate = (value: unknown): value is Date => getTag(value) === 'Date'

export const isObject = <T = any>(value: unknown): value is Record<string, T> => getTag(value) === 'Object'

export const isRegExp = (value: unknown): value is RegExp => getTag(value) === 'RegExp'

export const isBlob = (value: unknown): value is Blob => getTag(value) === 'Blob'

export const isMap = <K = any, V = any>(value: unknown): value is Map<K, V> => getTag(value) === 'Map'

export const isWeakMap = <K extends WeakKey = WeakKey, V = any>(value: unknown): value is WeakMap<K, V> => getTag(value) === 'WeakMap'

export const isSet = <T = any>(value: unknown): value is Set<T> => getTag(value) === 'Set'

export const isWeakSet = <T extends WeakKey = WeakKey>(value: unknown): value is WeakSet<T> => getTag(value) === 'WeakSet'

export const isSymbol = (value: unknown): value is symbol => getTag(value) === 'symbol'

export const isNil = (value: unknown): value is (null | undefined) => isUndefined(value) || isNull(value)

export const isArray = <T = any>(value: unknown): value is T[] => Array.isArray(value)

export const isPromise = <T = any>(value: unknown): value is Promise<T> => (
  (isObject(value) || isFunction(value))
  && isFunction((value as any).then)
  && isFunction((value as any).catch)
)

export const isPrimitive = <T = any>(value: unknown): value is T => value !== Object(value)

/**
 * @example
 * isEmpty(null) // => true
 * isEmpty(undefined) // => true
 * isEmpty('') // => true
 * isEmpty([]) // => true
 * isEmpty({}) // => true
 * isEmpty(new Map()) // => true
 * isEmpty(new Set()) // => true
 */
export const isEmpty = (value: any) => {
  if (isNil(value)) {
    return true
  }

  if (isArray(value) || isString(value)) {
    return !value.length
  }

  if (isMap(value) || isSet(value)) {
    return !value.size
  }

  if (isObject(value)) {
    return !Object.keys(value).length
  }

  return false
}

/**
 * @example
 * isEqual([1, 2, 3], [1, 2, 3]) // => true
 * isEqual({ a: 1, b: { c: { d: 'ddd' } } }, { a: 1, b: { c: { d: 'ddd' } } }) // => true
 */
export const isEqual = (x: any, y: any) => {
  if (getTag(x) !== getTag(y)) {
    return false
  }

  if (isDate(x) && isDate(y)) {
    return x.getTime() === y.getTime()
  }

  if (isRegExp(x) && isRegExp(y)) {
    return x.toString() === y.toString()
  }

  if (isArray(x) && isArray(y)) {
    if (x.length !== y.length) {
      return false
    }

    for (let i = 0; i < x.length; i++) {
      if (!isEqual(x[i], y[i])) {
        return false
      }
    }
    return true
  }

  if (isSet(x) && isSet(y)) {
    if (x.size !== y.size) {
      return false
    }

    const xArr = Array.from(x)
    const yArr = Array.from(y)

    for (let i = 0; i < xArr.length; i++) {
      if (!isEqual(xArr[i], yArr[i])) {
        return false
      }
    }
    return true
  }

  if (isMap(x) && isMap(y)) {
    if (x.size !== y.size) {
      return false
    }

    for (const [key, value] of x) {
      if (!isEqual(value, y.get(key))) {
        return false
      }
    }
    return true
  }

  if (isObject(x) && isObject(y)) {
    const xKeys = Object.keys(x)
    const yKeys = Object.keys(y)
    if (xKeys.length !== yKeys.length) {
      return false
    }

    for (const key of xKeys) {
      if (!isEqual(x[key], y[key])) {
        return false
      }
    }
    return true
  }

  return x === y || Object.is(x, y)
}
